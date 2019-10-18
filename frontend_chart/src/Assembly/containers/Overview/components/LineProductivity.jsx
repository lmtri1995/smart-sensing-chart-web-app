import {Component}       from "react";
import React             from "react";
import {Col, Container, Progress, Row} from 'reactstrap';

class LineProductivity extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lineProductivityData: [],
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if (this.props.lineProductivityData != prevProps.lineProductivityData){
			let {lineProductivityData} = this.props;
			this.setState((state, props) => ({
				lineProductivityData: lineProductivityData,
			}));
		}
	}

	handleLineProductivityData = (lineProductivityData) => {
		let lineBalancingAll = 0, minProcessCrr = '', prodQtyDay = 0, pairQty = 0, pph = 0, rft = 0, eff = 0;
		if (lineProductivityData.length > 0){
			let data = lineProductivityData[0];
			lineBalancingAll = data.line_balancing_all?data.line_balancing_all:0;
			minProcessCrr = data.min_process_crr?data.min_process_crr:'';
			prodQtyDay = data.prod_qty_day?data.prod_qty_day:0;
			pairQty = data.prod_time_pair?data.prod_time_pair:0;
			pph = data.pph_day_ratio?data.pph_day_ratio:0;
			rft = data.rft_day_ratio?data.rft_day_ratio:0;
			eff = data.eff_day_ratio?data.eff_day_ratio:0;
		}
		return {
			lineBalancingAll: lineBalancingAll,
			minProcessCrr: minProcessCrr,
			prodQtyDay: prodQtyDay,
			pairQty: pairQty,
			pph: pph,
			rft: rft,
			eff: eff
		}
	}

	render(){
		let {ccrProcess} = this.props;
		//let lineItem = this.handleLineProductivityData(lineProductivityData);
		return (
			<div style={{height: '100%', paddingLeft: 15, paddingRight: 15, backgroundColor: '#232529'}}>
				<div className="d-flex flex-wrap">
					<Col md={12} lg={12} style={{marginTop: 30, marginLeft: 70, color: '#FFFFFF', fontSize: 18}}><span>LINE PRODUCTIVITY</span></Col>
					<div className="d-flex mt-5" style={{width: '100%', justifyContent: 'space-around'}}>
						<div className="d-flex flex-column text-white">
							<div md={12} lg={12} className="bold-text h3">{ccrProcess.productivityPairPerDay}</div>
							<div md={12} lg={12}>pairs/day</div>
						</div>
						<div className="d-flex flex-column  text-white">
							<div md={12} lg={12} className="bold-text h3">{ccrProcess.productivityMinPerPair.toFixed(2)}</div>
							<div md={12} lg={12}>mins/pair</div>
						</div>
					</div>
					<div className="d-flex text-white" style={{marginTop: 30, width: '100%', justifyContent: 'space-around'}}>
						<div className="bold-text">CCR Process</div>
						<div style={{color: '#FF9356'}}>{ccrProcess.min_process_crr}</div>
					</div>
				</div>
				<div className="progress-wrap progress-wrap--small progress-wrap--alarm-green progress-wrap--label-top mt-5">
					<div className="d-flex">
						<Col md={7} lg={7} style={{marginLeft: -15}}>
							LINE BALANCING
						</Col>
						<Col md={3} lg={3}>
						</Col>
						<Col md={2} lg={2} style={{marginLeft: 20}}>
							{parseFloat(ccrProcess.line_balancing_all).toFixed(2)}%
						</Col>
					</div>
					<Progress value={parseFloat(ccrProcess.line_balancing_all)}>
					</Progress>
				</div>
				<div className="progress-wrap progress-wrap--small progress-wrap--alarm-green progress-wrap--label-top  mt-5">
					<div className="d-flex">
						<Col md={7} lg={7} style={{marginLeft: -15}}>
							PPH
						</Col>
						<Col md={3} lg={3}>
						</Col>
						<Col md={2} lg={2} style={{marginLeft: 20}}>
							{0}%
						</Col>
					</div>
					<Progress value={0}>
					</Progress>
				</div>
				<div className="progress-wrap progress-wrap--small progress-wrap--alarm-green progress-wrap--label-top  mt-3">
					<div className="d-flex">
						<Col md={7} lg={7} style={{marginLeft: -15}}>
							RFT
						</Col>
						<Col md={3} lg={3}>
						</Col>
						<Col md={2} lg={2} style={{marginLeft: 20}}>
							{0}%
						</Col>
					</div>
					<Progress value={0}>
					</Progress>
				</div>
				<div className="progress-wrap progress-wrap--small progress-wrap--alarm-green progress-wrap--label-top  mt-3">
					<div className="d-flex">
						<Col md={7} lg={7} style={{marginLeft: -15}}>
							EFF
						</Col>
						<Col md={3} lg={3}>
						</Col>
						<Col md={2} lg={2} style={{marginLeft: 20}}>
							{0}%
						</Col>
					</div>
					<Progress value={0}>
					</Progress>
				</div>
			</div>
		);

	}
}

export default LineProductivity;
