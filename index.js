require('app-module-path').addPath(__dirname);

var express = require('express');
var app = express();

var morgan = require('morgan');
var bodyParser = require('body-parser');

var middlewares = require('app/middlewares');
var config = require('app/config');

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

module.exports = app;
