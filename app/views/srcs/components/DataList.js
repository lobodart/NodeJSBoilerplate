var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var $ = require('jquery');
var _ = require('lodash');

var DataBox = React.createClass({
    render: function () {
        return (
            <div className="databox">

            <DataTableHeader model={this.props.params.model} />

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
                <th style={{border: '1px solid red'}}>{property.name}</th>
            );
        });

        var properties = this.state.properties;
        var dataNodes = this.state.data.map(function (data) {
            return (
                <DataTableContentLine properties={properties} data={data} />
            );
        });

        return (
            <table>
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
    render: function () {
        var props = this.props;
        var values = this.props.properties.map(function (property) {
            var val = props.data[property.name];
            return (
                <td>{val != null ? val.toString() : '(null)'}</td>
            )
        });

        return (
            <tr>
            {values}
            </tr>
        );
    }
});

module.exports = DataBox;
