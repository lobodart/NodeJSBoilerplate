var React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor={this.props.property.name}>{this.props.property.name}</label>
                <div className="col-sm-10">
                    <textarea className="form-control" rows="3"></textarea>
                </div>
            </div>
        )
    }
});
