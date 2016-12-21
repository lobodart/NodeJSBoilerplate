var async = require('async');
var multer = require('multer');
var _ = require('lodash');

var models = require('app/models');
var User = models.User;

var middlewares = require('app/middlewares');
var auth = middlewares.auth;

var config = require('app/config');

module.exports.middlewares = [
    auth()
];

module.exports.action = function (req, res, next) {
    var editedFields = {};
    var _userEditableProperties = [
        'email',
        'firstName',
        'lastName',
        'password'
    ];

    _.forEach(_userEditableProperties, function(value, idx) {
        if (value in req.body)
            editedFields[value] = req.body[value];
    });

    if (editedFields.email && config.emailAsUsername)
        editedFields.email = undefined;

    User.update({
        _id: req.session.user._id
    }, editedFields, function (err, rowsAffected) {
        if (err) return next(err);
        return res.ok();
    });
};
