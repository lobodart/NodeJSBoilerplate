module.exports = {

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
