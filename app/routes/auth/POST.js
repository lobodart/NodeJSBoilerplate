var bcrypt = require('bcrypt');
var async = require('async');

var models = require('app/models');
var User = models.User;

var middlewares = require('app/middlewares');
var auth = middlewares.auth;

var config = require('app/config');

var helpers = require('app/helpers');

module.exports.middlewares = [];

module.exports.action = function (req, res, next) {
    User.findOne({
        username: req.body.username
    }, function(err, user) {

        if (err) next(err);

        if (!user) return res.unauthorized('invalid_auth');

        bcrypt.compare(req.body.password, user.password, function(err, passwordOk) {
            if (!passwordOk) return res.unauthorized('invalid_auth');

            helpers.createUserToken(user, req.redis, function(err, token) {
                return res.ok({
                    token: token
                });
            });
        });
    });
};

module.exports.requirements = {
    username: { required: true, /*notEmpty: true*/ },
    password: { required: true, /*notEmpty: true*/ }
};
