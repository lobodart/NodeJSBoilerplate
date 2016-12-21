var _ = require('lodash');
var async = require('async');
var validator = require('validator');

module.exports = function (requirements) {
    return function (req, res, next) {
        function validateRequirements(key, value, requirements, callback) {
            if (value === undefined) {
                return callback(requirements.required ? 'missing_' + key + '_parameter' : null);
            }

            delete(requirements.required);
            async.eachOfSeries(requirements, function (v, k, callback) {
                var error = 'invalid_' + key;
                var params = v;
                if (_.isObject(params)) {
                    error = params.error || error;
                    delete(params.error);
                }

                params = params.value || params;
                if (!validator[k]) {
                    throw Error('Validator ' + k + ' doesn\'t exist');
                }

                if (!validator[k](value, params)) return callback(error);
                callback();
            }, function (err) {
                callback(err);
            });
        }

        function browseRequirements(requirements, scope) {
            var method = req.method;
            var defaultScope = scope || ((method == 'POST' || method == 'PUT') ? req.body : req.query);
            async.eachOfSeries(requirements, function (v, k, callback) {
                var scope = defaultScope;
                if (_.startsWith(k, '_')) {
                    scope = req[_.trimStart(k, '_')];
                    return browseRequirements(requirements[k], scope);
                }

                validateRequirements(k, scope[k], v, function (err) {
                    if (err) return res.badRequest(err);
                    callback(null);
                });
            }, function (err) {
                next(err);
            });
        }

        browseRequirements(JSON.parse(JSON.stringify(requirements)));
    };
};
