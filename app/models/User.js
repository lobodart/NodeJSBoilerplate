var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var async = require('async');

var config = require('app/config');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        default: null
    },
    authData: {
        type: String,
        default: null
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    picture: {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: (config.app.emailAsUsername),
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    "versionKey": false,
    "timestamps": true
});

UserSchema.pre('save', function (next) {
    if (this.isNew) {
        if (!this.authData && !this.password) return next(new Error('No auth credentials provided'));
        if (config.app.emailAsUsername) this.email = this.username;
    }

    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) next();

    var newUser = this;
    // Generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        // Hash the password using our new salt
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            if (err) return next(err);
            // 0verride the cleartext password with the hashed one
            newUser.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('User', UserSchema);
