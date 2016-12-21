var async = require('async');
var multer = require('multer');
var _ = require('lodash');

var models = require('app/models');
var User = models.User;

var middlewares = require('app/middlewares');

var config = require('app/config');
var s3 = config.AWS.s3;

module.exports.middlewares = [
    multer().single('picture')
];

module.exports.action = function (req, res, next) {
    var _userEditableProperties = [
        'email',
        'firstName',
        'lastName',
        'password'
    ];

    async.waterfall([
        // Check the received parameters
        function(callback) {
            if (req.file && req.file.size > config.userPictureMaxSize) {
                return res.entityTooLarge('picture_too_large');
            }

            return callback(null);
        },
        // Check if an User already exists with this username
        function(callback) {
            User.count({
                username: req.body.username
            }, function(err, count) {
                if (err) return callback(err);
                if (count > 0) return res.conflict('username_exists');
                return callback(null);
            });
        },
        // Create the new user
        function(callback) {
            var newUser = new User({
                username: req.body.username
            });

            _.forEach(_userEditableProperties, function(value, idx) {
                newUser[value] = req.body[value];
            });

            newUser.save(function(err, user) {
                if (err) return callback(err);

                return callback(null, user);
            });
        },
        // Uncomment the following function if you want to store the user picture on S3
        // function(user, callback) {
        //     if (file = req.file) {
        //         var filePath = 'users/' + user._id + ".png";
        //         s3.upload({ Key:  filePath, Body: file.buffer }, function(err, data) {
        //             if (err) return;

        //             user.picture = filePath;
        //             user.save();
        //         });
        //     }

        //     return callback(null, user);
        // }
    ], function(err, user) {
        if (err) return next(err);

        user.password = undefined;
        user.authData = undefined;
        user.isAdmin = undefined;
        return res.created(user);
    });
};

module.exports.requirements = {
    username: { required: true/*, notEmpty: true*/ },
    password: {
        required: true,
        // notEmpty: true,
        isLength: { min: 6, error: 'password_too_short' }
    },
    email: {
        isEmail: { error: 'invalid_email' }
    }
};
