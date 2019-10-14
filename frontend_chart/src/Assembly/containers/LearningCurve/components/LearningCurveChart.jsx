import React, {Component} from "react";
import {withRouter}       from "react-router-dom";
import MixedLineBarChart  from "../../../shared/components/chart/MixedLineBarChart";
import {chartOptions}     from '../constants';

class LearningCurveChart extends Component {
	constructor(props) {
		super(props);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		let {chartData} = this.props;
		this.drawChart(chartData);
	}

	drawChart = (chartData) => {
		/*0: (4) ["31", "01", "02", "05"]
		 1: [3480]
		 2: (4) [18, 18, 18, 18]*/
		let labels = [];
		if (chartData.length >= 2) {
			labels                = chartData[0];
			let standardDataArray = new Array(chartData[0].length).fill(chartData[1][0]);
			//let standardDataArray = new Array(chartData[0].length).fill(10);
			let barDataArray      = chartData[2];
			chartData             = [
				{
					label           : "Target",
					data            : standardDataArray,
					type            : 'line',
					borderColor     : "#0CD0EB",
					pointRadius     : 0,
					pointHoverRadius: 0,
					fill            : false,
					lineTension     : 0,
					borderWidth     : 1,
				},
				{
					label           : "Quantity",
					data            : barDataArray,
					backgroundColor : "#2D7AD3",
					fill            : false,
					lineTension     : 0,
					pointRadius     : 0,
					pointHoverRadius: 0,
				},
			];
		}
		let options = chartOptions;
		return <MixedLineBarChart chartOptions={options} data={chartData} labels={labels}/>;
	};

	render() {
		let {chartInitialData, chartOptions, chartData} = this.props;
		//return <MixedLineBarChart style={{height: 300}} chartInitialData={chartInitialData}
		// chartOptions={chartOptions} showLegend={true} />
		return this.drawChart(chartData);
	}
}

export default withRouter(LearningCurveChart);
