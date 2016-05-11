module.exports = function(req, res, next) {

	res._error = function(code, message) { res.status(code).json({ error: message }); };

	// 2xx Codes
	res.ok = function(result) { res.status(200).json(result); };
	res.created = function(result) { res.status(201).json(result); };

    // 4xx Error Codes
	res.badRequest = function(message) { res._error(400, message); };
	res.unauthorized = function(message) { res._error(401, message); };
	res.forbidden = function(message) { res._error(403, message); };
	res.notFound = function(message) { res._error(404, message); };
	res.notAllowed = function(message) { res._error(405, message); };
	res.conflict = function(message) { res._error(409, message); };
	res.entityTooLarge = function(message) { res._error(413, message); };

	// 5xx Error Codes
	res.internalError = function(err) {
		console.log(err);
		res._error(500, 'server_error');
	};

	next();
};
