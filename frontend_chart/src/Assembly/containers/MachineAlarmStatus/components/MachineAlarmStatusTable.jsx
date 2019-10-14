import React, {Component}               from 'react';
import "../../../scss/component/tabulator_midnight_custom.css"; // use Theme(s)
// for React 16.4.x use: import { ReactTabulator }
import {ARROW_ICON}                     from "../../../constants/propertyConstants";
import {Table}                          from "reactstrap";
import {MACHINE_ALARM_STATUS_CONSTANTS} from '../constants';

//			// {"status":200,"data":[{"alarm_date":"2019.07.09","factory_cd":"AS2","line_cd":"2030",
// "process_cd":"20105","sensor_type":"Temp","alarm_seq":1,"alarm_time":"05:15:40","alarm":"G","value":"",
// "article_no":"R6-30500","created_date":1562660433,"standard_from":1234570000,"standard_to":2,
// "model_nm":"PRINCESS WIDE D","article_nm":"R6-30500","process_nm":"Packpart Molding"}]}
const formatAlarmColumn = function (cell, formatterParams, onRendered) { //plain text value
	console.log("cell.getRow(): ", cell.getRow());
	let value = cell._cell.value;
	if (value.toUpperCase() === "R") {
		//cell.getRow().getElement().style.color = '#F84E4E';
		return "<span style='color:#F84E4E; font-size: large;'>●</span>";

	} else if (value.toUpperCase() === "Y") {
		//cell.getRow().getElement().style.color = '#FFD44F';
		return "<span style='color:#FFD44F; font-size: large;'>●</span>";
	} else {
		return "<span style='color:#BEBEBE; font-size: large;'>●</span>";
	}
};

const formatValueColumn = function (cell, formatterParams, onRendered) { //plain text value
	let value   = cell._cell.value;
	let rowData = cell.getRow()._row.data;
	if (rowData.alarm.toUpperCase() === "R") {
		return `<span style='color:#F84E4E;'>${value}</span>`;
	} else if (rowData.alarm.toUpperCase() === "Y") {
		return `<span style='color:#FFD44F;'>${value}</span>`;
	} else {
		return "<span></span>";
	}
	return value;
};

const formatDateTimeSensorColumn = function (cell, formatterParams, onRendered) { //plain text value
	let value   = cell._cell.value;
	let rowData = cell.getRow()._row.data;
	if (rowData.alarm.toUpperCase() === "R") {
		return `<span style='color:#F84E4E;'>${value}</span>`;
	} else if (rowData.alarm.toUpperCase() === "Y") {
		return `<span style='color:#FFD44F;'>${value}</span>`;
	} else {
		return `<span'>${value}</span>`;
	}
	return value;
};

const columns = [
	{title: "PROCESS", field: "process_nm", width: '15%', align: "center", headerFilter: "input"},
	{title          : "DATE",
		field       : "alarm_date",
		width       : '10%',
		align       : "center",
		headerFilter: "input",
		formatter   : formatDateTimeSensorColumn
	},
	{title          : "TIME",
		field       : "alarm_time",
		width       : '10%',
		align       : "center",
		headerFilter: "input",
		formatter   : formatDateTimeSensorColumn
	},
	{title          : "SENSOR TYPE",
		field       : "sensor_type",
		width       : '10%',
		align       : "center",
		headerFilter: "input",
		formatter   : formatDateTimeSensorColumn
	},
	{title: "STN", field: "standard_from", width: '15%', align: "center", headerFilter: "input"},
	{title          : "VALUE",
		field       : "value",
		width       : '10%',
		align       : "center",
		headerFilter: "input",
		formatter   : formatValueColumn
	},
	{title          : "ALARM",
		field       : "alarm",
		width       : '10%',
		align       : "center",
		headerFilter: "input",
		formatter   : formatAlarmColumn
	},
	{title: "MODEL", field: "model_nm", align: "center", width: '10%', headerFilter: "input"},
	{title: "ARTICLE", field: "article", width: '10%', align: "center", headerFilter: "input", formatter: "input"},
];

const alarmHistoryData = [
	{
		"process_nm"   : "Backpack Molding",
		"alarm_date"   : "2019.06.03",
		"alarm_time"   : "11:53",
		"sensor_type"  : "Temp 3",
		"standard_from": `10 ${ARROW_ICON} 30`,
		"value"        : "150",
		"alarm"        : "R",
		"model_nm"     : "Model-1",
		"article"      : "Article-1",
	},
	{
		"process_nm"   : "Toe Molding",
		"alarm_date"   : "2019.06.05",
		"alarm_time"   : "13:57",
		"sensor_type"  : "Temp 1",
		"standard_from": `10 ${ARROW_ICON} 500`,
		"value"        : "20",
		"alarm"        : "G",
		"model_nm"     : "Model-2",
		"article"      : "Article-1",
	},
	{
		"process_nm"   : "Heat Chamber",
		"alarm_date"   : "2019.06.15",
		"alarm_time"   : "10:15",
		"sensor_type"  : "Pressure 1",
		"standard_from": `10 ${ARROW_ICON} 60`,
		"value"        : "137",
		"alarm"        : "Y",
		"model_nm"     : "Model-3",
		"article"      : "Article-2",
	}
];

class MachineAlarmStatusTable extends Component {
	state = {
		data: []
	};

