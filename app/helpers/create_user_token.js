var crypto = require('crypto');

var redisToken = function (user, redis, callback) {
    crypto.randomBytes(64, function(err, token) {
        if (err || !token) return callback(err, null);

        var accessToken = token.toString('hex');
        redis.set("token:" + accessToken, user.id, function(err, reply) {
            if (err) return callback(err, null);

            return callback(null, accessToken);
        });
    });
};

module.exports = redisToken;
