var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var requirements = require('express-requirements');

var middlewares = require('app/middlewares');

function getElementsInFolder(srcpath) {
	return fs.readdirSync(srcpath).filter(function(file) {
		return file;
	});
}

module.exports.loadRoutes = function(app) {
	function recursive(apiPath, folderPath) {
		var srcPath = __dirname + folderPath;
		var folders = getElementsInFolder(srcPath);
		var route = (apiPath ? app.route(apiPath) : null);
		folders.forEach(function(version) {
			if (fs.statSync(path.join(srcPath, version)).isDirectory()) {
				recursive((apiPath || '') + '/' + version, folderPath + '/' + version);
				return;
			}

			if (!route) return;

			var regex = /^(?:(GET|POST|PUT|DELETE|ALL)\.js$)/i;
			var matches = regex.exec(version);
			if (!matches) return;

			var method = matches[1].toLowerCase();
			var requiredFilePath = path.join(srcPath, version);
			var requiredFile = require(requiredFilePath);

			var action = requiredFile.action;
			if (!action || !_.isFunction(action)) {
				throw Error('Action is not defined or is not a function for route ' + apiPath);
			}

			var routeMiddlewares = requiredFile.middlewares || [];
			if (requiredFile.requirements && _.isObject(requiredFile.requirements)) {
				routeMiddlewares.push(middlewares.requirements(requiredFile.requirements));
			}
			
			route[method](routeMiddlewares, action);
		});
	}

	recursive('/api', '/.');
};
