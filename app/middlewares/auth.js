var async = require('async');
var config = require('app/config');

var User = require('app/models').User;

function auth(opts) {
    return function(req, res, next) {
        opts = opts || {};

        var isAdmin = opts.admin || false;

        var authHeader = req.headers['authorization'];

        if (!authHeader) return res.unauthorized('auth_required');

        var tokenRegex = /^token\s([a-z0-9]+)$/i;
        var match = tokenRegex.exec(authHeader);

        if (!match) return res.unauthorized('invalid_auth_header');

        var token = match[1].toLowerCase();
        var redisKey = "token:" + token;

        async.waterfall([
            function (callback) {
                req.redis.get(redisKey, function(err, userId) {
                    if (!userId) return res.unauthorized('invalid_auth_token');
                    callback(null, userId);
                });
            },
            function (userId, callback) {
                User.findById(userId, function (err, user) {
                    if (err) return callback(err);
                    if (!user) {
                        return req.redis.del(redisKey, function (err, reply) {
                            if (err) callback(err);
                            return res.unauthorized('invalid_auth_token');
                        });
                    }

                    callback(null, user);
                }).select('-password');
            },
            function (user, callback) {
                if (!user.isAdmin && isAdmin) return res.forbidden('access_denied');
                if (!config.app.tokenExpirationDate) return callback(null, token);
                req.redis.expireat(redisKey, parseInt((+new Date()) / 1000, 10) + config.app.tokenExpirationDate, function (err, reply) {
                    callback(err, user);
                })
            },
            function (user, callback) {
                req.session = {
                    user: user
                };

                callback(null, user);
            }
        ], function(err, obj) {
            next(err);
        });
    };
};

module.exports = auth;
