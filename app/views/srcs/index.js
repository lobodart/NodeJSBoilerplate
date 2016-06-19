var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;
var browserHistory = require('react-router').browserHistory;
var redux = require('redux');
var Provider = require('react-redux').Provider;

var components = require('./components');

//////
var UPDATE_FORM_FIELD = 'UPDATE_FORM_FIELD';

function todos(state, action) {
    if (typeof state === 'undefined') {
        return [];
    }

    switch (action.type) {
        case UPDATE_FORM_FIELD:
        var object = {};
        object[action.name] = action.value;
        return (object);
        default:
        return (state);
    }
}

var store = redux.createStore(todos);
/////

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path='admin'>
                <IndexRoute component={components.AdminIndex} />
                <Route path='model/:model' component={components.DataList} />
                <Route path='model/:model/add' component={components.CreateUpdateModel} />
                <Route path='model/:model/:id' component={components.CreateUpdateModel} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('content')
);
