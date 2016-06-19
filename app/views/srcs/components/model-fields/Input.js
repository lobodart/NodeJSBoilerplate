var React = require('react');
var ReactRedux = require('react-redux');
var action = require('../ModelFormActions');

var Input = React.createClass({
    handleChange: function (event) {
        this.props.dispatch(action.updateFormField(event.target.name, event.target.value));
    },

    render: function () {
        return (
            <input type={this.props.type} onChange={this.handleChange} className="form-control" id={this.props.name} name={this.props.name} value={this.props.value} />
        )
    }
});

module.exports = ReactRedux.connect()(Input);
