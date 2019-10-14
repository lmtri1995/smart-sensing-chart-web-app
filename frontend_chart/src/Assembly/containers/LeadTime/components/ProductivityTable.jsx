import React, {Component} from "react";
import {Col, Progress}    from "reactstrap";

class ProductivityTable extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let {ccrProcess} = this.props;
		//min_process_crr: '', prod_qty_day: 0, prod_time_pair: 0,
		// 							line_balancing_stitch: 0, line_balancing_shoe_make: 0, line_balancing_all: 0
		return (
			<div className="d-flex flex-row text-white" style={{marginLeft: -40, minHeight: 200}}>
				<div style={{marginLeft: 40, width: '40%'}}>
					<Col md={12} lg={12} style={{marginTop: 15}}><span>PRODUCTIVITY</span></Col>
					<Col className="d-flex mt-1">
						<Col md={6} lg={6} className="d-flex flex-column" style={{marginLeft: 20,}}>
							<div md={12} lg={12} className="bold-text h3">{ccrProcess.productivityPairPerDay}</div>
							<div md={12} lg={12}>pairs/day</div>
						</Col>
						<Col md={6} lg={6} className="d-flex flex-column">
							<div md={12} lg={12} className="bold-text h3">{ccrProcess.productivityMinPerPair.toFixed(2)}</div>
							<div md={12} lg={12}>mins/pair</div>
						</Col>
					</Col>
					<hr/>
					<div>
						<Col md={12} lg={12}><span>CCR PROCESS</span></Col>
						<Col md={12} lg={12} className="d-flex mt-1"><span
							style={{color: '#FF9356'}}>{ccrProcess.min_process_crr}</span></Col>
					</div>
				</div>
				<div style={{marginTop: 30, width: "60%"}}>
					<div>
						<div
							className="progress-wrap progress-wrap--small progress-wrap--alarm-green progress-wrap--label-top">
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
					</div>
					<div style={{paddingTop: 30}}>
						<div
							className="progress-wrap progress-wrap--small progress-wrap--alarm-green progress-wrap--label-top">
							<div className="d-flex">
								<Col md={7} lg={7} style={{marginLeft: -15}}>
									STITCHING
								</Col>
								<Col md={3} lg={3}>
								</Col>
								<Col md={2} lg={2} style={{marginLeft: 20}}>
									{parseFloat(ccrProcess.line_balancing_stitch).toFixed(2)}%
								</Col>
							</div>
							<Progress value={parseFloat(ccrProcess.line_balancing_stitch)}>
							</Progress>
						</div>
					</div>
					<div style={{paddingTop: 30}}>
						<div
							className="progress-wrap progress-wrap--small progress-wrap--alarm-green progress-wrap--label-top"
							style={{selfAlign: 'flex-end'}}>
							<div className="d-flex">
								<Col md={7} lg={7} style={{marginLeft: -15}}>
									ASC
								</Col>
								<Col md={3} lg={3}>
								</Col>
								<Col md={2} lg={2} style={{marginLeft: 20}}>
									{parseFloat(ccrProcess.line_balancing_shoe_make).toFixed(2)}%
								</Col>
							</div>
							<Progress value={parseFloat(ccrProcess.line_balancing_shoe_make)}>
							</Progress>
						</div>
					</div>
				</div>

			</div>
		);
	}
}

export default ProductivityTable;
