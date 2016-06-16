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

    handleSubmit: function(e) {
        e.preventDefault();
    },

    render: function () {
        var fields = this.state.properties.map(function (property) {
            if (property.type == 'String') return <FieldTypeString property={property} />
            else if (property.type == 'Number') return <FieldTypeNumber property={property} />
            else if (property.type == 'Boolean') return <FieldTypeBoolean property={property} />
            else if (property.type == 'Date') return <FieldTypeDate property={property} />
            else if (property.type == 'ObjectID') {
                return !property.options.ref ? <FieldTypeString property={property} /> : <FieldTypeObjectId property={property} />
            }
        });

        return (
            <form className='form-horizontal' onSubmit={this.handleSubmit}>
                {fields}
                <button type="submit" className="btn btn-primary pull-right">Save {this.props.params.model}</button>
            </form>
        )
    }
});

var FieldTypeString = React.createClass({
    render: function () {
        return (
            <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor={this.props.property.name}>{this.props.property.name}</label>
                <div className="col-sm-10">
                    <input type="text" className="form-control" id={this.props.property.name} placeholder={this.props.property.name} />
                </div>
            </div>
        )
    }
});

var FieldTypeNumber = React.createClass({
    render: function () {
        var options = this.props.property.options;

        var rangeTags = {};
        options.min !== undefined ? rangeTags.min = options.min : null;
        options.max !== undefined ? rangeTags.max = options.max : null;

        return (
            <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor={this.props.property.name}>{this.props.property.name}</label>
                <div className="col-sm-10">
                    <input type="number" {...rangeTags} className="form-control" id={this.props.property.name} placeholder={this.props.property.name} />
                </div>
            </div>
        )
    }
});

var FieldTypeBoolean = React.createClass({
    render: function () {
        return (
            <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" name={this.props.property.name} /> {this.props.property.name}
                        </label>
                    </div>
                </div>
            </div>
        )
    }
});

var FieldTypeDate = React.createClass({
    render: function () {
        return (
            <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor={this.props.property.name}>{this.props.property.name}</label>
                <div className="col-sm-10">
                    <input type="date" className="form-control" id={this.props.property.name} placeholder={this.props.property.name} />
                </div>
            </div>
        )
    }
});

var FieldTypeObjectId = React.createClass({
    getInitialState: function () {
        return ({
            data: []
        });
    },

    loadOptions: function () {
        this.propertiesRequest = $.get('http://localhost:8000/api/admin/models/' + this.props.property.options.ref + '/data', function (data) {
            this.setState({ data: data.data });
        }.bind(this));
    },

    componentDidMount: function () {
        this.loadOptions();
    },

    render: function () {
        var property = this.props.property;
        var options = this.state.data.map(function (data) {
            var format = data._id;
            if (property.options.adminFormat) {
                format = property.options.adminFormat.replace(/\$([a-z0-9\-_]+)/gi, function (match, v) { return !data[v] ? '' : String(data[v]); });
            }

            return (
                <option value={data._id}>{format}</option>
            );
        });

        return (
            <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor={this.props.property.name}>{this.props.property.name}</label>
                <div className="col-sm-10">
                    <select className="form-control form-control-lg" id={this.props.property.name}>
                        {options}
                    </select>
                </div>
            </div>
        )
    }
});

module.exports = ModelForm;
