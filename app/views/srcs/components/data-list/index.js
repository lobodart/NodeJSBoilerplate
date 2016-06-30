var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var $ = require('jquery');
var _ = require('lodash');

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

var DataBox = React.createClass({
    getInitialState: function () {
        return ({
            properties: [],
            data: [],
            hiddenFields: []
        });
    },

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    loadModelProperties: function () {
        this.propertiesRequest = $.get('http://localhost:8000/api/admin/models/' + this.props.params.model, function (data) {
            this.setState({ properties: data.properties });
            this.loadModelData();
        }.bind(this));
    },

    loadModelData: function () {
        this.dataRequest = $.get('http://localhost:8000/api/admin/models/' + this.props.params.model + '/data', function (data) {
            this.setState({ data: data.data });
        }.bind(this));
    },

    handleRowClick: function (id) {
        this.context.router.push('/admin/model/' + this.props.params.model + '/' + id);
    },

    handleSelectChange: function (event) {
        var hiddenFields = this.state.hiddenFields;
        if (event.target.checked) {
            var index = hiddenFields.indexOf(event.target.name);
            if (index != -1) hiddenFields.splice(index, 1);
        } else {
            hiddenFields.push(event.target.name);
        }

        this.setState({ hiddenFields: hiddenFields });
    },

    componentDidMount: function () {
        this.loadModelProperties();
    },

    render: function () {
        var headers = [];
        var options = [];
        var state = this.state;
        var handleSelectChange = this.handleSelectChange;

        _.forEach(state.properties, function (property, index) {
            var fieldIsHidden = (state.hiddenFields.indexOf(property.name) != -1);

            if (!fieldIsHidden) {
                var format = function (cell, row) {
                    if (_.isBoolean(cell)) {
                        return (
                            <span className={"label label-" + (cell ? 'success' : 'danger')}>{String(cell)}</span>
                        );
                    }

                    if (_.isUndefined(cell) || _.isNull(cell)) {
                        return (
                            <small className="text-muted">({String(cell)})</small>
                        );
                    }

                    if (_.isArray(cell)) {
                        return (
                            <span>{JSON.stringify(cell)}</span>
                        );
                    }

                    return String(cell);
                };

                headers.push(
                    <TableHeaderColumn dataFormat={format} dataAlign='center' dataField={property.name} dataSort={true}>{property.name}</TableHeaderColumn>
                );
            }

            options.push(
                <div className="checkbox">
                    <label>
                        <input type="checkbox" name={property.name} checked={fieldIsHidden ? false : true} onChange={handleSelectChange} /> {property.name}
                    </label>
                </div>
            );
        });

        var selectRowProp = {
            mode: "checkbox",
            clickToSelect: true,
            bgColor: "rgb(238, 193, 213)",
            showOnlySelected: true
        };

        var tableAttributes = {
            data: this.state.data,
            keyField: '_id',
            selectRow: selectRowProp,
            search: true,
            pagination: true,
            exportCSV: true,
            deleteRow: true,
            striped: true,
            hover: true
        };

        return (
            <div>
                <div className="page-header">
                    <h1>List of Users
                        <div className="btn-group btn-group-sm pull-right" role="group" aria-label="...">
                            <Link to={"/admin/model/" + this.props.params.model + "/add"} className="btn btn-success">
                                <span className='glyphicon glyphicon-plus-sign'></span> Add new
                            </Link>
                            <button className="btn btn-default" onClick={this.loadModelData}>
                                <span className='glyphicon glyphicon-refresh'></span>
                            </button>
                        </div>
                    </h1>

                </div>
                <BootstrapTable {...tableAttributes}>
                      {headers}
                </BootstrapTable>
                <div className='row'>
                    <div className='col-lg-6'>
                        <form className='form-inline'>
                            {options}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = DataBox;
