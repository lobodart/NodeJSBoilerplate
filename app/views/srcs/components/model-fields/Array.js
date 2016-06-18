var React = require('react');
var $ = require('jquery');

var Field = require('.');
var FieldObjectID = Field('ObjectID');

module.exports = React.createClass({
    getInitialState: function () {
        return ({
            contentType: null,
            inputs: []
        })
    },

    createNewField: function () {
        var contentType = this.props.property.contentType;
        var fieldType = Field(contentType);
        var field = <fieldType property={this.props.property} />;

        var inputs = this.state.inputs;
        inputs.push(field);
        this.setState({ inputs: inputs });
    },

    componentDidMount: function () {
        this.setState({ contentType: this.props.property.contentType });

        if (this.state.contentType != 'ObjectID') this.createNewField();
    },

    handlePlusClick: function () {
        this.createNewField();
    },

    render: function () {
        if (this.state.contentType == 'ObjectID') {
            var property = this.props.property;
            property = Object.assign(property, {
                options: property.options.type[0],
                multiple: true
            });

            return <FieldObjectID property={property} />;
        }

        return (
            <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor={this.props.property.name}>{this.props.property.name}</label>
                <div className="col-sm-9">
                    {this.state.inputs}
                </div>
                <div className="col-sm-1">
                    <span className='glyphicon glyphicon-plus' onClick={this.handlePlusClick}></span>
                </div>
            </div>
        )
    }
});
