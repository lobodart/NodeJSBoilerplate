var appConfig = {
    // Name for the current instance (api, api-staging)
    name: 'api',
    // If true, when a User will be created: user.email = user.username
    emailAsUsername: false,
    // User picture maximum size (Mb)
    userPictureMaxSize: 5
};

// MongoDB Configuration
var mongoConfig = {
    // Required for default db name used in URLs
    // Use only alphanumerics characters, _ and -
    appName: 'my-node-api',
    // All the URLs used to connect to your MongoDB
    urls: {
        // To add an URL for a specific environment,
        // write the name of the environment as a key
        // Examples:
        // production: 'mongodb://localhost/myapp-prod'
        // development: 'mongodb://localhost/myapp-dev'
        //
        // If nothing is specified for an environment,
        // the default URL will be mongodb://localhost/<appName>-<environment>
        production: process.env.MONGODB_URI
    }
};

var redisConfig = {
    // All the URLs used to connect to your Redis server
    cfgs: {
        // To add an URL or an object for a specific environment,
        // write the name of the environment as a key
        // Examples:
        // production: 'redis://user:password@host:port'
        // development: {
        //      host: '127.0.0.1',
        //      port: 6379,
        //      ...
        // }
        //
        // If nothing is specified for an environment,
        // the default URL will be null (localhost)
        production: process.env.REDISCLOUD_URL
    }
};

// If you plan to use AWS, you can set these settings
var AWSConfig = {
    // Your AWS Access Key Id
    accessKeyId: null,
    // Your AWS Secret Access Key
    secretAccessKey: null,
    // The default AWS region to use
    region: null,
    // Resources used by AWS S3
    s3: {
        // Name of the default S3 bucket
        bucket: 'my-app'
    }
};

module.exports = {
    app: appConfig,
    mongo: mongoConfig,
    redis: redisConfig,
    AWS: AWSConfig.accessKeyId ? AWSConfig : null
};