	fillRow = rowData => {
		let columns     = [];
		let totalGrey   = parseInt(rowData.sensor_no_1_gray) + parseInt(rowData.sensor_no_2_gray)
		                  + parseInt(rowData.sensor_no_3_gray) +
		                  parseInt(rowData.sensor_no_4_gray) + parseInt(rowData.sensor_no_5_gray)
		                  + parseInt(rowData.sensor_no_6_gray) +
		                  parseInt(rowData.sensor_no_8_gray) + parseInt(rowData.sensor_no_8_gray);
		let totalYellow = parseInt(rowData.sensor_no_1_yellow) + parseInt(rowData.sensor_no_2_yellow)
		                  + parseInt(rowData.sensor_no_3_yellow) +
		                  parseInt(rowData.sensor_no_4_yellow) + parseInt(rowData.sensor_no_5_yellow)
		                  + parseInt(rowData.sensor_no_6_yellow) +
		                  parseInt(rowData.sensor_no_8_yellow) + parseInt(rowData.sensor_no_8_yellow);
		let totalRed    = parseInt(rowData.sensor_no_1_red) + parseInt(rowData.sensor_no_2_red)
		                  + parseInt(rowData.sensor_no_3_red) +
		                  parseInt(rowData.sensor_no_4_red) + parseInt(rowData.sensor_no_5_red)
		                  + parseInt(rowData.sensor_no_6_red) +
		                  parseInt(rowData.sensor_no_8_red) + parseInt(rowData.sensor_no_8_red);
		columns[0]      = <td style={{textAlign: 'center', verticalAlign: 'middle'}}>{rowData.process_nm}</td>;

		columns[1] = <td style={{textAlign: 'center'}}></td>;
		columns[2] = <td style={{textAlign: 'center'}}></td>;
		columns[3] = <td style={{textAlign: 'center'}}></td>;
		columns[4] = <td style={{textAlign: 'center'}}></td>;
		columns[5] = <td style={{textAlign: 'center'}}></td>;
		columns[6] = <td style={{textAlign: 'center'}}></td>;
		columns[7] = <td style={{textAlign: 'center'}}></td>;
		columns[8] = <td style={{textAlign: 'center'}}></td>;
		columns[9] = <td style={{textAlign: 'center', backgroundColor: '#082738'}}>
			<div className="d-flex flex-column justify-content-center">
				<div className="d-flex justify-content-around">
					<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
					<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
					<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
				</div>
				<div className="d-flex justify-content-around">
					<span>{totalGrey}</span>
					<span>{totalYellow}</span>
					<span>{totalRed}</span>
				</div>
			</div>
		</td>;
		for (let i = 1; i < 9; i++) {
			let grayValue   = `sensor_no_${i}_gray`;
			let yellowValue = `sensor_no_${i}_yellow`;
			let redValue    = `sensor_no_${i}_red`;
			if (rowData[grayValue] > 0 || rowData[yellowValue] > 0 || rowData[redValue]) {
				columns[i] = <td style={{textAlign: 'center'}}>
					<div className="d-flex flex-column justify-content-center">
						<div className="d-flex justify-content-around">
							<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
							<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
							<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
						</div>
						<div className="d-flex justify-content-around">
							<span>{rowData[grayValue]}</span>
							<span>{rowData[yellowValue]}</span>
							<span>{rowData[redValue]}</span>
						</div>
					</div>
				</td>;
			}
		}
		return <tr>{columns}</tr>;
	};

	fillTableBody = data => {
		console.log("fillTableData");
		console.log("data 110: ", data);
		let tableRow = [];
		for (let i = 0; i < data.length; i++) {
			tableRow[i] = this.fillRow(data[i]);
		}
		return <tbody>
		{tableRow}
		</tbody>;
	};


