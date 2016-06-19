var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var ReactRedux = require('react-redux');
var $ = require('jquery');

var FormField = require('./model-fields');
var FormState = {};

var ModelForm = React.createClass({
    getInitialState: function () {
        return ({
            properties: [],
            formData: {}
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

        var AlertComponent = null;
        var jqXHR = $.post('http://localhost:8000/api/admin/models/' + this.props.params.model, FormState);
        jqXHR.done(function () {
            AlertComponent = <FormAlert type='success' />;
        });

        jqXHR.fail(function () {
            AlertComponent = <FormAlert type='danger' />;
        });

        jqXHR.always(function () {
            ReactDOM.render(
                AlertComponent,
                document.getElementById('admin-form-alert')
            );
        });
    },

    render: function () {
        var fields = this.state.properties.map(function (property) {
            var FieldType = FormField(property.type);

            return <FieldType property={property} value={FormState[property.name]} />
        });

        return (
            <div id='admin-form'>
                <h1>New User</h1>
                <div id='admin-form-alert'></div>
                <form className='form-horizontal' onSubmit={this.handleSubmit}>
                    {fields}
                    <button type="submit" className="btn btn-primary pull-right">Save {this.props.params.model}</button>
                </form>
            </div>
        )
    }
});

var FormAlert = React.createClass({
    render: function () {
        var type = this.props.type;

        return (
            <div className={"alert alert-" + this.props.type + " alert-dismissible"} role="alert">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <strong>Warning!</strong> Better check yourself, you are not looking too good.
            </div>
        );
    }
});

module.exports = ReactRedux.connect(function (state, action) {
    FormState = Object.assign(FormState, state);
    return action;
})(ModelForm);
