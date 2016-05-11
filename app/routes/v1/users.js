var express = require('express');
var router = express.Router();
var async = require('async');
var multer = require('multer');
var _ = require('lodash');
var requirements = require('express-requirements');

var config = require('app/config');
var models = require('app/models');
var middlewares = require('app/middlewares');

var s3 = config.AWS.s3;

var auth = middlewares.auth;

var User = models.User;
var Teacher = models.Teacher;

var _userEditableProperties = [
    'email',
    'firstName',
    'lastName',
    'password'
];

/* POST /users */
router.post('/', multer().single('picture'), requirements.validate('users.post_user'), function(req, res, next) {
    async.waterfall([
        // Check the received parameters
        function(callback) {
            if (file = req.file)
                if (file.size > config.userPictureMaxSize) return res.entityTooLarge('picture_too_large');

            return callback(null);
        },
        // Check if an User already exists with this username
        function(callback) {
            User.count({ username: req.body.username }, function(err, count) {
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
});

/* GET /users/me */
router.get('/me', auth(), function(req, res, next) {
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

        return res.send(user);
    });
});

/* PUT /users/me */
router.put('/me', auth(), function(req, res, next) {
    var editedFields = {};

    _.forEach(_userEditableProperties, function(value, idx) {
        if (value in req.body)
            editedFields[value] = req.body[value];
    });

    if (editedFields.email && config.emailAsUsername)
        editedFields.email = undefined;

    User.update({ _id: req.session.user._id }, editedFields, function (err, rowsAffected) {
        if (err) return next(err);

        return res.ok();
    });
});

module.exports = router;
