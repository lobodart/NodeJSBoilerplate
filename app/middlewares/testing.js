// This middleware is used to test the Boilerplate
// You can safely remove this file

var config = require('app/config');

module.exports = function(req, res, next) {
    var testingKey = config.testingKey;

    if (!testingKey) return next();

    var testingHeader = req.headers['x-testing-key'];
    if (!testingHeader || (testingHeader != testingKey))
        return res.forbidden('access_denied');

    next();
};
