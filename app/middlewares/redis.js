var express = require('express');
var app = express();

var redis = require('redis');

var client;
var redisKey = 'redis';

module.exports = function(opts) {
    client = redis.createClient(opts);

    client.on('error', function(err) {
        if (err) throw Error('Redis connection failed!');
    });

    return function(req, res, next) {
        if (client.connected) {
            req[redisKey] = client;
            return next();
        }

        client.on('ready', function() {
            req[redisKey] = client;
            next();
        });
    };
};
