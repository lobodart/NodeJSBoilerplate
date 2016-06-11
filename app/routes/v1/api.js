var express = require('express');
var router = express.Router();

var request = require('supertest');
var requirements = require('express-requirements');

var mongoose = require('mongoose');
var User = require('app/models/User');
var config = require('app/config');

var crypto = require('crypto');
var bcrypt = require('bcrypt');
var async = require('async');

router.post('/auth', requirements.validate('api.auth'), function(req, res, next) {
    User.findOne({
        username: req.body.username
    }, function(err, user) {

        if (err) next(err);

        if (!user) return res.unauthorized('invalid_auth');

        bcrypt.compare(req.body.password, user.password, function(err, passwordOk) {
            if (!passwordOk) return res.unauthorized('invalid_auth');

            createTokenForUser(user, req.redis, function(err, token) {
                return res.ok({
                    token: token
                });
            });
        });
    });
});

router.post('/auth/facebook', requirements.validate('api.facebook_token'), function(req, res, next) {
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
                if (err) return res.unauthorized("invalid_token");

                var body = JSON.parse(response.text);
                return callback(null, body);
            });
        },
        function(body, callback) {
            User.findOne({ "email": body.email }, function(err, user) {
                if (err) return callback(err);

                return callback(null, user, body);
            });
        },
        function(user, body, callback) {
            var authData = JSON.stringify({
                "access_token": facebookToken,
                "id": body.id
            });

            if (user) {
                user.authData = authData
                user.save(function(err) {
                    if (err) return callback(err);

                    return callback(null, user);
                });
            } else {
                var newUser = new User({
                    "firstName": body.first_name,
                    "lastName": body.last_name,
                    "username": body.email,
                    "authData": authData
                });

                newUser.save(function(err) {
                    if (err) return callback(err);

                    return callback(null, newUser);
                });
            }
        },
        function(user, callback) {
            createTokenForUser(user, req.redis, function(err, token) {
                if (err) callback(err);

                callback(null, token);
            });
        }
        ], function(err, token) {
            if (err) return next(err);

            return res.ok({ "token": token });
        });
});

function createTokenForUser(user, redis, callback) {
    crypto.randomBytes(64, function(err, token) {
        if (err || !token) return callback(err, null);

        var accessToken = token.toString('hex');
        redis.set("token:" + accessToken, user.id, function(err, reply) {
            if (err) return callback(err, null);

            return callback(null, accessToken);
        });
    });
}

module.exports = router;
