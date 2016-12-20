module.exports = function(app) {
    app.use('/status', function (req, res, next) {
        return res.ok({
            status: 'ok'
        });
	});

    // This route MUST BE the last one defined
	app.use('/*', function (req, res, next) {
        return res.notFound('endpoint_not_found');
	});
};
