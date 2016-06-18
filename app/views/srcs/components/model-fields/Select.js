var React = require('react');
var $ = require('jquery');

var StringField = require('.')('String');

module.exports = React.createClass({
    render: function () {
        var props = this.props;
        var options = props.data.map(function (data) {
            return (
                <option value={data.value}>{data.text}</option>
            );
        });

        var multiple = { multiple: (props.multiple ? true : false) };
        var label = 'Select ' + (multiple.multiple ? 'one or more' : 'one');

        return (
            <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor={props.id}>{props.id}</label>
                <div className="col-sm-10">
                    <select {...multiple} className="form-control form-control-lg" id={props.id}>
                        <option defaultValue disabled>{label}</option>
                        {options}
                    </select>
                </div>
            </div>
        )
    }
});
