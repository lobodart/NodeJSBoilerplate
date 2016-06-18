var React = require('react');

var Field = require('.');
var SelectField = Field('Select');
var InputField = Field('Input');

module.exports = React.createClass({
    render: function () {
        var data = this.props.property.options.enum;
        if (data) {
            var newData = data.map(function (value) {
                return ({
                    value: value,
                    text: value
                });
            });

            return <SelectField id={this.props.property.name} data={newData} />;
        }

        return (
            <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor={this.props.property.name}>{this.props.property.name}</label>
                <div className="col-sm-10">
                    <InputField type="text" name={this.props.property.name} />
                </div>
            </div>
        )
    }
});
