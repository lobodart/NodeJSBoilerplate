var config = require('./config.js');

// node_env can either be "development", "production" or "test"
var nodeEnv = process.env.NODE_ENV || 'development';

// Port to run the app on
var defaultPort = 8000;
if (nodeEnv === 'production')
    defaultPort = 80;
var port = process.env.PORT || defaultPort;

// If AWS is used, setting it
if (config.AWS) {
    var AWS = require('aws-sdk');
    var AWSSettings = config.AWS;
    var AWSCredentials = {
        accessKeyId: AWSSettings.accessKeyId,
        secretAccessKey: AWSSettings.secretAccessKey,
        region: AWSSettings.region
    };

    AWS.config.update(AWSCredentials);
}

var app = config.app;
app.name = process.env.APP_NAME || app.name;
app.userPictureMaxSize = (app.userPictureMaxSize * Math.pow(10, 6));

// Exports configuration for use by app.js
module.exports = {
    // Information about the application
    app: config.app,
    // Node environment.
    env: nodeEnv,
    // Current API url (used to build callback url for hydraters)
    apiUrl: process.env.API_URL || 'http://0.0.0.0:' + port,
    // Port to listen on
    port: port,
    // URL for mongo access
    mongoUrl: config.mongo.urls[nodeEnv] || 'mongodb://localhost/' + config.mongo.appName + '-' + nodeEnv,
    // Session
    redisCfg: config.redis.cfgs[nodeEnv],
    // AWS Settings
    AWS: {
        s3: AWS ? new AWS.S3({ params: { Bucket: config.AWS.s3.bucket } }) : null
    },
    // The key used to test the Boilerplate
    // You can safely remove it
    testingKey: process.env.TESTING_KEY
};
