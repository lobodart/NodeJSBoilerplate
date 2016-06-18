var mongoose = require('mongoose');
var User = require('app/models').User;

var config = require('app/config');

var TestSchema = new mongoose.Schema({
    club: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        adminFormat: '$username'
    },
    clients: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', adminFormat: '$username' }]
    },
    choices: {
        type: [String]
    },
    rate: {
        type: Number,
        min: 0,
        max: 10
    },
    data: {
        type: mongoose.Schema.Types.Mixed
    },
    clubType: {
        type: String,
        enum: ['Inside', 'Outside', 'Garden']
    }
}, {
    "versionKey": false,
    "timestamps": true
});

module.exports = mongoose.model('Test', TestSchema);
