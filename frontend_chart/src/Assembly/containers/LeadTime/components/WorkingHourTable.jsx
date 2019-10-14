import React, {Component} from "react";
import Chart              from 'chart.js';
import 'chartjs-plugin-zoom';


let initialData = {
	labels  : ["Computer Stiching", "Normal Stiching", "Backpack Molding", "Toe Molding", "Strobel",
	           "Lasting", "Heel Lasting", "Heat Chamber", "Negative Gage", "Cementing",
	           "Attach Sole With Upper", "Chiller", "Delasting", "Metal Detect", "QIP Defect",
	           "Packing"
	],
	datasets: [{
		data           : [0, 0, 0, 0, 0,
		                  0, 0, 0, 0, 0,
		                  0, 0, 0, 0, 0,
		                  0
		],
		backgroundColor: "#2880E9",
	}],
};
const options   = {
	responsive: false,
	legend    : {
		display: false,
	},
	scales    : {
		xAxes: [{
			ticks: {
				fontColor: '#696F76',
			}
		}],
		yAxes: [{
			barPercentage: 0.3,
			ticks        : {
				beginAtZero: true,
				fontColor  : '#FFFFFF',
			},
		}]
	}
};

class WorkingHourTable extends Component {
	constructor(props) {
		super(props);
		this.canvas = null;
	}

	componentDidMount() {
		const ctx    = this.canvas.getContext('2d');
		this.myChart = new Chart(ctx, {
			type: 'horizontalBar',
			data: initialData, options: options,
		});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props !== prevProps) {
			let {workingHourData, workingHourLabel} = this.props;
			this.myChart.data                       = {
				labels  : workingHourLabel,
				datasets: workingHourData
			};
			this.myChart.update();
		}
	}

	render() {
		return (
			<div style={{minHeight: 720}}>
				<div className="mt-3 ml-2"><span style={{color: '#fff', marginTop: 15}}>LEAD TIME/PAIR</span></div>
				<canvas width={750} height={720} ref={(element) => this.canvas = element}/>
			</div>

		);
	}
}

export default WorkingHourTable;
