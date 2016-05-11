var express = require('express');
var fs = require('fs');
var path = require('path');
var requirements = require('express-requirements');

var middlewares = require('app/middlewares');

function getDirectories(srcpath) {
	return fs.readdirSync(srcpath).filter(function(file) {
		return fs.statSync(path.join(srcpath, file)).isDirectory();
	});
}

module.exports.loadRoutes = function(app) {
	var folders = getDirectories(__dirname);
	folders.forEach(function(version){
		var router = express.Router();
		router.use(requirements.use(__dirname + '/' + version + '/requirements'));
		require('./' + version)(router);
		app.use('/api/' + version, router);
	});
};