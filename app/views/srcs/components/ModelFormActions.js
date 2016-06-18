var React = require('react');

var UPDATE_FORM_FIELD = 'UPDATE_FORM_FIELD';

module.exports.updateFormField = function (name, value) {
    return ({
        type: UPDATE_FORM_FIELD,
        name: name,
        value: value
    });
}