	handleTableData = (data) => {
		let field = MACHINE_ALARM_STATUS_CONSTANTS.field;
		let result = [];
		result[field.backpack_temp.s1.g] = 0;
		result[field.backpack_temp.s1.y] = 0;
		result[field.backpack_temp.s1.r] = 0;
		result[field.backpack_temp.s3.g] = 0;
		result[field.backpack_temp.s3.y] = 0;
		result[field.backpack_temp.s3.r] = 0;
		result[field.backpack_temp.total.g] = 0;
		result[field.backpack_temp.total.y] = 0;
		result[field.backpack_temp.total.r] = 0;

		result[field.backpack_pressure.s1.g] = 0;
		result[field.backpack_pressure.s1.y] = 0;
		result[field.backpack_pressure.s1.r] = 0;
		result[field.backpack_pressure.s2.g] = 0;
		result[field.backpack_pressure.s2.y] = 0;
		result[field.backpack_pressure.s2.r] = 0;
		result[field.backpack_pressure.s3.g] = 0;
		result[field.backpack_pressure.s3.y] = 0;
		result[field.backpack_pressure.s3.r] = 0;
		result[field.backpack_pressure.s4.g] = 0;
		result[field.backpack_pressure.s4.y] = 0;
		result[field.backpack_pressure.s4.r] = 0;
		result[field.backpack_pressure.total.g] = 0;
		result[field.backpack_pressure.total.y] = 0;
		result[field.backpack_pressure.total.r] = 0;

		result[field.backpack_timer.s1.g] = 0;
		result[field.backpack_timer.s1.y] = 0;
		result[field.backpack_timer.s1.r] = 0;
		result[field.backpack_timer.s2.g] = 0;
		result[field.backpack_timer.s2.y] = 0;
		result[field.backpack_timer.s2.r] = 0;
		result[field.backpack_timer.s3.g] = 0;
		result[field.backpack_timer.s3.y] = 0;
		result[field.backpack_timer.s3.r] = 0;
		result[field.backpack_timer.s4.g] = 0;
		result[field.backpack_timer.s4.y] = 0;
		result[field.backpack_timer.s4.r] = 0;
		result[field.backpack_timer.total.g] = 0;
		result[field.backpack_timer.total.y] = 0;
		result[field.backpack_timer.total.r] = 0;

		result[field.toe_temp.s1.g] = 0;
		result[field.toe_temp.s1.y] = 0;
		result[field.toe_temp.s1.r] = 0;
		result[field.toe_temp.s2.g] = 0;
		result[field.toe_temp.s2.y] = 0;
		result[field.toe_temp.s2.r] = 0;
		result[field.toe_temp.s3.g] = 0;
		result[field.toe_temp.s3.y] = 0;
		result[field.toe_temp.s3.r] = 0;
		result[field.toe_temp.s4.g] = 0;
		result[field.toe_temp.s4.y] = 0;
		result[field.toe_temp.s4.r] = 0;
		result[field.toe_temp.total.g] = 0;
		result[field.toe_temp.total.y] = 0;
		result[field.toe_temp.total.r] = 0;

		result[field.toe_pressure.s1.g] = 0;
		result[field.toe_pressure.s1.y] = 0;
		result[field.toe_pressure.s1.r] = 0;
		result[field.toe_pressure.s2.g] = 0;
		result[field.toe_pressure.s2.y] = 0;
		result[field.toe_pressure.s2.r] = 0;
		result[field.toe_pressure.s3.g] = 0;
		result[field.toe_pressure.s3.y] = 0;
		result[field.toe_pressure.s3.r] = 0;
		result[field.toe_pressure.s4.g] = 0;
		result[field.toe_pressure.s4.y] = 0;
		result[field.toe_pressure.s4.r] = 0;
		result[field.toe_pressure.total.g] = 0;
		result[field.toe_pressure.total.y] = 0;
		result[field.toe_pressure.total.r] = 0;

		result[field.toe_timer.s1.g] = 0;
		result[field.toe_timer.s1.y] = 0;
		result[field.toe_timer.s1.r] = 0;
		result[field.toe_timer.s2.g] = 0;
		result[field.toe_timer.s2.y] = 0;
		result[field.toe_timer.s2.r] = 0;
		result[field.toe_timer.s3.g] = 0;
		result[field.toe_timer.s3.y] = 0;
		result[field.toe_timer.s3.r] = 0;
		result[field.toe_timer.s4.g] = 0;
		result[field.toe_timer.s4.y] = 0;
		result[field.toe_timer.s4.r] = 0;
		result[field.toe_timer.total.g] = 0;
		result[field.toe_timer.total.y] = 0;
		result[field.toe_timer.total.r] = 0;

		result[field.heat_temp.s1.g] = 0;
		result[field.heat_temp.s1.y] = 0;
		result[field.heat_temp.s1.r] = 0;
		result[field.heat_temp.total.g] = 0;
		result[field.heat_temp.total.y] = 0;
		result[field.heat_temp.total.r] = 0;

		result[field.cementing_temp.s1.g] = 0;
		result[field.cementing_temp.s1.y] = 0;
		result[field.cementing_temp.s1.r] = 0;
		result[field.cementing_temp.s2.g] = 0;
		result[field.cementing_temp.s2.y] = 0;
		result[field.cementing_temp.s2.r] = 0;
		result[field.cementing_temp.s3.g] = 0;
		result[field.cementing_temp.s3.y] = 0;
		result[field.cementing_temp.s3.r] = 0;
		result[field.cementing_temp.s4.g] = 0;
		result[field.cementing_temp.s4.y] = 0;
		result[field.cementing_temp.s4.r] = 0;
		result[field.cementing_temp.s5.g] = 0;
		result[field.cementing_temp.s5.y] = 0;
		result[field.cementing_temp.s5.r] = 0;
		result[field.cementing_temp.s6.g] = 0;
		result[field.cementing_temp.s6.y] = 0;
		result[field.cementing_temp.s6.r] = 0;
		result[field.cementing_temp.s7.g] = 0;
		result[field.cementing_temp.s7.y] = 0;
		result[field.cementing_temp.s7.r] = 0;
		result[field.cementing_temp.s8.g] = 0;
		result[field.cementing_temp.s8.y] = 0;
		result[field.cementing_temp.s8.r] = 0;
		result[field.cementing_temp.total.g] = 0;
		result[field.cementing_temp.total.y] = 0;
		result[field.cementing_temp.total.r] = 0;

		result[field.attach_pressure.s1.g] = 0;
		result[field.attach_pressure.s1.y] = 0;
		result[field.attach_pressure.s1.r] = 0;
		result[field.attach_pressure.s2.g] = 0;
		result[field.attach_pressure.s2.y] = 0;
		result[field.attach_pressure.s2.r] = 0;
		result[field.attach_pressure.s3.g] = 0;
		result[field.attach_pressure.s3.y] = 0;
		result[field.attach_pressure.s3.r] = 0;
		result[field.attach_pressure.total.g] = 0;
		result[field.attach_pressure.total.y] = 0;
		result[field.attach_pressure.total.r] = 0;

		result[field.attach_timer.s1.g] = 0;
		result[field.attach_timer.s1.y] = 0;
		result[field.attach_timer.s1.r] = 0;
		result[field.attach_timer.s2.g] = 0;
		result[field.attach_timer.s2.y] = 0;
		result[field.attach_timer.s2.r] = 0;
		result[field.attach_timer.s3.g] = 0;
		result[field.attach_timer.s3.y] = 0;
		result[field.attach_timer.s3.r] = 0;
		result[field.attach_timer.total.g] = 0;
		result[field.attach_timer.total.y] = 0;
		result[field.attach_timer.total.r] = 0;

		result[field.chiller_temp.s1.g] = 0;
		result[field.chiller_temp.s1.y] = 0;
		result[field.chiller_temp.s1.r] = 0;
		result[field.chiller_temp.total.g] = 0;
		result[field.chiller_temp.total.y] = 0;
		result[field.chiller_temp.total.r] = 0;


		console.log("handleTableData handleTableData handleTableData");
		console.log("data: ", data);

		/*
		 0:
		 cate_cd: 201
		 definition_value: "033"
		 handle_pressure: ""
		 handle_temperature: ""
		 handle_timer: ""
		 process_cd: "20113"
		 process_nm: "Attach Sole with Upper"
		 sensor_no: 1
		 sensor_no_1_gray: 0
		 sensor_no_1_green: 1
		 sensor_no_1_red: 0
		 sensor_no_1_yellow: 0
		 sensor_no_2_gray: 0
		 sensor_no_2_green: 0
		 sensor_no_2_red: 0
		 sensor_no_2_yellow: 1
		 sensor_no_3_gray: 0
		 sensor_no_3_green: 0
		 sensor_no_3_red: 1
		 sensor_no_3_yellow: 0
		 sensor_no_4_gray: 0
		 sensor_no_4_green: 0
		 sensor_no_4_red: 0
		 sensor_no_4_yellow: 0
		 sensor_no_5_gray: 0
		 sensor_no_5_green: 0
		 sensor_no_5_red: 0
		 sensor_no_5_yellow: 0
		 sensor_no_6_gray: 0
		 sensor_no_6_green: 0
		 sensor_no_6_red: 0
		 sensor_no_6_yellow: 0
		 sensor_no_7_gray: 0
		 sensor_no_7_green: 0
		 sensor_no_7_red: 0
		 sensor_no_7_yellow: 0
		 sensor_no_8_gray: 0
		 sensor_no_8_green: 0
		 sensor_no_8_red: 0
		 sensor_no_8_yellow: 0
		 sensor_type: 2
		 sensor_type_nm: "Pressure"
		*/
		for (let i = 0; i < data.length; i++){
			let item = data[i];
			if (item.process_cd == '20105'){//Backpart molding 244
				if (item.sensor_type == 1) {//1: temp, 2: pressure, 3: timer
					result[field.backpack_temp.s1.g] = item.sensor_no_1_gray;
					result[field.backpack_temp.s1.y] = item.sensor_no_1_yellow;
					result[field.backpack_temp.s1.r] = item.sensor_no_1_red;
					result[field.backpack_temp.s3.g] = item.sensor_no_3_gray;
					result[field.backpack_temp.s3.y] = item.sensor_no_3_yellow;
					result[field.backpack_temp.s3.r] = item.sensor_no_3_red;

					result[field.backpack_temp.total.g] = item.sensor_no_1_gray + item.sensor_no_3_gray;
					result[field.backpack_temp.total.y] = item.sensor_no_1_gray + item.sensor_no_3_yellow;
					result[field.backpack_temp.total.r] = item.sensor_no_1_red + item.sensor_no_3_red;
				} else if (item.sensor_type == 2){//pressure
					result[field.backpack_pressure.s1.g] = item.sensor_no_1_gray;
					result[field.backpack_pressure.s1.y] = item.sensor_no_1_yellow;
					result[field.backpack_pressure.s1.r] = item.sensor_no_1_red;
					result[field.backpack_pressure.s2.g] = item.sensor_no_2_gray;
					result[field.backpack_pressure.s2.y] = item.sensor_no_2_yellow;
					result[field.backpack_pressure.s2.r] = item.sensor_no_2_red;
					result[field.backpack_pressure.s3.g] = item.sensor_no_3_gray;
					result[field.backpack_pressure.s3.y] = item.sensor_no_3_yellow;
					result[field.backpack_pressure.s3.r] = item.sensor_no_3_red;
					result[field.backpack_pressure.s4.g] = item.sensor_no_4_gray;
					result[field.backpack_pressure.s4.y] = item.sensor_no_4_yellow;
					result[field.backpack_pressure.s4.r] = item.sensor_no_4_red;

					result[field.backpack_pressure.total.g] = item.sensor_no_1_gray + item.sensor_no_2_gray + item.sensor_no_3_gray + item.sensor_no_4_gray;
					result[field.backpack_pressure.total.y] = item.sensor_no_1_yellow + item.sensor_no_2_yellow + item.sensor_no_3_yellow + item.sensor_no_4_yellow;
					result[field.backpack_pressure.total.r] = item.sensor_no_1_red + item.sensor_no_2_red + item.sensor_no_3_red + item.sensor_no_4_red;
				} else if (item.sensor_type == 3){//timer
					result[field.backpack_timer.s1.g] = item.sensor_no_1_gray;
					result[field.backpack_timer.s1.y] = item.sensor_no_1_yellow;
					result[field.backpack_timer.s1.r] = item.sensor_no_1_red;
					result[field.backpack_timer.s2.g] = item.sensor_no_2_gray;
					result[field.backpack_timer.s2.y] = item.sensor_no_2_yellow;
					result[field.backpack_timer.s2.r] = item.sensor_no_2_red;
					result[field.backpack_timer.s3.g] = item.sensor_no_3_gray;
					result[field.backpack_timer.s3.y] = item.sensor_no_3_yellow;
					result[field.backpack_timer.s3.r] = item.sensor_no_3_red;
					result[field.backpack_timer.s4.g] = item.sensor_no_4_gray;
					result[field.backpack_timer.s4.y] = item.sensor_no_4_yellow;
					result[field.backpack_timer.s4.r] = item.sensor_no_4_red;

					result[field.backpack_timer.total.g] = item.sensor_no_1_gray + item.sensor_no_2_gray + item.sensor_no_3_gray + item.sensor_no_4_gray;
					result[field.backpack_timer.total.y] = item.sensor_no_1_yellow + item.sensor_no_2_yellow + item.sensor_no_3_yellow + item.sensor_no_4_yellow;
					result[field.backpack_timer.total.r] = item.sensor_no_1_red + item.sensor_no_2_red + item.sensor_no_3_red + item.sensor_no_4_red;
				}
			} else if (item.process_cd == '20106') {//Toe Molding    444
				if (item.sensor_type == 1) {//1: temp, 2: pressure, 3: timer
					result[field.toe_temp.s1.g] = item.sensor_no_1_gray;
					result[field.toe_temp.s1.y] = item.sensor_no_1_yellow;
					result[field.toe_temp.s1.r] = item.sensor_no_1_red;
					result[field.toe_temp.s2.g] = item.sensor_no_2_gray;
					result[field.toe_temp.s2.y] = item.sensor_no_2_yellow;
					result[field.toe_temp.s2.r] = item.sensor_no_2_red;
					result[field.toe_temp.s3.g] = item.sensor_no_3_gray;
					result[field.toe_temp.s3.y] = item.sensor_no_3_yellow;
					result[field.toe_temp.s3.r] = item.sensor_no_3_red;
					result[field.toe_temp.s4.g] = item.sensor_no_4_gray;
					result[field.toe_temp.s4.y] = item.sensor_no_4_yellow;
					result[field.toe_temp.s4.r] = item.sensor_no_4_red;

					result[field.toe_temp.total.g] = item.sensor_no_1_gray + item.sensor_no_2_gray + item.sensor_no_3_gray + item.sensor_no_4_gray;
					result[field.toe_temp.total.y] = item.sensor_no_1_yellow + item.sensor_no_2_yellow + item.sensor_no_3_yellow + item.sensor_no_4_yellow;
					result[field.toe_temp.total.r] = item.sensor_no_1_red + item.sensor_no_2_red + item.sensor_no_3_red + item.sensor_no_4_red;
				} else if (item.sensor_type == 2) {//1: temp, 2: pressure, 3: timer
					result[field.toe_pressure.s1.g] = item.sensor_no_1_gray;
					result[field.toe_pressure.s1.y] = item.sensor_no_1_yellow;
					result[field.toe_pressure.s1.r] = item.sensor_no_1_red;
					result[field.toe_pressure.s2.g] = item.sensor_no_2_gray;
					result[field.toe_pressure.s2.y] = item.sensor_no_2_yellow;
					result[field.toe_pressure.s2.r] = item.sensor_no_2_red;
					result[field.toe_pressure.s3.g] = item.sensor_no_3_gray;
					result[field.toe_pressure.s3.y] = item.sensor_no_3_yellow;
					result[field.toe_pressure.s3.r] = item.sensor_no_3_red;
					result[field.toe_pressure.s4.g] = item.sensor_no_4_gray;
					result[field.toe_pressure.s4.y] = item.sensor_no_4_yellow;
					result[field.toe_pressure.s4.r] = item.sensor_no_4_red;

					result[field.toe_pressure.total.g] = item.sensor_no_1_gray + item.sensor_no_2_gray + item.sensor_no_3_gray + item.sensor_no_4_gray;
					result[field.toe_pressure.total.y] = item.sensor_no_1_yellow + item.sensor_no_2_yellow + item.sensor_no_3_yellow + item.sensor_no_4_yellow;
					result[field.toe_pressure.total.r] = item.sensor_no_1_red + item.sensor_no_2_red + item.sensor_no_3_red + item.sensor_no_4_red;
				} else if (item.sensor_type == 3) {//1: temp, 2: pressure, 3: timer
					result[field.toe_timer.s1.g] = item.sensor_no_1_gray;
					result[field.toe_timer.s1.y] = item.sensor_no_1_yellow;
					result[field.toe_timer.s1.r] = item.sensor_no_1_red;
					result[field.toe_timer.s2.g] = item.sensor_no_2_gray;
					result[field.toe_timer.s2.y] = item.sensor_no_2_yellow;
					result[field.toe_timer.s2.r] = item.sensor_no_2_red;
					result[field.toe_timer.s3.g] = item.sensor_no_3_gray;
					result[field.toe_timer.s3.y] = item.sensor_no_3_yellow;
					result[field.toe_timer.s3.r] = item.sensor_no_3_red;
					result[field.toe_timer.s4.g] = item.sensor_no_4_gray;
					result[field.toe_timer.s4.y] = item.sensor_no_4_yellow;
					result[field.toe_timer.s4.r] = item.sensor_no_4_red;

					result[field.toe_timer.total.g] = item.sensor_no_1_gray + item.sensor_no_2_gray + item.sensor_no_3_gray + item.sensor_no_4_gray;
					result[field.toe_timer.total.y] = item.sensor_no_1_yellow + item.sensor_no_2_yellow + item.sensor_no_3_yellow + item.sensor_no_4_yellow;
					result[field.toe_timer.total.r] = item.sensor_no_1_red + item.sensor_no_2_red + item.sensor_no_3_red + item.sensor_no_4_red;
				}

			} else if (item.process_cd == '20110') {//Heat Chamber   100
				if (item.sensor_type == 1) {//temp
					result[field.heat_temp.s1.g] = item.sensor_no_1_gray;
					result[field.heat_temp.s1.y] = item.sensor_no_1_yellow;
					result[field.heat_temp.s1.r] = item.sensor_no_1_red;

					result[field.heat_temp.total.g] = item.sensor_no_1_gray;
					result[field.heat_temp.total.y] = item.sensor_no_1_yellow;
					result[field.heat_temp.total.r] = item.sensor_no_1_red;
				}
			} else if (item.process_cd == '20112') {//Cementing    800
				if (item.sensor_type == 1) {//temp
					result[field.cementing_temp.s1.g] = item.sensor_no_1_gray;
					result[field.cementing_temp.s1.y] = item.sensor_no_1_yellow;
					result[field.cementing_temp.s1.r] = item.sensor_no_1_red;
					result[field.cementing_temp.s2.g] = item.sensor_no_2_gray;
					result[field.cementing_temp.s2.y] = item.sensor_no_2_yellow;
					result[field.cementing_temp.s2.r] = item.sensor_no_2_red;
					result[field.cementing_temp.s3.g] = item.sensor_no_3_gray;
					result[field.cementing_temp.s3.y] = item.sensor_no_3_yellow;
					result[field.cementing_temp.s3.r] = item.sensor_no_3_red;
					result[field.cementing_temp.s4.g] = item.sensor_no_4_gray;
					result[field.cementing_temp.s4.y] = item.sensor_no_4_yellow;
					result[field.cementing_temp.s4.r] = item.sensor_no_4_red;
					result[field.cementing_temp.s5.g] = item.sensor_no_5_gray;
					result[field.cementing_temp.s5.y] = item.sensor_no_5_yellow;
					result[field.cementing_temp.s5.r] = item.sensor_no_5_red;
					result[field.cementing_temp.s6.g] = item.sensor_no_6_gray;
					result[field.cementing_temp.s6.y] = item.sensor_no_6_yellow;
					result[field.cementing_temp.s6.r] = item.sensor_no_6_red;
					result[field.cementing_temp.s7.g] = item.sensor_no_7_gray;
					result[field.cementing_temp.s7.y] = item.sensor_no_7_yellow;
					result[field.cementing_temp.s7.r] = item.sensor_no_7_red;
					result[field.cementing_temp.s8.g] = item.sensor_no_8_gray;
					result[field.cementing_temp.s8.y] = item.sensor_no_8_yellow;
					result[field.cementing_temp.s8.r] = item.sensor_no_8_red;

					result[field.cementing_temp.total.g] = item.sensor_no_1_gray + item.sensor_no_2_gray + item.sensor_no_3_gray + item.sensor_no_4_gray + item.sensor_no_5_gray + item.sensor_no_6_gray + item.sensor_no_7_gray + item.sensor_no_8_gray;
					result[field.cementing_temp.total.y] = item.sensor_no_1_yellow + item.sensor_no_2_yellow + item.sensor_no_3_yellow + item.sensor_no_4_yellow + item.sensor_no_5_yellow + item.sensor_no_6_yellow + item.sensor_no_7_yellow + item.sensor_no_8_yellow;
					result[field.cementing_temp.total.r] = item.sensor_no_1_red + item.sensor_no_2_red + item.sensor_no_3_red + item.sensor_no_4_red + item.sensor_no_5_red + item.sensor_no_6_red + item.sensor_no_7_red + item.sensor_no_8_red;
				}
			} else if (item.process_cd == '20113') {//Attach Sole with Upper   033
				if (item.sensor_type == 1){ //pressure
					result[field.attach_pressure.s1.g] = item.sensor_no_1_gray;
					result[field.attach_pressure.s1.y] = item.sensor_no_1_yellow;
					result[field.attach_pressure.s1.r] = item.sensor_no_1_red;
					result[field.attach_pressure.s2.g] = item.sensor_no_2_gray;
					result[field.attach_pressure.s2.y] = item.sensor_no_2_yellow;
					result[field.attach_pressure.s2.r] = item.sensor_no_2_red;
					result[field.attach_pressure.s3.g] = item.sensor_no_3_gray;
					result[field.attach_pressure.s3.y] = item.sensor_no_3_yellow;
					result[field.attach_pressure.s3.r] = item.sensor_no_3_red;

					result[field.attach_pressure.total.g] = item.sensor_no_1_gray + item.sensor_no_2_gray + item.sensor_no_3_gray;
					result[field.attach_pressure.total.y] = item.sensor_no_1_yellow + item.sensor_no_2_yellow + item.sensor_no_3_yellow;
					result[field.attach_pressure.total.r] = item.sensor_no_1_red + item.sensor_no_2_red + item.sensor_no_3_red;
				} else if (item.sensor_type == 3) {//timer
					result[field.attach_timer.s1.g] = item.sensor_no_1_gray;
					result[field.attach_timer.s1.y] = item.sensor_no_1_yellow;
					result[field.attach_timer.s1.r] = item.sensor_no_1_red;
					result[field.attach_timer.s2.g] = item.sensor_no_2_gray;
					result[field.attach_timer.s2.y] = item.sensor_no_2_yellow;
					result[field.attach_timer.s2.r] = item.sensor_no_2_red;
					result[field.attach_timer.s3.g] = item.sensor_no_3_gray;
					result[field.attach_timer.s3.y] = item.sensor_no_3_yellow;
					result[field.attach_timer.s3.r] = item.sensor_no_3_red;

					result[field.attach_timer.total.g] = item.sensor_no_1_gray + item.sensor_no_2_gray + item.sensor_no_3_gray;
					result[field.attach_timer.total.y] = item.sensor_no_1_yellow + item.sensor_no_2_yellow + item.sensor_no_3_yellow;
					result[field.attach_timer.total.r] = item.sensor_no_1_red + item.sensor_no_2_red + item.sensor_no_3_red;
				}
			} else if (item.process_cd == '20114') {//Chiller   100
				if (item.sensor_type == 1) {//temp
					result[field.chiller_temp.s1.g] = item.sensor_no_2_gray;
					result[field.chiller_temp.s1.y] = item.sensor_no_2_yellow;
					result[field.chiller_temp.s1.r] = item.sensor_no_2_red;

					result[field.chiller_temp.total.g] = item.sensor_no_2_gray;
					result[field.chiller_temp.total.y] = item.sensor_no_2_yellow;
					result[field.chiller_temp.total.r] = item.sensor_no_2_red;
				}
			}
		}
		return result;
	}

