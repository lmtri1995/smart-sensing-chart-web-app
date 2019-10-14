import React, {Component} from "react";
import {Col}              from "reactstrap";
import MixedLineBarChart  from "../../../shared/components/chart/MixedLineBarChart";

class ChartArea extends Component {
	constructor(props) {
		super(props);
	}

	handleChartItem = (dataItem) => {
		let labels = ["07:30", "08:30", "09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30", "17:30", "18:30", "19:30", "20:30", "21:30", "22:30"];
		let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		let chartLabels = dataItem[0];
		let chartData   = dataItem[2];
		for (let i = 0; i < labels.length; i++){
			for (let j = 0; j < chartLabels.length; j++){
				if (labels[i] === chartLabels[j]){
					data[i] = chartData[j];
				}
			}
		}
		return {
			data: data,
			labels: labels
		}
	}

	drawChartItem = (dataItem, type = "temp", index = 1) => {
		let result    = null;
		let bgColor   = '';
		let chartType = 'line';

		switch (type) {
			case 'pressure':
				bgColor   = '#260A64';
				chartType = 'line';
				break;
			case 'curing':
				bgColor   = '#001E6B';
				chartType = 'bar';
				break;
			default:
				bgColor   = '#4E0033';
				chartType = 'line';
				break;
		}

		if (type == 'temp') {
			let chartItem = this.handleChartItem(dataItem);
			let chartLabels = chartItem.labels;
			let chartData   = chartItem.data;

			let chartLength = chartData?chartData.length:0;
			let standardData1 = Array(chartLength);
			if (dataItem[1] && dataItem[1][0]) {
				standardData1.fill(dataItem[1][0]);
				//standardData1.fill(300);
			} else {
				standardData1.fill(0);
			}

			let standardData2 = Array(chartLength);
			if (dataItem[1] && dataItem[1][1]) {
				standardData2.fill(dataItem[1][1]);
				//standardData2.fill(500);
			} else {
				standardData2.fill(0);
			}

			let data = [
				{
					label           : "Line Standard 1",
					data            : standardData1,
					type            : 'line',
					borderColor     : "#0CD0EB",
					pointRadius     : 0,
					pointHoverRadius: 0,
					fill            : false,
					lineTension     : 0,
					borderWidth     : 1,
				},
				{
					label           : "Line Standard 2",
					data            : standardData2,
					type            : 'line',
					borderColor     : "#0CD0EB",
					pointRadius     : 0,
					pointHoverRadius: 0,
					fill            : false,
					lineTension     : 0,
					borderWidth     : 1,
				},
				{
					label           : "Bar dataset",
					data            : chartData,
					borderColor     : "#FF71CF",
					fill            : false,
					lineTension     : 0,
					pointRadius     : 3,
					pointHoverRadius: 0,
				},
			];
			let initialData = {
				labels  : chartLabels,
				datasets: data,
			};

			result = <Col md={2.5} lg={2.5}
			              style={{backgroundColor: bgColor, marginRight: 10, marginBottom: 10, borderRadius: 5}}>
				<div style={{display:'flex', justifyContent: 'center'}}>
					<span style={{color: '#FFFFFF'}}>Temp {index}</span>
				</div>
				<MixedLineBarChart chartInitialData={initialData}  data={data} labels={chartLabels} type={chartType}/>
			</Col>;
		} else if (type == 'pressure') {
			let chartLabels = dataItem[0];
			let chartData   = dataItem[2];

			let chartLength = chartData?chartData.length:0;
			let standardData1 = Array(chartLength);
			if (dataItem[1] && dataItem[1][0]) {
				standardData1.fill(dataItem[1][0]);
				//standardData1.fill(300);
			} else {
				standardData1.fill(0);
			}

			let standardData2 = Array(chartLength);
			if (dataItem[1] && dataItem[1][1]) {
				standardData2.fill(dataItem[1][1]);
				//standardData2.fill(500);
			} else {
				standardData2.fill(0);
			}

			let data = [
				{
					label           : "Line Standard 1",
					data            : standardData1,
					type            : 'line',
					borderColor     : "#0CD0EB",
					pointRadius     : 0,
					pointHoverRadius: 0,
					fill            : false,
					lineTension     : 0,
					borderWidth     : 1,
				},
				{
					label           : "Line Standard 2",
					data            : standardData2,
					type            : 'line',
					borderColor     : "#0CD0EB",
					pointRadius     : 0,
					pointHoverRadius: 0,
					fill            : false,
					lineTension     : 0,
					borderWidth     : 1,
				},
				{
					label           : "Bar dataset",
					data            : chartData,
					borderColor     : "#8C67F6",
					fill            : false,
					lineTension     : 0,
					pointRadius     : 3,
					pointHoverRadius: 0,
				},
			];
			let initialData = {
				labels  : chartLabels,
				datasets: data
			};

			result = <Col md={2.5} lg={2.5}
			              style={{backgroundColor: bgColor, marginRight: 10, marginBottom: 10, borderRadius: 5}}>
				<div style={{display:'flex', justifyContent: 'center'}}>
					<span style={{color: '#FFFFFF'}}>Press {index}</span>
				</div>
				<MixedLineBarChart chartInitialData={initialData} data={data} labels={chartLabels} type={chartType}/>
			</Col>;
		} else if (type == 'curing') {
			let chartLabels = dataItem[0];
			let chartData1   = dataItem[2];
			let chartData2   = dataItem[3];

			let chartLength = chartData1?chartData1.length:0;
			let standardData1 = Array(chartLength);
			if (dataItem[1] && dataItem[1][0]) {
				standardData1.fill(dataItem[1][0]);
				//standardData1.fill(300);
			} else {
				standardData1.fill(0);
			}

			let standardData2 = Array(chartLength);
			if (dataItem[1] && dataItem[1][1]) {
				standardData2.fill(dataItem[1][1]);
				//standardData2.fill(500);
			} else {
				standardData2.fill(0);
			}

			let chartOptions = {
				legend: {
					display : false,
					position: 'left',
					labels  : {
						boxWidth : 60,
						fontSize : 20,
						fontColor: '#BEBEBE'
					}
				},
				scales: {
					xAxes: [
						{
							stacked: true,
							ticks  : {
								fontColor: '#BEBEBE',
							},
						},
					],
					yAxes: [
						{
							stacked  : true,
							gridLines: {
								color        : '#696F76',
								display      : true,
								drawBorder   : false,
								zeroLineColor: '#696F76',
							},
							ticks    : {
								beginAtZero: true,
								fontColor  : '#868D93',
							},
						},
					],
				},
			};

			let data = [
				{
					label           : "Line Standard 1",
					data            : standardData1,
					type            : 'line',
					borderColor     : "#0CD0EB",
					pointRadius     : 0,
					pointHoverRadius: 0,
					fill            : false,
					lineTension     : 0,
					borderWidth     : 1,
				},
				{
					label           : "Line Standard 2",
					data            : standardData2,
					type            : 'line',
					borderColor     : "#0CD0EB",
					pointRadius     : 0,
					pointHoverRadius: 0,
					fill            : false,
					lineTension     : 0,
					borderWidth     : 1,
				},
				{
					label           : "preparing Time dataset",
					data            : chartData1,
					backgroundColor : "#2880E9",
					fill            : true,
					lineTension     : 0,
					pointRadius     : 0,
					pointHoverRadius: 0,
				},
				{
					label           : "Curing Time dataset",
					data            : chartData2,
					backgroundColor : "#005FCE",
					fill            : true,
					lineTension     : 0,
					pointRadius     : 0,
					pointHoverRadius: 0,
				}
			];
			let initialData = {
				labels  : chartLabels,
				datasets: data,
			};

			result = <Col md={2.5} lg={2.5}
			              style={{backgroundColor: bgColor, marginRight: 10, marginBottom: 10, borderRadius: 5}}>
				<div style={{display:'flex', justifyContent: 'center'}}>
					<span style={{color: '#FFFFFF'}}>Timer {index}</span>
				</div>
				<MixedLineBarChart chartOptions={chartOptions} chartInitialData={initialData}  data={data} labels={chartLabels}
				                   type={chartType}/>
			</Col>;
		}
		return result;
	};

