var mongoose = require('mongoose');

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
    choices: {
        type: [String]
    },
    rate: {
        type: Number,
        min: 0,
        max: 10
    }
}, {
    "versionKey": false,
    "timestamps": true
});

module.exports = mongoose.model('Test', TestSchema);
