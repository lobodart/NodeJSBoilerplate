module.exports = {

    auth: {
        _body: {
            username: { required: true, notEmpty: true },
            password: { required: true, notEmpty: true }
        }
    },

    facebook_token: {
        _body: {
            token: { required: true, notEmpty: true }
        }
    }
    
};
