import React                 from 'react';
import {reactFormatter}      from "react-tabulator";
import ButtonSubmitFormatter from "./components/ButtonSubmitFormatter";

export const LEARNING_CURVE_CONSTANTS = {
	alarmMasterFormName: 'AlarmMasterForm',
	field              : {
		filterLine          : 'filterLine',
		filterModel         : 'filterModel',
		dateRadio           : 'dateRadio',
		filterFromDate      : 'filterFromDate',
		filterToDate        : 'filterToDate',
		processName         : 'process_nm',
		processCode         : 'process_cd',
		workingDays         : 'working_days',
		modelNo             : 'model_no',
		modelName           : 'model_nm',
		stitching           : 'stitching',
		shoemaking          : 'shoemaking',
		total               : 'total',
		basicTargetQty      : 'basic_target_qty',
		lineCode            : 'line_cd',
		actualQty           : 'actual_qty',
		isOKClicked         : 'isOKClicked',
		submitButton        : 'submitButton',
		modelSubmissionState: 'modelSubmissionState',
		workYMD             : 'work_ymd',
	},
	submissionState    : {
		initial: -1,
		onGoing: 0,
		done   : 1,
	},
	submissionError    : {
		emptyForm: 'Please select a process and fill in the form before submission.',
	},
};

/*export const formatTableRow = (cell, formatterParams) => {
 console.log("formatTableRow");
 console.log("cell: ", cell);
 let data = cell._cell.row.data;
 console.log("data.process: ", data);
 console.log("equal: ", data.process == "Packing");
 if (data.process.toUpperCase() == "Packing".toUpperCase()) {
 cell.getRow().getElement().style.backgroundColor = '#02406C';
 }
 //cell.getRow().getElement().style.backgroundColor = '#02406C';
 }*/

/*export const processTableColumns = [
 {
 title       : "PROCESS",
 field       : LEARNING_CURVE_CONSTANTS.field.processName,
 width       : '50%',
 align       : "center",
 headerFilter: "input",
 titleFormatter: titleFormater,
 },
 {title: "Process Code", field: LEARNING_CURVE_CONSTANTS.field.processCode, visible: false},
 {
 title       : "DAYS",
 field       : LEARNING_CURVE_CONSTANTS.field.day,
 width       : '50%',
 align       : "center",
 headerSort:false,
 titleFormatter: titleFormater,
 },
 {title: "Model No", field: LEARNING_CURVE_CONSTANTS.field.modelNo, visible: false},
 {title: "Line Code", field: LEARNING_CURVE_CONSTANTS.field.lineCode, visible: false},
 {title: "Basic Target Qty", field: LEARNING_CURVE_CONSTANTS.field.basicTargetQty, visible: false},
 {title: "Actual Qty", field: LEARNING_CURVE_CONSTANTS.field.actualQty, visible: false, formatter: formatTableRow},
 ];*/

export const defaultProcessTableData = [
	{
		[LEARNING_CURVE_CONSTANTS.field.processName]   : "",
		[LEARNING_CURVE_CONSTANTS.field.processCode]   : "",
		[LEARNING_CURVE_CONSTANTS.field.workingDays]   : "",
		[LEARNING_CURVE_CONSTANTS.field.modelNo]       : "",
		[LEARNING_CURVE_CONSTANTS.field.lineCode]      : "",
		[LEARNING_CURVE_CONSTANTS.field.basicTargetQty]: "",
		[LEARNING_CURVE_CONSTANTS.field.actualQty]     : "",
	},
];

export const titleFormater = function (cell, formatterParams, onRendered) {
	//set font size
	//cell.getElement().style.textSize = "14px";
	//cell.getElement().style.color = '#FF00000';
	/*if (cell.getValue() === "TOTAL"){
	 cell.getElement().style.backgroundColor = "#F84E4E";
	 }*/
	return cell.getValue();
};

export const onOkClicked = (rowData) => {
	console.log("onOkClicked");
	console.log("rowData: ", rowData);
	/*this.props.changeIsOKClicked(true);
	 this.props.handleSubmit();*/
};

/*export const buttonSubmitFormatter = function(value, data, cell, row, options, formatterParams){
 let rowData = value._cell.row.data;
 console.log("rowData: ", rowData);
 return <Modal
 style={{marginLeft: 10, marginTop: -20}}
 type="submit"
 color="primary"
 title="Congratulations!"
 btn="Submit"
 message="Expect warmly its tended garden him esteem had remove off. Effects dearest staying
 now sixteen nor improve."
 onOkClicked={onOkClicked(rowData)}
 />
 //return table;
 }*/

export const modelTableColumns = [
	{
		title         : "MODEL",
		field         : LEARNING_CURVE_CONSTANTS.field.modelName,
		width         : '25%',
		align         : "center",
		headerFilter  : "input",
		titleFormatter: titleFormater
	},
	{title: "Model No", field: LEARNING_CURVE_CONSTANTS.field.modelNo, visible: false},
	{
		title         : "STITCHING",
		field         : LEARNING_CURVE_CONSTANTS.field.stitching,
		width         : '15%',
		align         : "center",
		titleFormatter: titleFormater,
		headerSort    : false
	},
	{
		title         : "SHOEMAKING",
		field         : LEARNING_CURVE_CONSTANTS.field.shoemaking,
		width         : '15%',
		align         : "center",
		titleFormatter: titleFormater,
		headerSort    : false
	},
	{
		title         : "TOTAL",
		field         : LEARNING_CURVE_CONSTANTS.field.total,
		width         : '15%',
		align         : "center",
		titleFormatter: titleFormater,
		headerSort    : false,
		/*formatter: function(cell, formatterParams){
		 cell.getElement().style.backgroundColor = "#F84E4E";
		 }*/
	},
	{
		title         : "TARGET QTY",
		field         : LEARNING_CURVE_CONSTANTS.field.basicTargetQty,
		width         : '18%',
		align         : "center",
		titleFormatter: titleFormater,
		editor        : "input",
		headerSort    : false
	},
	{
		title     : "",
		field     : LEARNING_CURVE_CONSTANTS.field.submitButton,
		width     : '10%',
		align     : "center",
		formatter : reactFormatter(<ButtonSubmitFormatter/>),
		/*formatter   : reactFormatter(<Modal
		 style={{marginLeft: -25, marginTop: -8}}
		 type="submit"
		 color="primary"
		 title="Congratulations!"
		 btn="Submit"
		 message="Expect warmly its tended garden him esteem had remove off. Effects dearest staying
		 now sixteen nor improve."
		 onOkClicked={onOkClicked(rowData)}
		 />),*/
		headerSort: false
	},
];

export const defaultModelTableData = [
	{
		[LEARNING_CURVE_CONSTANTS.field.processName]: "",
		[LEARNING_CURVE_CONSTANTS.field.processCode]: "",
		[LEARNING_CURVE_CONSTANTS.field.workingDays]: "",
	},
];

export const chartOptions = {
	legend  : {display: false},
	tooltips: {
		callbacks: {
			label: function (tooltipItem, data) {
				let label = '';
				label += data.datasets[tooltipItem.datasetIndex].label + ': ';
				label += data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
				label += ' (pair)';
				return label;
			},
		},
	},
};