	render() {
		let {data}    = this.props;
		data          = data ? data : [];
		//let tableBody = this.fillTableBody(data);
		let tableData = this.handleTableData(data);
		let field = MACHINE_ALARM_STATUS_CONSTANTS.field;
		const options = {
			height     : "40em",
			movableRows: false,
		};
		return (
			<Table responsive className="table-striped" style={{backgroundColor: '#232529', color: 'white'}}>
				<thead>
					<tr>
						<td style={{textAlign: 'center'}}>PROCESS</td>
						<td style={{textAlign: 'center'}}>TYPE</td>
						<td style={{textAlign: 'center'}}>Sensor No 1</td>
						<td style={{textAlign: 'center'}}>Sensor No 2</td>
						<td style={{textAlign: 'center'}}>Sensor No 3</td>
						<td style={{textAlign: 'center'}}>Sensor No 4</td>
						<td style={{textAlign: 'center'}}>Sensor No 5</td>
						<td style={{textAlign: 'center'}}>Sensor No 6</td>
						<td style={{textAlign: 'center'}}>Sensor No 7</td>
						<td style={{textAlign: 'center'}}>Sensor No 8</td>
						<td style={{textAlign: 'center', backgroundColor: '#082738'}}>TOTAL</td>
					</tr>
				</thead>
				{/*{tableBody}*/}
				<tbody>
					{/*Backpack Molding*/}
					<tr>
						<td rowSpan={3} style={{textAlign: 'center', verticalAlign: 'middle'}}>Backpack Molding</td>
						<td style={{textAlign: 'left', verticalAlign: 'middle'}}>
							<div className="d-flex flex-column justify-content-center">
								<span>Temperature</span>
							</div>
						</td>

						{/*//backpack temp s1*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.backpack_temp.s1.g]}</span>
									<span>{tableData[field.backpack_temp.s1.y]}</span>
									<span>{tableData[field.backpack_temp.s1.r]}</span>
								</div>
							</div>
						</td>
						<td></td>
						{/*//backpack temp s3*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.backpack_temp.s3.g]}</span>
									<span>{tableData[field.backpack_temp.s3.y]}</span>
									<span>{tableData[field.backpack_temp.s3.r]}</span>
								</div>
							</div>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						{/*//backpack temp total*/}
						<td style={{textAlign: 'center', backgroundColor: '#082738'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.backpack_temp.total.g]}</span>
									<span>{tableData[field.backpack_temp.total.y]}</span>
									<span>{tableData[field.backpack_temp.total.r]}</span>
								</div>
							</div>
						</td>
					</tr>
					<tr>
						<td style={{textAlign: 'left', verticalAlign: 'middle'}}>
							<div className="d-flex flex-column justify-content-center">
								<span>Pressure</span>
							</div>
						</td>
						{/*//backpack pressure s1*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.backpack_pressure.s1.g]}</span>
									<span>{tableData[field.backpack_pressure.s1.y]}</span>
									<span>{tableData[field.backpack_pressure.s1.r]}</span>
								</div>
							</div>
						</td>
						{/*//backpack pressure s2*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.backpack_pressure.s2.g]}</span>
									<span>{tableData[field.backpack_pressure.s2.y]}</span>
									<span>{tableData[field.backpack_pressure.s2.r]}</span>
								</div>
							</div>
						</td>
						{/*//backpack pressure s3*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.backpack_pressure.s3.g]}</span>
									<span>{tableData[field.backpack_pressure.s3.y]}</span>
									<span>{tableData[field.backpack_pressure.s3.r]}</span>
								</div>
							</div>
						</td>
						{/*//backpack pressure s4*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.backpack_pressure.s4.g]}</span>
									<span>{tableData[field.backpack_pressure.s4.y]}</span>
									<span>{tableData[field.backpack_pressure.s4.r]}</span>
								</div>
							</div>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						{/*//backpack pressure total*/}
						<td style={{textAlign: 'center', backgroundColor: '#082738'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.backpack_pressure.total.g]}</span>
									<span>{tableData[field.backpack_pressure.total.y]}</span>
									<span>{tableData[field.backpack_pressure.total.r]}</span>
								</div>
							</div>
						</td>
					</tr>
					<tr>
						<td style={{textAlign: 'left', verticalAlign: 'middle'}}>
							<div className="d-flex flex-column justify-content-center">
								<span>Timer</span>
							</div>
						</td>
						{/*backpack timer s1*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.backpack_timer.s1.g]}</span>
									<span>{tableData[field.backpack_timer.s1.y]}</span>
									<span>{tableData[field.backpack_timer.s1.r]}</span>
								</div>
							</div>
						</td>
						{/*backpack timer s2*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.backpack_timer.s2.g]}</span>
									<span>{tableData[field.backpack_timer.s2.y]}</span>
									<span>{tableData[field.backpack_timer.s2.r]}</span>
								</div>
							</div>
						</td>
						{/*backpack timer s3*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.backpack_timer.s3.g]}</span>
									<span>{tableData[field.backpack_timer.s3.y]}</span>
									<span>{tableData[field.backpack_timer.s3.r]}</span>
								</div>
							</div>
						</td>
						{/*backpack timer s4*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.backpack_timer.s4.g]}</span>
									<span>{tableData[field.backpack_timer.s4.y]}</span>
									<span>{tableData[field.backpack_timer.s4.r]}</span>
								</div>
							</div>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						{/*backpack timer total*/}
						<td style={{textAlign: 'center', backgroundColor: '#082738'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.backpack_timer.total.g]}</span>
									<span>{tableData[field.backpack_timer.total.y]}</span>
									<span>{tableData[field.backpack_timer.total.r]}</span>
								</div>
							</div>
						</td>
					</tr>

					{/*Toe Molding*/}
					<tr>
						<td rowSpan={3} style={{textAlign: 'center', verticalAlign: 'middle'}}>Toe Molding</td>
						<td style={{textAlign: 'left', verticalAlign: 'middle'}}>
							<div className="d-flex flex-column justify-content-center">
								<span>Temperature</span>
							</div>
						</td>
						{/*Toe Molding temp s1*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.toe_temp.s1.g]}</span>
									<span>{tableData[field.toe_temp.s1.y]}</span>
									<span>{tableData[field.toe_temp.s1.r]}</span>
								</div>
							</div>
						</td>
						{/*Toe Molding temp s2*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.toe_temp.s2.g]}</span>
									<span>{tableData[field.toe_temp.s2.y]}</span>
									<span>{tableData[field.toe_temp.s2.r]}</span>
								</div>
							</div>
						</td>
						{/*Toe Molding temp s3*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.toe_temp.s3.g]}</span>
									<span>{tableData[field.toe_temp.s3.y]}</span>
									<span>{tableData[field.toe_temp.s3.r]}</span>
								</div>
							</div>
						</td>
						{/*Toe Molding temp s4*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.toe_temp.s4.g]}</span>
									<span>{tableData[field.toe_temp.s4.y]}</span>
									<span>{tableData[field.toe_temp.s4.r]}</span>
								</div>
							</div>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						{/*Toe Molding temp total*/}
						<td style={{textAlign: 'center', backgroundColor: '#082738'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.toe_temp.total.g]}</span>
									<span>{tableData[field.toe_temp.total.y]}</span>
									<span>{tableData[field.toe_temp.total.r]}</span>
								</div>
							</div>
						</td>
					</tr>
					<tr>
						<td style={{textAlign: 'left', verticalAlign: 'middle'}}>
							<div className="d-flex flex-column justify-content-center">
								<span>Pressure</span>
							</div>
						</td>
						{/*Toe Molding pressure s1*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.toe_pressure.s1.g]}</span>
									<span>{tableData[field.toe_pressure.s1.y]}</span>
									<span>{tableData[field.toe_pressure.s1.r]}</span>
								</div>
							</div>
						</td>
						{/*Toe Molding pressure s2*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.toe_pressure.s2.g]}</span>
									<span>{tableData[field.toe_pressure.s2.y]}</span>
									<span>{tableData[field.toe_pressure.s2.r]}</span>
								</div>
							</div>
						</td>
						{/*Toe Molding pressure s3*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.toe_pressure.s3.g]}</span>
									<span>{tableData[field.toe_pressure.s3.y]}</span>
									<span>{tableData[field.toe_pressure.s3.r]}</span>
								</div>
							</div>
						</td>
						{/*Toe Molding pressure s4*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.toe_pressure.s4.g]}</span>
									<span>{tableData[field.toe_pressure.s4.y]}</span>
									<span>{tableData[field.toe_pressure.s4.r]}</span>
								</div>
							</div>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						{/*Toe Molding pressure total*/}
						<td style={{textAlign: 'center', backgroundColor: '#082738'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.toe_pressure.total.g]}</span>
									<span>{tableData[field.toe_pressure.total.y]}</span>
									<span>{tableData[field.toe_pressure.total.r]}</span>
								</div>
							</div>
						</td>
					</tr>
					<tr>
						<td style={{textAlign: 'left', verticalAlign: 'middle'}}>
							<div className="d-flex flex-column justify-content-center">
								<span>Timer</span>
							</div>
						</td>
						{/*Toe Molding timer s1*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.toe_timer.s1.g]}</span>
									<span>{tableData[field.toe_timer.s1.y]}</span>
									<span>{tableData[field.toe_timer.s1.r]}</span>
								</div>
							</div>
						</td>
						{/*Toe Molding timer s2*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.toe_timer.s2.g]}</span>
									<span>{tableData[field.toe_timer.s2.y]}</span>
									<span>{tableData[field.toe_timer.s2.r]}</span>
								</div>
							</div>
						</td>
						{/*Toe Molding timer s3*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.toe_timer.s3.g]}</span>
									<span>{tableData[field.toe_timer.s3.y]}</span>
									<span>{tableData[field.toe_timer.s3.r]}</span>
								</div>
							</div>
						</td>
						{/*Toe Molding timer s4*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.toe_timer.s4.g]}</span>
									<span>{tableData[field.toe_timer.s4.y]}</span>
									<span>{tableData[field.toe_timer.s4.r]}</span>
								</div>
							</div>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						{/*Toe Molding timer total*/}
						<td style={{textAlign: 'center', backgroundColor: '#082738'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.toe_timer.total.g]}</span>
									<span>{tableData[field.toe_timer.total.y]}</span>
									<span>{tableData[field.toe_timer.total.r]}</span>
								</div>
							</div>
						</td>
					</tr>

					{/*Heat Chamber*/}
					<tr>
						<td style={{textAlign: 'center', verticalAlign: 'middle'}}>Heat Chamber</td>
						<td style={{textAlign: 'left', verticalAlign: 'middle'}}>
							<div className="d-flex flex-column justify-content-center">
								<span>Temperature</span>
							</div>
						</td>
						{/*Heat Chamber temp s1*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.heat_temp.s1.g]}</span>
									<span>{tableData[field.heat_temp.s1.y]}</span>
									<span>{tableData[field.heat_temp.s1.r]}</span>
								</div>
							</div>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td style={{textAlign: 'center', backgroundColor: '#082738'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.heat_temp.total.g]}</span>
									<span>{tableData[field.heat_temp.total.y]}</span>
									<span>{tableData[field.heat_temp.total.r]}</span>
								</div>
							</div>
						</td>
					</tr>

					{/*Cemeting*/}
					<tr>
						<td style={{textAlign: 'center', verticalAlign: 'middle'}}>Cementing</td>
						<td style={{textAlign: 'left', verticalAlign: 'middle'}}>
							<div className="d-flex flex-column justify-content-center">
								<span>Temperature</span>
							</div>
						</td>
						{/*Cemeting temp s1*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.cementing_temp.s1.g]}</span>
									<span>{tableData[field.cementing_temp.s1.y]}</span>
									<span>{tableData[field.cementing_temp.s1.r]}</span>
								</div>
							</div>
						</td>
						{/*Cemeting temp s2*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.cementing_temp.s2.g]}</span>
									<span>{tableData[field.cementing_temp.s2.y]}</span>
									<span>{tableData[field.cementing_temp.s2.r]}</span>
								</div>
							</div>
						</td>
						{/*Cemeting temp s3*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.cementing_temp.s3.g]}</span>
									<span>{tableData[field.cementing_temp.s3.y]}</span>
									<span>{tableData[field.cementing_temp.s3.r]}</span>
								</div>
							</div>
						</td>
						{/*Cemeting temp s4*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.cementing_temp.s4.g]}</span>
									<span>{tableData[field.cementing_temp.s4.y]}</span>
									<span>{tableData[field.cementing_temp.s4.r]}</span>
								</div>
							</div>
						</td>
						{/*Cemeting temp s5*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.cementing_temp.s5.g]}</span>
									<span>{tableData[field.cementing_temp.s5.y]}</span>
									<span>{tableData[field.cementing_temp.s5.r]}</span>
								</div>
							</div>
						</td>
						{/*Cemeting temp s6*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.cementing_temp.s6.g]}</span>
									<span>{tableData[field.cementing_temp.s6.y]}</span>
									<span>{tableData[field.cementing_temp.s6.r]}</span>
								</div>
							</div>
						</td>
						{/*Cemeting temp s7*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.cementing_temp.s7.g]}</span>
									<span>{tableData[field.cementing_temp.s7.y]}</span>
									<span>{tableData[field.cementing_temp.s7.r]}</span>
								</div>
							</div>
						</td>
						{/*Cemeting temp s8*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.cementing_temp.s8.g]}</span>
									<span>{tableData[field.cementing_temp.s8.y]}</span>
									<span>{tableData[field.cementing_temp.s8.r]}</span>
								</div>
							</div>
						</td>
						{/*Cemeting temp total*/}
						<td style={{textAlign: 'center', backgroundColor: '#082738'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.cementing_temp.total.g]}</span>
									<span>{tableData[field.cementing_temp.total.y]}</span>
									<span>{tableData[field.cementing_temp.total.r]}</span>
								</div>
							</div>
						</td>
					</tr>

					{/*Attach Sole With Upper*/}
					<tr>
						<td rowSpan={2} style={{textAlign: 'center', verticalAlign: 'middle'}}>Attach Sole With Upper</td>
						<td style={{textAlign: 'left', verticalAlign: 'middle'}}>
							<div className="d-flex flex-column justify-content-center">
								<span>Pressure</span>
							</div>
						</td>
						{/*Attach pressure s1*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.attach_pressure.s1.g]}</span>
									<span>{tableData[field.attach_pressure.s1.y]}</span>
									<span>{tableData[field.attach_pressure.s1.r]}</span>
								</div>
							</div>
						</td>
						{/*Attach pressure s2*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.attach_pressure.s2.g]}</span>
									<span>{tableData[field.attach_pressure.s2.y]}</span>
									<span>{tableData[field.attach_pressure.s2.r]}</span>
								</div>
							</div>
						</td>
						{/*Attach pressure s3*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.attach_pressure.s3.g]}</span>
									<span>{tableData[field.attach_pressure.s3.y]}</span>
									<span>{tableData[field.attach_pressure.s3.r]}</span>
								</div>
							</div>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						{/*Attach pressure total*/}
						<td style={{textAlign: 'center', backgroundColor: '#082738'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.attach_pressure.total.g]}</span>
									<span>{tableData[field.attach_pressure.total.y]}</span>
									<span>{tableData[field.attach_pressure.total.r]}</span>
								</div>
							</div>
						</td>
					</tr>
					<tr>
						<td style={{textAlign: 'left', verticalAlign: 'middle'}}>
							<div className="d-flex flex-column justify-content-center">
								<span>Timer</span>
							</div>
						</td>
						{/*Attach timer s1*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.attach_timer.s1.g]}</span>
									<span>{tableData[field.attach_timer.s1.y]}</span>
									<span>{tableData[field.attach_timer.s1.r]}</span>
								</div>
							</div>
						</td>
						{/*Attach timer s2*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.attach_timer.s2.g]}</span>
									<span>{tableData[field.attach_timer.s2.y]}</span>
									<span>{tableData[field.attach_timer.s2.r]}</span>
								</div>
							</div>
						</td>
						{/*Attach timer s3*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.attach_timer.s3.g]}</span>
									<span>{tableData[field.attach_timer.s3.y]}</span>
									<span>{tableData[field.attach_timer.s3.r]}</span>
								</div>
							</div>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						{/*Attach timer total*/}
						<td style={{textAlign: 'center', backgroundColor: '#082738'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.attach_timer.total.g]}</span>
									<span>{tableData[field.attach_timer.total.y]}</span>
									<span>{tableData[field.attach_timer.total.r]}</span>
								</div>
							</div>
						</td>
					</tr>

					{/*Chiller*/}
					<tr>
						<td style={{textAlign: 'center', verticalAlign: 'middle'}}>Chiller</td>
						<td style={{textAlign: 'left', verticalAlign: 'middle'}}>
							<div className="d-flex flex-column justify-content-center">
								<span>Temperature</span>
							</div>
						</td>
						{/*Chiller timer s1*/}
						<td style={{textAlign: 'center'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.chiller_temp.s1.g]}</span>
									<span>{tableData[field.chiller_temp.s1.y]}</span>
									<span>{tableData[field.chiller_temp.s1.r]}</span>
								</div>
							</div>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						{/*Chiller timer total*/}
						<td style={{textAlign: 'center', backgroundColor: '#082738'}}>
							<div className="d-flex flex-column justify-content-center">
								<div className="d-flex justify-content-around">
									<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
									<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
									<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
								</div>
								<div className="d-flex justify-content-around">
									<span>{tableData[field.chiller_temp.total.g]}</span>
									<span>{tableData[field.chiller_temp.total.y]}</span>
									<span>{tableData[field.chiller_temp.total.r]}</span>
								</div>
							</div>
						</td>
					</tr>
				</tbody>
			</Table>
		);
	}
}

export default MachineAlarmStatusTable;
