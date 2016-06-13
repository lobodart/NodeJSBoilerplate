var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var PATHS = {
    app: path.resolve(__dirname, 'app/views/srcs'),
    build: path.resolve(__dirname, 'app/views/public')
};

var config = {
    entry: PATHS.app,
    output: {
        path: PATHS.build,
        filename: 'bundle.js'
    },
    module : {
        loaders : [
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css', { allChunks: true })
    ]
};

module.exports = config;
