var React = require('react');
var $ = require('jquery');

var StringField = require('.')('String');
var SelectField = require('.')('Select');

module.exports = React.createClass({
    getInitialState: function () {
        return ({
            data: null
        });
    },

    loadOptions: function () {
        this.propertiesRequest = $.get('http://localhost:8000/api/admin/models/' + this.props.property.options.ref + '/data', function (data) {
            this.setState({ data: data.data });
        }.bind(this));
    },

    componentDidMount: function () {
        if (this.props.property.options.ref) this.loadOptions();
    },

    render: function () {
        if (!this.state.data) return <StringField property={this.props.property} />;

        var property = this.props.property;
        var data = this.state.data.map(function (data) {
            var format = data._id;
            if (property.options.adminFormat) {
                format = property.options.adminFormat.replace(/\$([a-z0-9\-_]+)/gi, function (match, v) { return !data[v] ? '' : String(data[v]); });
            }

            return ({
                value: data._id,
                text: format
            });
        });

        return (
            <SelectField id={property.name} data={data} multiple={(this.props.property.multiple ? true : false)} />
        )
    }
});
