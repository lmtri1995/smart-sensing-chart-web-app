import React, {Component}    from 'react';
//import "../../../scss/component/tabulator_midnight_custom.css"; // use Theme(s)
import "../../../scss/component/tabulator_bootstrap4.min.css"; // use Theme(s
import MAPPING_STITCH_CONSTANTS from "../constants";

var Tabulator = require('tabulator-tables');
let {field}   = MAPPING_STITCH_CONSTANTS;

const columns = [
	{title: "Factory", field: field.factoryName, width: '15%', align: "center", headerFilter: "input"},
	{title: "Line No.", field: field.lineName, width: '15%', align: "center", headerFilter: "input"},
	{title: "Line Code", field: field.lineCode, width: '10%', align: "center", headerFilter: "input"},
	{title: "Process", field: field.processName, width: '20%', align: "center", headerFilter: "input"},
	{title: "Position", field: field.posittionName, width: '10%', align: "center", headerFilter: "input"},
	{title: "Sensor Mac Address", field: field.macAddress, width: '15%', align: "center", headerFilter: "input"},
	{title: "Description", field: field.description, width: '15%', align: "center", headerFilter: "input"}
];
const data    = [
	{
		[field.factoryName]        : "factory01",
		[field.lineName]      : "ASC 02-01",
		[field.lineCode]        : "2030",
		[field.processName]           : "Normal Stitching",
		[field.posittionName]       : "Start",
		[field.macAddress]       : "AA-00-04-DD-XX-YY",
		[field.description]: "Test"
	},
];

class DataTable extends Component {

	constructor(props) {
		super(props);
		this.ref   = null;
		this.state = {
			data: [],
		};
	}

	componentDidMount() {
		let {tableData, onRowClick} = this.props;
		tableData                   = tableData ? tableData : [];
		let _this                   = this;
		this.table                  = new Tabulator("#dataTable", {
			height             : "40em",
			movableRows        : false,
			selectable         : 1, //make rows selectable
			columns            : columns,
			data               : tableData,
			rowSelectionChanged: (data, rows) => {
				if (rows.length > 0) {
					_this.props.fillForm(data[data.length - 1]);
				}
			},
			rowDeselected: (data) => {
				this.props.onReset();
			}
		});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		let {tableData, onRowClick} = this.props;
		tableData                   = tableData ? tableData : [];

		if (prevProps.tableData !== this.props.tableData) {
			this.table.replaceData(tableData);
		}
	}

	render() {
		const options = {
			height     : "40em",
			movableRows: false
		};
		return (
			<div id="dataTable"></div>
		);
	}
}

export default DataTable;
