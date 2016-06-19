var React = require('react');
var ReactRedux = require('react-redux');
var $ = require('jquery');
var action = require('../ModelFormActions');

var StringField = require('.')('String');

var Select = React.createClass({
    getInitialState: function () {
        return ({
            currentValue: (this.props.multiple ? [] : '')
        });
    },

    handleChange: function (event) {
        var value = $(event.target).val();
        
        this.setState({ currentValue: value });
        this.props.dispatch(action.updateFormField(event.target.name, value));
    },

    render: function () {
        var props = this.props;
        var options = props.data.map(function (data) {
            return (
                <option value={data.value}>{data.text}</option>
            );
        });

        var multiple = { multiple: (props.multiple ? true : false) };
        var label = 'Select ' + (multiple.multiple ? 'one or more' : 'one');

        return (
            <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor={props.id}>{props.id}</label>
                <div className="col-sm-10">
                    <select {...multiple} value={this.state.currentValue} className="form-control form-control-lg" ref={props.id} id={props.id} name={props.id} onChange={this.handleChange}>
                        <option value='' disabled>{label}</option>
                        {options}
                    </select>
                </div>
            </div>
        )
    }
});

module.exports = ReactRedux.connect()(Select);
