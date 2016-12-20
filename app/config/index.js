var config = require('./config');
var simpleDuration = require('app/helpers').simpleDuration;

// node_env can either be "development", "production" or "test"
var nodeEnv = process.env.NODE_ENV || 'development';

// Port to run the app on
var defaultPort = 8000;
if (nodeEnv === 'production')
    defaultPort = 80;
var port = process.env.PORT || defaultPort;

// If AWS is used, set it
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

// Exports configuration for use by app.js
module.exports = {
    // Information about the application
    app: Object.assign(config.app, {
        name: process.env.APP_NAME || config.app.name,
        userPictureMaxSize: (config.app.userPictureMaxSize * Math.pow(10, 6)),
        tokenExpirationDate: (config.app.tokenExpirationDate ? simpleDuration(config.app.tokenExpirationDate) : null)
    }),
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
