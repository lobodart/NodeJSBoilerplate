var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;

var components = require('./components');

ReactDOM.render(
    // <ModelList source="http://localhost:8000/api/admin/models" pollInterval={2000} />,
    <Router>
    <Route path="/" component={components.AdminIndex} />
    <Route path="/model/:model" component={components.DataList} />
    </Router>,
    document.getElementById('content')
);
