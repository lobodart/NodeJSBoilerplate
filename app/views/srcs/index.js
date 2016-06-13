var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;

var components = require('./components');

ReactDOM.render(
    <Router>
    <Route path="/" component={components.AdminIndex} />
    <Route path="/model/:model" component={components.DataList} />
    <Route path="/model/:model/new" component={components.CreateUpdateModel} />
    </Router>,
    document.getElementById('content')
);
