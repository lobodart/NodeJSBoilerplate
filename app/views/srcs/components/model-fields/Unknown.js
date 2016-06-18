var React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <div className="form-group">
                <label className="col-sm-2 control-label">{this.props.property.name}</label>
                <div className="col-sm-10">
                    <p className="form-control-static text-danger">
                        <span className='glyphicon glyphicon-exclamation-sign'></span> No class found to render a property of type <strong>{this.props.property.type}</strong>.
                    </p>
                </div>
            </div>
        )
    }
});
