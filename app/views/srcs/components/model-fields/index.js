var fileExists = require('file-exists');

module.exports = function (fieldType) {
    var modulePath = './' + fieldType;

    try {
        return require(modulePath);
    } catch (err) {}
console.log(modulePath, 'not found');
    return require('./Unknown.js');
};
