import React, {Component}    from 'react';
//import "../../../scss/component/tabulator_midnight_custom.css"; // use Theme(s)
import "../../../scss/component/tabulator_bootstrap4.min.css"; // use Theme(s)
// for React 16.4.x use: import { ReactTabulator }
import MASTER_FORM_CONSTANTS from "../constants";

var Tabulator = require('tabulator-tables');
let {field}   = MASTER_FORM_CONSTANTS;

const columns = [
	{title: "Mas Code", field: field.masCd.name, width: '10%', align: "center", headerFilter: "input"},
	{title: "General Name", field: field.masCdNm.name, width: '10%', align: "center", headerFilter: "input"},
	{title: "Category Code", field: field.catCd.name, headerFilter: "input", visible: false},
	{title: "Category", field: field.catCdNm, width: '10%', align: "center", headerFilter: "input"},
	{title: "Parent Code", field: field.parentMasCd, headerFilter: "input", visible: false},
	{title: "Parent", field: field.parentMasNm, width: '10%', align: "center", headerFilter: "input"},
	{title: "Process Sequence", field: field.processingSeq.name, width: '10%', align: "center", headerFilter: "input"},
	{title: "Definition", field: field.definitionValue, align: "center", width: '10%', headerFilter: "input"},
	{title: "Virtual(Y/N)", field: field.virtualYn, width: '10%', align: "center", formatter: "tickCross"},
	{title: "Active(Y/N)", field: field.activeYn, width: '10%', align: "center", formatter: "tickCross"},
	{title: "Sys Code(Y/N)", field: field.sysCodeYn, width: '10%', align: "center", formatter: "tickCross"},
	{title: "Description", field: field.description.name, width: '9%', align: "center", headerFilter: "input"},
];
const data    = [
	{
		[field.masCd.name]        : "1",
		[field.masCdNm.name]      : "mas_cd_nm",
		[field.catCd.name]        : "12",
		[field.catCdNm]           : "red",
		[field.parentMasCd]       : "1234",
		[field.parentMasNm]       : "5",
		[field.processingSeq.name]: "243",
		[field.definitionValue]   : "111",
		[field.virtualYn]         : "true",
		[field.activeYn]          : "false",
		[field.sysCodeYn]         : true,
		[field.description.name]  : "Hello",
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
				console.log("data 66: : ", data);
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
		/*return <ReactTabulator
		 selectable="true"
		 ref={ref => this.ref = ref}
		 columns={columns}
		 data={tableData}
		 rowClick={this.changeRowSelectionColor}
		 options={options}
		 />*/
		return (
			<div id="dataTable"></div>
		);
	}
}

export default DataTable;
