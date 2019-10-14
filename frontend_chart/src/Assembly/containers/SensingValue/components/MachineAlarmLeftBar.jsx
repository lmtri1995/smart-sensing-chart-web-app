import React, {Component} from "react";
import {Col}              from "reactstrap";

class MachineAlarmLeftBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedProcess: {}
		};
	}

	handleProcessClick = (processData) => {
		this.setState((state, props) => ({
			selectedProcess: processData
		}));
		this.props.getChartData(processData);
	};

	fillProcessContent = (processData) => {
		/*
		 0:
		 process_cd: "20105"
		 process_nm: "Packpart Molding"
		 sensor_no_gray: 6
		 sensor_no_red: 12
		 sensor_no_yellow: 3
		 */
		let divArray = [];
		try {
			let selectedProcess = this.state.selectedProcess;
			if (Object.keys(selectedProcess).length === 0) {//check if object is empty
				selectedProcess = processData[0];
			}

			for (let i = 0; i < processData.length; i++) {
				let dataItem = processData[i];
				let bgColor  = '#1E2229';
				if (selectedProcess.process_cd == dataItem.process_cd) {
					bgColor = '#1D2F56';
				}
				divArray[i] = <div className="d-flex flex-column mt-1" key={dataItem.process_cd}
				                   onClick={this.handleProcessClick.bind(this, dataItem)}>
					<div className="d-flex flex-column justify-content-center"
					     style={{backgroundColor: bgColor, paddingTop: 30, paddingBottom: 30}}>
						<div className="d-flex justify-content-around" style={{color: '#BEBEBE'}}>
							{dataItem.process_nm.toUpperCase()}
						</div>
						{/*<div className="d-flex justify-content-around" style={{paddingLeft: 60, paddingRight: 60}}>
							<span style={{color: '#BEBEBE', fontSize: 'large'}}>●</span>
							<span style={{color: '#FFD44F', fontSize: 'large'}}>●</span>
							<span style={{color: '#F84E4E', fontSize: 'large'}}>●</span>
						</div>
						<div className="d-flex justify-content-around" style={{paddingLeft: 60, paddingRight: 60}}>
							<span style={{color: '#BEBEBE'}}>{dataItem.sensor_no_gray}</span>
							<span style={{color: '#FFD44F'}}>{dataItem.sensor_no_yellow}</span>
							<span style={{color: '#F84E4E'}}>{dataItem.sensor_no_red}</span>
						</div>*/}
					</div>
				</div>;
			}
		} catch (e) {
			console.log("Error: ", e);
		}
		return divArray;
	};

	render() {
		let {processData} = this.props;
		return <Col md={2} lg={2}>
			{
				this.fillProcessContent(processData)
			}
		</Col>;
	}
}

export default MachineAlarmLeftBar;

