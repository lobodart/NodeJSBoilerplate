var express = require('express');
var app = express();

var User = require('app/models/User');

function auth(opts) {
    return function(req, res, next) {
        opts = opts || {};

        var isAdmin = opts.admin || false;

        var authHeader = req.headers['authorization'];

        if (!authHeader) return res.unauthorized('auth_header_required');

        var tokenRegex = /^token\s([a-z0-9]+)$/i;
        var match = tokenRegex.exec(authHeader);

        if (!match) return res.unauthorized('invalid_auth_header');

        var token = match[1].toLowerCase();
        req.redis.get("token:" + token, function(err, userId) {
            if (!userId) return res.unauthorized('invalid_token');

            User.findById(userId, function (err, user) {
                if (!user) return res.unauthorized('invalid_token');
                if (!user.isAdmin && isAdmin) return res.forbidden('access_denied');

                req.session = {
                    user: user
                };

                next();
            }).select('-password');
        });
    };
};

module.exports = auth;
