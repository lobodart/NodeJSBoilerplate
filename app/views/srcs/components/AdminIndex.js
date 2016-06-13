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
                <Model name={model.name} key={model.id} />
            );
        });

        return (
            <div>
            <h1>Models</h1>
            <div className="collection">{modelNodes}</div>
            </div>
        )
    }
});

var Model = React.createClass({
    render: function () {
        return (
            <Link className="collection-item" to={'/model/' + this.props.name.toLowerCase()}>{this.props.name}</Link>
        );
    }
});

module.exports = ModelList;
