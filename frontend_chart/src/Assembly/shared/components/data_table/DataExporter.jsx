import React, {Component} from 'react';
import Excel              from '../../../../../node_modules/exceljs/dist/es5/exceljs.browser';
import * as FileSaver     from 'file-saver';
import {connect}          from "react-redux";
import {withRouter}       from 'react-router-dom';
import {FontAwesomeIcon}  from "@fortawesome/react-fontawesome";
import {faFileExcel}      from "@fortawesome/free-solid-svg-icons";
import {
	Button
} from 'reactstrap';

class DataExporter extends Component {
	exportExcelFile = (props) => {
		let defectStatusData = null, defectSummaryData = null, alarmHistoryData = null;
		let location         = props.location; //defect-status: /pages/defect-status
		let excelData        = props.excelData;//defect-status-data: .defectStatusData
		switch (location.pathname) {
			case "/pages/defect-status":
				defectStatusData = excelData.defectStatusData;
				break;
			case "/pages/defect-summary":
				defectSummaryData = excelData.defectSummaryData;
				break;
			case "/pages/alarm-history":
				alarmHistoryData = excelData.alarmHistoryData;
				break;
		}
		let fileName            = "dataExport";
		let workbook            = new Excel.Workbook();
		workbook.creator        = 'truongho@snaglobal.net';
		workbook.lastModifiedBy = 'truongho@snaglobal.net';
		workbook.created        = new Date();
		workbook.modified       = new Date();

		//Add sheet
		if (defectStatusData) {
			this.addDefectStatusToExcelTable(workbook, defectStatusData);
		}

		if (defectSummaryData) {
			this.addDefectSummaryToExcelTable(workbook, defectSummaryData);
		}

		if (alarmHistoryData) {
			this.addAlarmHistoryToExcelTable(workbook, alarmHistoryData);
		}
		//End of add sheet

		workbook.xlsx.writeBuffer()
		        .then(buffer => FileSaver.saveAs(
			        new Blob([buffer]),
			        fileName
			        ? `${fileName}_Smart_Sensing_Chart_Data.xlsx`
			        : 'Smart_Sensing_Chart_Data.xlsx' // Excel File Name
		        ))
		        .catch(err => console.log('Error writing excel export', err));
	};

	addDefectStatusToExcelTable = (workbook, defectStatusData) => {
		console.log("defectStatusData: ", defectStatusData);
		let worksheet = workbook.addWorksheet('Station_Status_Data');

		let middleCenterAlignment = {vertical: 'middle', horizontal: 'center'};
		let middleRightAlignment  = {vertical: 'middle', horizontal: 'right'};
		let middleLeftAlignment   = {vertical: 'middle', horizontal: 'left'};

		worksheet.mergeCells('A1:R1');
		worksheet.getCell('A1').font      = {
			bold: true,
		};
		worksheet.getCell('A1').alignment = middleCenterAlignment;
		worksheet.getCell('A1').value     = "DEFECT STATUS";

		for (let i = 0; i < defectStatusData.length; i++) {
			let rowData    = defectStatusData[i];
			let currentRow = worksheet.getRow(i + 2);
			for (let j = 0; j < rowData.length; j++) {
				let currentCol = j + 1;

				currentRow.getCell(currentCol).border = {
					top   : currentRow === 1 ? {style: 'thick'} : {style: 'thin'},
					left  : currentRow === 1 ? {style: 'thick'} : {style: 'thin'},
					bottom: currentRow === 3 + defectStatusData.length ? {style: 'thick'} : {style: 'thin'},
					right : currentRow === 1 + defectStatusData[0].length ? {style: 'thick'} : {style: 'thin'}
				};

				if (currentRow._number === 2) {
					currentRow.getCell(currentCol).font = {
						bold: true,
					};
				}
				if (currentCol === 1) {
					worksheet.getColumn(currentCol).width    = 30;
					currentRow.getCell(currentCol).alignment = middleLeftAlignment;
					currentRow.getCell(currentCol).font      = {
						bold: true,
					};
				} else {
					currentRow.getCell(currentCol).alignment = middleCenterAlignment;
				}
				currentRow.getCell(currentCol).value = rowData[j];

			}
		}
	};

