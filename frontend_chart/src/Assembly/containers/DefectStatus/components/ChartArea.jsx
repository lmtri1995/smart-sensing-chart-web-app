import React, {Component} from "react";
import {Col}              from "reactstrap";
import MixedLineBarChart  from "../../../shared/components/chart/MixedLineBarChart";
import {ERROR_LABELS, COLOR_ARRAY}     from "../constants";

class ChartArea extends Component {
	constructor(props) {
		super(props);
	}

	handleChartData = (chartData) => {
		let defectDataArray = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		                       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		                       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		                       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		                       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		                       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
		if (chartData && chartData.length > 0){
			let typeArray = chartData[0];
			for (let i = 0; i < typeArray.length; i++){
				let type = typeArray[i];
				if (type == "1"){
					defectDataArray[0] = chartData[i + 3];
				} else if (type == "2"){
					defectDataArray[1] = chartData[i + 3];
				} else if (type == "3"){
					defectDataArray[2] = chartData[i + 3];
				} else if (type == "4"){
					defectDataArray[3] = chartData[i + 3];
				} else if (type == "5"){
					defectDataArray[4] = chartData[i + 3];
				} else if (type == "6"){
					defectDataArray[5] = chartData[i + 3];
				}
			}
		}
		return defectDataArray;
	}

	drawChartItem = (chartData) => {
		let defectDataArray = this.handleChartData(chartData);
		let bgColor   = '';
		let chartType = 'bar';

		let chartLabels     = ["7:30", "8:30", "9:30", "10:30", "11:30", "12:30", "13:30",
                             "14:30", "15:30", "16:30", "17:30", "18:30", "19:30",
                             "20:30", "21:30", "22:30"];
		let chartTypeArray  = ERROR_LABELS;
		let chartOptions = {
			legend: {
				display : true,
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
							color        : '#535353',
							display      : true,
							drawBorder   : false,
							zeroLineColor: '#535353',
						},
						ticks    : {
							beginAtZero: true,
							fontColor  : '#868D93',
						},
					},
				],
			},
		};

		let initialData = {
			labels  : chartLabels,
			datasets: [
				{
					label           : chartTypeArray[0],
					data            : defectDataArray[0],
					backgroundColor : COLOR_ARRAY[0],
					fill            : true,
					lineTension     : 0,
					pointRadius     : 0,
					pointHoverRadius: 0,
				},
				{
					label           : chartTypeArray[1],
					data            : defectDataArray[1],
					backgroundColor : COLOR_ARRAY[1],
					fill            : true,
					lineTension     : 0,
					pointRadius     : 0,
					pointHoverRadius: 0,
				},
				{
					label           : chartTypeArray[2],
					data            : defectDataArray[2],
					backgroundColor : COLOR_ARRAY[2],
					fill            : true,
					lineTension     : 0,
					pointRadius     : 0,
					pointHoverRadius: 0,
				},
				{
					label           : chartTypeArray[3],
					data            : defectDataArray[3],
					backgroundColor : COLOR_ARRAY[3],
					fill            : true,
					lineTension     : 0,
					pointRadius     : 0,
					pointHoverRadius: 0,
				},
				{
					label           : chartTypeArray[4],
					data            : defectDataArray[4],
					backgroundColor : COLOR_ARRAY[4],
					fill            : true,
					lineTension     : 0,
					pointRadius     : 0,
					pointHoverRadius: 0,
				},
				{
					label           : chartTypeArray[5],
					data            : defectDataArray[5],
					backgroundColor : COLOR_ARRAY[5],
					fill            : true,
					lineTension     : 0,
					pointRadius     : 0,
					pointHoverRadius: 0,
				}
			]
		};

		let labels   = initialData.chartLabels;
		let datasets = initialData.datasets;

		return <Col style={{backgroundColor: bgColor, marginRight: 10, marginBottom: 10, borderRadius: 5}}>
			<MixedLineBarChart style={{width: 1000, height: 200}} labels={labels} data={datasets}
			                   chartOptions={chartOptions} chartInitialData={initialData} labels={chartLabels}
			                   type={chartType} showLegend={true}/>
		</Col>;
	};

	fillChartContent = (chartData) => {
		let chartArray = [];
		/*for (let i = 0; i < chartData.length; i++){
		 let dataItem = chartData[i][`graph_${i+1}`];
		 if (dataItem.length > 0){
		 chartArray[i] = this.drawChartItem(dataItem);
		 }

		 }*/
		chartArray = this.drawChartItem(chartData);
		return <div className="d-flex flex-wrap">
			{chartArray}
		</div>;
	};

	render() {
		let {chartData}  = this.props;
		let chartContent = this.fillChartContent(chartData);
		return chartContent;
	}
}

export default ChartArea;
