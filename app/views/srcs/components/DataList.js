var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var $ = require('jquery');
var _ = require('lodash');

var DataBox = React.createClass({
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
        return (
            <div>
                <div className='row'>
                    <div className='col-md-10'>
                        <h1>{this.props.params.model}</h1>
                    </div>
                    <div className='col-md-2'>
                        <Link to={'/admin/model/' + this.props.params.model + '/add'}>Ajouter</Link>
                    </div>
                </div>

                <div>
                    <DataTableHeader model={this.props.params.model} />
                </div>
            </div>
        );
    }
});

var DataTableHeader = React.createClass({
    getInitialState: function () {
        return ({
            data: [],
            properties: []
        });
    },

    loadModelProperties: function () {
        this.propertiesRequest = $.get('http://localhost:8000/api/admin/models/' + this.props.model, function (data) {
            this.setState({ properties: data.properties });
            this.loadModelData();
        }.bind(this));
    },

    loadModelData: function () {
        this.dataRequest = $.get('http://localhost:8000/api/admin/models/' + this.props.model + '/data', function (data) {
            this.setState({ data: data.data });
        }.bind(this));
    },

    componentDidMount: function () {
        this.loadModelProperties();
    },

    render: function () {
        var propertyNodes = this.state.properties.map(function(property) {
            return (
                <th data-field={property.name}>{property.name}</th>
            );
        });

        var properties = this.state.properties;
        var dataNodes = this.state.data.map(function (data) {
            return (
                <DataTableContentLine properties={properties} data={data} />
            );
        });

        return (
            <table className='table table-bordered'>
            <thead>
            <tr>
            {propertyNodes}
            </tr>
            </thead>
            <tbody>
            {dataNodes}
            </tbody>
            </table>
        )
    }
});

var DataTableContentLine = React.createClass({
    handleClick: function() {
        console.log('clicked!');
    },

    render: function () {
        var props = this.props;
        var values = this.props.properties.map(function (property) {
            var val = props.data[property.name];
            return (
                <td>{val != null ? val.toString() : '(null)'}</td>
            )
        });

        return (
            <tr onClick={this.handleClick}>
            {values}
            </tr>
        );
    }
});

module.exports = DataBox;
