var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var $ = require('jquery');

var ModelForm = React.createClass({
    getInitialState: function () {
        return ({
            properties: []
        });
    },

    loadModelProperties: function () {
        this.propertiesRequest = $.get('http://localhost:8000/api/admin/models/' + this.props.params.model, function (data) {
            this.setState({ properties: data.properties });
        }.bind(this));
    },

    componentDidMount: function () {
        this.loadModelProperties();
    },

    render: function () {
        var fields = this.state.properties.map(function (property) {
            if (property.type == 'String') return <FieldTypeString property={property} />
            else if (property.type == 'Boolean') return <FieldTypeBoolean property={property} />
            else if (property.type == 'Date') return <FieldTypeDate property={property} />
        });

        return (
            <form>
                <h1>Test</h1>
                {fields}
                <button type="submit" className="btn btn-default">Submit</button>
            </form>
        )
    }
});

var FieldTypeString = React.createClass({
    render: function () {
        return (
            <div className="form-group">
                <label htmlFor={this.props.property.name}>{this.props.property.name}</label>
                <input type="text" className="form-control" id={this.props.property.name} placeholder={this.props.property.name} />
            </div>
        )
    }
});

var FieldTypeBoolean = React.createClass({
    render: function () {
        return (
            <div className="checkbox">
                <label>
                  <input type="checkbox" /> {this.props.property.name}
                </label>
            </div>
        )
    }
});

var FieldTypeDate = React.createClass({
    render: function () {
        return (
            <div className="form-group">
                <label htmlFor={this.props.property.name}>{this.props.property.name}</label>
                <input type="date" className="form-control" id={this.props.property.name} />
            </div>
        )
    }
});

module.exports = ModelForm;
