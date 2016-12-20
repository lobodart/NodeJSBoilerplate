var config = require('app/config');

var requirements = {

    post_user: {
        _body: {
            username: { required: true, notEmpty: true },
            password: {
                required: true,
                notEmpty: true,
                isLength: { min: 6, errorMessage: 'password_too_short' }
            },
            email: {
                isEmail: { errorMessage: 'invalid_email' }
            }
        }
    }

};

if (config.app.emailAsUsername) {
    requirements.post_user._body.username.isEmail = {
        errorMessage: 'invalid_username_syntax'
    };
}

module.exports = requirements;
