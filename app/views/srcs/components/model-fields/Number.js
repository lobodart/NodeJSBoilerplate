var React = require('react');

var Field = require('.');
var InputField = Field('Input');

module.exports = React.createClass({
    render: function () {
        var options = this.props.property.options;

        var rangeTags = {};
        options.min !== undefined ? rangeTags.min = options.min : null;
        options.max !== undefined ? rangeTags.max = options.max : null;

        return (
            <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor={this.props.property.name}>{this.props.property.name}</label>
                <div className="col-sm-10">
                    <InputField {...rangeTags} type="text" name={this.props.property.name} />
                </div>
            </div>
        )
    }
});
