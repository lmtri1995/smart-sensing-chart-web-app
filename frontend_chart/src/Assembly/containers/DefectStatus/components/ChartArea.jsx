import React, {Component} from "react";
import {Col}              from "reactstrap";
import MixedLineBarChart  from "../../../shared/components/chart/MixedLineBarChart";

class ChartArea extends Component {
	constructor(props) {
		super(props);
	}

	drawChartItem = (chartData) => {
		let bgColor   = '';
		let chartType = 'bar';

		let defectDataArray = [];
		let chartLabels     = chartData[2] ? chartData[2] : ["7:30", "8:30", "9:30", "10:30", "11:30", "12:30", "13:30",
		                                                     "14:30", "15:30", "16:30", "17:30", "18:30", "19:30",
		                                                     "20:30", "21:30", "22:30"];
		let chartTypeArray  = chartData[1] ? chartData[1] : ["HO KEO (BONDING)", "LEM KEO (OVER-CEMENT)",
		                                                     "LEM NUOC XU LY (OVER-PRIMER)", "DO (DIRTY)",
		                                                     "NHAN (WRINKLE)", "LOI KHAC (ETC)"];
		defectDataArray[0]  = chartData[3] ? chartData[3] : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		defectDataArray[1]  = chartData[4] ? chartData[4] : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		defectDataArray[2]  = chartData[5] ? chartData[5] : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		defectDataArray[3]  = chartData[6] ? chartData[6] : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		defectDataArray[4]  = chartData[7] ? chartData[7] : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		defectDataArray[5]  = chartData[8] ? chartData[8] : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		/*chartLabels = ["7:30", "8:30", "9:30", "10:30"];
		 chartTypeArray = ["HO KEO (BONDING)", "LEM KEO (OVER-CEMENT)", "LEM NUOC XU LY(OVER-PRIMER)", "DO (DIRTY)"];
		 defectDataArray[0] = [1, 4, 2, 4];
		 defectDataArray[1] = [2, 3, 6, 8];
		 defectDataArray[2] = [4, 7, 2, 5];
		 defectDataArray[3] = [5, 1, 7, 9];
		 defectDataArray[4] = [2, 3, 5, 8];
		 defectDataArray[5] = [6, 8, 4, 7];*/
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
					backgroundColor : "#514EEC",
					fill            : true,
					lineTension     : 0,
					pointRadius     : 0,
					pointHoverRadius: 0,
				},
				{
					label           : chartTypeArray[1],
					data            : defectDataArray[1],
					backgroundColor : "#8C67F6",
					fill            : true,
					lineTension     : 0,
					pointRadius     : 0,
					pointHoverRadius: 0,
				},
				{
					label           : chartTypeArray[2],
					data            : defectDataArray[2],
					backgroundColor : "#62A4F0",
					fill            : true,
					lineTension     : 0,
					pointRadius     : 0,
					pointHoverRadius: 0,
				},
				{
					label           : chartTypeArray[3],
					data            : defectDataArray[3],
					backgroundColor : "#46D6EA",
					fill            : true,
					lineTension     : 0,
					pointRadius     : 0,
					pointHoverRadius: 0,
				},
				{
					label           : chartTypeArray[4],
					data            : defectDataArray[4],
					backgroundColor : "#C6FCFF",
					fill            : true,
					lineTension     : 0,
					pointRadius     : 0,
					pointHoverRadius: 0,
				},
				{
					label           : chartTypeArray[5],
					data            : defectDataArray[5],
					backgroundColor : "#FFFFFF",
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
