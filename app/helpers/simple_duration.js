var _ = require('lodash');

var functions = {
    w: function (number) { return number * (7 * 24 * 3600); },
    d: function (number) { return number * (24 * 3600); },
    h: function (number) { return number * 3600; },
    m: function (number) { return number * 60; },
    s: function (number) { return number; }
};

module.exports = function (simpleDateString) {
    var regex = /([0-9]+(?:w|d|h|m|s){1})/g;
    var totalTime = 0;
    while (match = regex.exec(simpleDateString)) {
        var parts = /([0-9]+)([a-z]{1})/.exec(match[0]);
        totalTime += functions[parts[2]](parseInt(parts[1]));
    }

    return totalTime;
};
