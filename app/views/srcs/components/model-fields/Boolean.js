var React = require('react');
var ReactRedux = require('react-redux');
var action = require('../ModelFormActions');

var CheckBox = React.createClass({
    handleClick: function (event) {
        this.props.dispatch(action.updateFormField(event.target.name, event.target.checked));
    },

    render: function () {
        return (
            <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" name={this.props.property.name} onClick={this.handleClick} /> {this.props.property.name}
                        </label>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ReactRedux.connect()(CheckBox);