	addDefectSummaryToExcelTable = (workbook, defectSummaryData) => {
		console.log("defectSummaryData: ", defectSummaryData);
		let worksheet = workbook.addWorksheet('defectSummaryData');

		let middleCenterAlignment = {vertical: 'middle', horizontal: 'center'};
		let middleRightAlignment  = {vertical: 'middle', horizontal: 'right'};
		let middleLeftAlignment   = {vertical: 'middle', horizontal: 'left'};

		worksheet.mergeCells('A1:H1');
		worksheet.getCell('A1').font      = {
			bold: true,
		};
		worksheet.getCell('A1').alignment = middleCenterAlignment;
		worksheet.getCell('A1').value     = "DEFECT SUMMARY";

		for (let i = 0; i < defectSummaryData.length; i++) {
			let rowData    = defectSummaryData[i];
			let currentRow = worksheet.getRow(i + 2);
			for (let j = 0; j < rowData.length; j++) {
				let currentCol                           = j + 1;
				worksheet.getColumn(currentCol).width    = 30;
				currentRow.getCell(currentCol).alignment = middleCenterAlignment;

				currentRow.getCell(currentCol).border = {
					top   : currentRow === 1 ? {style: 'thick'} : {style: 'thin'},
					left  : currentRow === 1 ? {style: 'thick'} : {style: 'thin'},
					bottom: currentRow === 3 + defectSummaryData.length ? {style: 'thick'} : {style: 'thin'},
					right : currentRow === 1 + defectSummaryData[0].length ? {style: 'thick'} : {style: 'thin'}
				};

				if (currentRow._number === 2) {
					currentRow.getCell(currentCol).font = {
						bold: true,
					};
				}
				if (currentCol === 1) {
					currentRow.getCell(currentCol).font = {
						bold: true,
					};
				}
				currentRow.getCell(currentCol).value = rowData[j];

			}
		}
	};

	addAlarmHistoryToExcelTable = (workbook, alarmHistoryData) => {
		console.log("alarmHistoryData: ", alarmHistoryData);
		let worksheet = workbook.addWorksheet('alarmHistoryData');

		let middleCenterAlignment = {vertical: 'middle', horizontal: 'center'};
		let middleRightAlignment  = {vertical: 'middle', horizontal: 'right'};
		let middleLeftAlignment   = {vertical: 'middle', horizontal: 'left'};

		worksheet.mergeCells('A1:J1');
		worksheet.getCell('A1').font      = {
			bold: true,
		};
		worksheet.getCell('A1').alignment = middleCenterAlignment;
		worksheet.getCell('A1').value     = "ALARM HISTORY";

		for (let i = 0; i < alarmHistoryData.length; i++) {
			let rowData    = alarmHistoryData[i];
			let currentRow = worksheet.getRow(i + 2);
			for (let j = 0; j < rowData.length; j++) {
				let currentCol                           = j + 1;
				worksheet.getColumn(currentCol).width    = 30;
				currentRow.getCell(currentCol).alignment = middleCenterAlignment;

				currentRow.getCell(currentCol).border = {
					top   : currentRow === 1 ? {style: 'thick'} : {style: 'thin'},
					left  : currentRow === 1 ? {style: 'thick'} : {style: 'thin'},
					bottom: currentRow === 3 + alarmHistoryData.length ? {style: 'thick'} : {style: 'thin'},
					right : currentRow === 1 + alarmHistoryData[0].length ? {style: 'thick'} : {style: 'thin'}
				};

				if (currentRow._number === 2) {
					currentRow.getCell(currentCol).font = {
						bold: true,
					};
				}
				if (currentCol === 1) {
					currentRow.getCell(currentCol).font = {
						bold: true,
					};
				}
				currentRow.getCell(currentCol).value = rowData[j];

			}
		}
	};

	render() {
		return  <Button className="icon" color="primary" onClick={() => this.exportExcelFile(this.props)}>
					<p><FontAwesomeIcon icon={faFileExcel}/><span>EXCEL</span></p>
				</Button>

		/*<span className="filter-div-excel" onClick={() => this.exportExcelFile(this.props)}>
		 <FontAwesomeIcon icon={faFileExcel}/><span style={{paddingLeft: 5}}>EXCEL</span>
		 </span>;*/
	}
}

const mapStateToProps = state => ({
	excelData: state.excelData
});

export default withRouter(connect(mapStateToProps)(DataExporter));