	fillChartContent = (chartData, type) => {
		/*
		 (8) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
		 0:
		 graph_1: Array(3)
		 0: (12) ["07:30", "08:30", "09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "17:30", "18:30", "19:30"]
		 1: (12) [162, 332, 502, 673, 845, 14, 185, 356, 523, 846, 14, 25]
		 2: (2) [3, 5]
		 length: 3
		 __proto__: Array(0)
		 __proto__: Object
		 1: {graph_2: Array(3)}
		 */
		let chartArray = new Array();
		for (let i = 0; i < chartData.length; i++) {
			if (chartData[i] && chartData[i]['graph']){
				let dataItem = chartData[i]['graph'];
				if (dataItem) {
					chartArray[i] = this.drawChartItem(dataItem, type, i + 1);
				}
			} else {
				let dataItem = [["7:30", "8:30", "9:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30", "17:30", "18:30", "19:30", "20:30", "21:30", "22:30"],
								[0, 0],
								[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
				if (type.toString() === "curing"){
					dataItem = [["7:30", "8:30", "9:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30", "17:30", "18:30", "19:30", "20:30", "21:30", "22:30"],
					            [0, 0],
					            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
				}
				chartArray[i] = this.drawChartItem(dataItem, type, i + 1);
			}
		}
		return <div className="d-flex flex-wrap">
			{chartArray}
		</div>;
	};

	render() {
		let {chartData, type} = this.props;
		let chartContent      = this.fillChartContent(chartData, type);
		return chartContent;
	}
}

export default ChartArea;
