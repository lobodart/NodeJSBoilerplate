var bcrypt = require('bcrypt');
var async = require('async');
var request = require('supertest');

var models = require('app/models');
var User = models.User;

var middlewares = require('app/middlewares');
var auth = middlewares.auth;

var config = require('app/config');

var helpers = require('app/helpers');

module.exports.middlewares = [];

module.exports.action = function (req, res, next) {
    var facebookToken = req.body.token;

    async.waterfall([
        function(callback) {
            request("https://graph.facebook.com")
            .get('/me')
            .query({
                access_token: facebookToken,
                fields: "id,first_name,last_name,email,picture"
            })
            .expect(200)
            .end(function(err, response) {
                if (err) return res.unauthorized('invalid_token');

                var body = JSON.parse(response.text);
                return callback(null, body);
            });
        },
        function(body, callback) {
            User.findOne({
                email: body.email
            }, function(err, user) {
                if (err) return callback(err);

                return callback(null, user, body);
            });
        },
        function(user, body, callback) {
            var authData = JSON.stringify({
                access_token: facebookToken,
                id: body.id
            });

            if (user) {
                user.authData = authData;
                user.save(function(err) {
                    if (err) return callback(err);
                    return callback(null, user);
                });
            } else {
                var newUser = new User({
                    firstName: body.first_name,
                    lastName: body.last_name,
                    username: body.email,
                    authData: authData
                });

                newUser.save(function(err) {
                    if (err) return callback(err);
                    return callback(null, newUser);
                });
            }
        },
        function(user, callback) {
            helpers.createUserToken(user, req.redis, function(err, token) {
                if (err) callback(err);
                callback(null, token);
            });
        }
    ], function(err, token) {
        if (err) return next(err);
        return res.ok({
            token: token
        });
    });
};

module.exports.requirements = {
    token: { required: true, /*notEmpty: true*/ }
};
