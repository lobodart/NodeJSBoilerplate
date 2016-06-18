require('app-module-path').addPath(__dirname);

var express = require('express');
var app = express();

var morgan = require('morgan');
var bodyParser = require('body-parser');

var middlewares = require('app/middlewares');
var config = require('app/config');

var path = require('path'); // FOR ADMIN

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());
app.use(middlewares.errors);

// This middleware is used to test the Boilerplate
// /!\ IT IS HIGHLY RECOMMENDED TO REMOVE IT !
if (config.testingKey) app.use(middlewares.testing);

// Using Redis middleware
app.use(middlewares.redis(config.redisCfg));

if (config.env === "development") app.use(morgan('tiny'));

// Load routes
require('app/routes').loadRoutes(app);

// Mongoose connection
var mongoose = require('mongoose');
mongoose.connect(config.mongoUrl, function(err) {
	if (err) throw Error('Mongo connection failed!');
});

app.listen(config.port, function() {
	console.log('Node app is running on port', config.port);
});

var _ = require('lodash');
app.get('/api/admin/models', function(req, res, next) {
	var models = require('app/models');
	var array = [];

	_.forEach(models, function(object, index) {
		array.push({
			name: index
		});
	});

	res.ok({
		models: array
	});
});

app.use('/public', express.static(__dirname + '/app/views/public'));
app.get('/api/admin/models/:model', function(req, res, next) {
	var camelCasedModel = req.params.model.toLowerCase().replace(/(^[a-z]|\-[a-z])/g, function(g) { return g.toUpperCase(); });
	var model = require('app/models')[camelCasedModel];
	if (!model) {
		return res.notFound('model_not_found');
	}
	//console.log(model.schema.paths);
	//console.log(!model.schema.paths.options ? '' : model.schema.paths.options.type);
	var array = [];
	_.forEach(model.schema.paths, function(object, index) {
		var newObject = {
			name: index,
			type: object.instance,
			options: object.options
		};

		if (caster = object.caster) newObject.contentType = caster.instance;

		array.push(newObject);
	});

	res.ok({ properties: array });
});

app.get('/api/admin/models/:model/data', function(req, res, next) {
	var camelCasedModel = req.params.model.toLowerCase().replace(/(^[a-z]|\-[a-z])/g, function(g) { return g.toUpperCase(); });
	var model = require('app/models')[camelCasedModel];
	if (!model) {
		return res.notFound('model_not_found');
	}

	model.find({}, function(err, data) {
		if (err) next(err);

		res.ok({ data: data });
	});
});

app.post('/api/admin/models/:model', function(req, res, next) {
	var camelCasedModel = req.params.model.toLowerCase().replace(/(^[a-z]|\-[a-z])/g, function(g) { return g.toUpperCase(); });
	var model = require('app/models')[camelCasedModel];
	if (!model) {
		return res.notFound('model_not_found');
	}

	return res.unauthorized("interdit");
	model.create(req.body, function (err, object) {
		if (err) return next(err);
		res.ok({success: true});
	});
});

app.get('/admin(?:/*)?', function(req, res, next) {
	res.sendFile(path.join(__dirname + '/app/views/admin/index.html'));
});


module.exports = app;
