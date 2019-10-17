import {Col}             from "reactstrap";
import MixedLineBarChart from "../../../shared/components/chart/MixedLineBarChart";
import React             from "react";

export const countPrep = (data) => {
	let result = 0;
	if (data[2] && data[2].length > 0) {
		result = data[2].reduce((accumulator, currentValue) => (accumulator + currentValue), 0);
	}
	return result;
}

export const drawChartItem = (dataItem) => {
	//[["08:38"],[300,421],[1569],[1089],[2658],[10],["Packpart Molding"]]
	if (dataItem.length > 0){
		let chartLabels = dataItem[0];
		let chartData1 =  dataItem[2];
		let chartData2 =  dataItem[3];

		let standardData1 = Array(chartData1.length);
		if (dataItem[1] && dataItem[1][0]){
			standardData1.fill(dataItem[1][0]);
		} else {
			standardData1.fill(0);
		}

		let standardData2 =  Array(chartData1.length);
		if (dataItem[1] && dataItem[1][1]){
			standardData2.fill(dataItem[1][1]);
		} else {
			standardData2.fill(0);
		}

		let chartOptions = {
			legend: {
				display : false,
				position: 'left',
				labels: {
					boxWidth: 60,
					fontSize: 20,
					fontColor: '#BEBEBE'
				}
			},
			scales: {
				xAxes: [
					{
						stacked: true,
						ticks: {
							fontColor: '#BEBEBE',
							max: 4
						},
					},
				],
				yAxes: [
					{
						stacked: true,
						gridLines: {
							color        : '#696F76',
							display      : true,
							drawBorder   : false,
							zeroLineColor: '#696F76',
						},
						ticks    : {
							beginAtZero: true,
							fontColor  : '#868D93',
							max: 100
						},
					},
				],
			},
		};

		let initialData = {
			labels  : chartLabels,
			datasets: [
				{
					label          : "Line Standard 1",
					data           : standardData1,
					type           : 'line',
					borderColor: "#0CD0EB",
					pointRadius: 0,
					pointHoverRadius: 0,
					fill: false,
					lineTension: 0,
					borderWidth: 1,
				},
				{
					label          : "Line Standard 2",
					data           : standardData2,
					type           : 'line',
					borderColor: "#0CD0EB",
					pointRadius: 0,
					pointHoverRadius: 0,
					fill: false,
					lineTension: 0,
					borderWidth: 1,
				},
				{
					label          : "preparing Time dataset",
					data           : chartData1,
					backgroundColor: "#2880E9",
					fill: true,
					lineTension: 0,
					pointRadius: 0,
					pointHoverRadius: 0,
				},
				{
					label          : "Curing Time dataset",
					data           : chartData2,
					backgroundColor: "#005FCE",
					fill: true,
					lineTension: 0,
					pointRadius: 0,
					pointHoverRadius: 0,
				}
			]
		};

		return <Col md={2.5} lg={2.5} style={{marginRight: 10, marginBottom: 10, borderRadius: 5}}>
			<MixedLineBarChart chartOptions={chartOptions} chartInitialData={initialData} labels={chartLabels}/>
		</Col>
	} else {
		return <MixedLineBarChart />
	}
}

export const countCuring = (data) => {
	let result = 0;
	if (data[3] && data[3].length > 0) {
		result = data[3].reduce((accumulator, currentValue) => (accumulator + currentValue), 0);
	}
	return result;
}

export const countQtyPercent = (data) => {
	let result = 0;
	if (data[5] && data[5].length > 0) {
		result = parseFloat(data[5]);
	}
	return result;
}

export const handleLeftPanel = (backPackMoldingData) => {
	let tempGreen = 0,
	    tempYellow = 0,
	    tempRed = 0,
	    presGreen = 0,
	    presYellow = 0,
	    presRed = 0,
	    timerGreen = 0,
	    timerYellow = 0,
	    timerRed = 0;
	backPackMoldingData.forEach(item => {
		if (item.sensor_type.toUpperCase() === "Curing Time".toUpperCase()){
			timerGreen  = item.sensor_no_green;
			timerYellow = item.sensor_no_yellow;
			timerRed    = item.sensor_no_red;
		} else if (item.sensor_type.toUpperCase() === "Temperature".toUpperCase()){
			tempGreen   = item.sensor_no_green;
			tempYellow  = item.sensor_no_yellow;
			tempRed     = item.sensor_no_red;
		} else if (item.sensor_type.toUpperCase() === "Pressure".toUpperCase()){
			presGreen   = item.sensor_no_green;
			presYellow  = item.sensor_no_yellow;
			presRed     = item.sensor_no_red;
		}
	});
	let tempPresTimeItem = {
		tempGreen: tempGreen,
		tempYellow: tempYellow,
		tempRed: tempRed,
		presGreen: presGreen,
		presYellow: presYellow,
		presRed: presRed,
		timerGreen: timerGreen,
		timerYellow: timerYellow,
		timerRed: timerRed
	}
	return tempPresTimeItem;
}


//Apply for backpack Molding, Toe Molding, Heat Chamber, Cementing, Attach Sole With Upper, Chiller
export const handleRightPanel = (data) => {
	let qty = 0, cycle = 0, prep = 0, curing = 0;
	try {
		let actual  = data[0].actual_pair_qty;
		let target  = data[0].kpi_target_qty_day?data[0].kpi_target_qty_day:1;
		qty         = actual/target;
		if (isNaN(qty)){
			qty = 0;
		}
		prep       = data[0].preparing_time;
		curing       = data[0].curing_time;
		cycle       = prep + curing;
	} catch (e){
		console.log("e: ", e);
	}
	return {
		qty: qty,
		cycle: cycle,
		prep: prep,
		curing: curing
	}
}



