var async = require('async');

var models = require('app/models');
var User = models.User;

var middlewares = require('app/middlewares');
var auth = middlewares.auth;

module.exports.middlewares = [
    auth()
];

module.exports.action = function (req, res, next) {
    async.waterfall([
        function(callback) {
            User.findById(req.session.user._id, function (err, user) {
                if (err) return callback(err);

                return callback(null, user);
            }).lean().select('-password -isAdmin -authData');
        },
        // Uncomment the following function if you want to store the user picture on S3
        // function(user, callback) {
        //     if (picturePath = user.picture)
        //         user.picture = s3.getSignedUrl('getObject', { Key: picturePath });
        //
        //     return callback(null, user);
        // }
    ], function(err, user) {
        if (err) return next(err);

        return res.ok(user);
    });
};
