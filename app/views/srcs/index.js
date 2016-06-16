var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;
var browserHistory = require('react-router').browserHistory;

var components = require('./components');

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path='admin'>
            <IndexRoute component={components.AdminIndex} />
            <Route path='model/:model' component={components.DataList} />
            <Route path='model/:model/add' component={components.CreateUpdateModel} />
        </Route>
    </Router>,
    document.getElementById('content')
);
