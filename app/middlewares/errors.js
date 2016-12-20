var _ = require('lodash');

module.exports = function(req, res, next) {

	res._error = function(code, content) {
		var returnObject = {};
		if (_.isString(content)) returnObject.error = content;
		else returnObject = content;

		res.status(code).json(returnObject);
	};

	// 2xx Codes
	res.ok = function(result) { res.status(200).json(result); };
	res.created = function(result) { res.status(201).json(result); };

    // 4xx Error Codes
	res.badRequest = function(content) { res._error(400, content); };
	res.unauthorized = function(content) { res._error(401, content); };
	res.forbidden = function(content) { res._error(403, content); };
	res.notFound = function(content) { res._error(404, content); };
	res.notAllowed = function(content) { res._error(405, content); };
	res.conflict = function(content) { res._error(409, content); };
	res.entityTooLarge = function(content) { res._error(413, content); };

	// 5xx Error Codes
	res.internalError = function(err) {
		console.log(err);
		res._error(500, 'server_error');
	};

	next();
};
