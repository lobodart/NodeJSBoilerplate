var middlewares = require('app/middlewares');
var auth = middlewares.auth;

module.exports.middlewares = [
    auth()
];

module.exports.action = function (req, res, next) {
    res.ok({ success: true });
};
