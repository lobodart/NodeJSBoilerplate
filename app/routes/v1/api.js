var express = require('express');
var router = express.Router();

var request = require('supertest');
var requirements = require('express-requirements');

var mongoose = require('mongoose');
var User = require('app/models').User;
var config = require('app/config');

var crypto = require('crypto');
var bcrypt = require('bcrypt');
var async = require('async');
var simpleDuration = require('app/helpers').simpleDuration;

router.post('/auth', requirements.validate('api.auth'), function(req, res, next) {
    async.waterfall([
        function (callback) {
            User.findOne({ username: req.body.username }, function(err, user) {
                if (err) return callback(err);
                if (!user) return res.unauthorized('invalid_auth');
                callback(null, user);
            }).select('-authData');
        },
        function (user, callback) {
            bcrypt.compare(req.body.password, user.password, function(err, passwordOk) {
                if (err) return callback(err);
                if (!passwordOk) return res.unauthorized('invalid_auth');
                callback(null, user);
            });
        },
        function (user, callback) {
            createTokenForUser(user, req.redis, function(err, token) {
                callback(err, user, token);
            });
        }
    ], function(err, user, token) {
        if (err) return next(err);

        res.ok({
            token: token
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

function createTokenForUser(user, redis, tokenCallback) {
    async.waterfall([
        function (callback) {
            crypto.randomBytes(64, function(err, token) {
                if (err || !token) return callback(err, null);
                callback(null, token.toString('hex'));
            });
        },
        function (token, callback) {
            var redisKey = "token:" + token;
            redis.set(redisKey, user.id, function(err, reply) {
                if (err) return callback(err, null);
                callback(null, token, redisKey);
            });
        },
        function (token, redisKey, callback) {
            if (!config.app.tokenExpirationDate) return callback(null, token);
            redis.expireat(redisKey, parseInt((+new Date()) / 1000, 10) + config.app.tokenExpirationDate, function (err, reply) {
                if (err) return callback(err, null);
                callback(null, token);
            });
        }
    ], function(err, token) {
        if (err) return tokenCallback(err, null);
        tokenCallback(null, token);
    });
}

module.exports = router;
