var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var $ = require('jquery');

var ModelList = React.createClass({
    getInitialState: function () {
        return {
            url: 'http://localhost:8000/api/admin/models',
            data: []
        };
    },

    loadModels: function () {
        this.serverRequest = $.get(this.state.url, function (data) {
            this.setState({ data: data.models });
        }.bind(this));
    },

    componentDidMount: function () {
        this.loadModels();
    },

    render: function () {
        var modelNodes = this.state.data.map(function(model) {
            return (
                <Model name={model.name} />
            );
        });

        return (
            <div className="list-group">
                {modelNodes}
            </div>
        )
    }
});

var Model = React.createClass({
    render: function () {
        return (
            <Link className="list-group-item" to={'/admin/model/' + this.props.name.toLowerCase()}>{this.props.name}</Link>
        );
    }
});

module.exports = ModelList;
