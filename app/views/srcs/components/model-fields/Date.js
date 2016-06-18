var React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor={this.props.property.name}>{this.props.property.name}</label>
                <div className="col-sm-10">
                    <input type="date" className="form-control" id={this.props.property.name} placeholder={this.props.property.name} />
                </div>
            </div>
        )
    }
});
