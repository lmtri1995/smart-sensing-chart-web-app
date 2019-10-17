import {Component}       from "react";
import React             from "react";
import DoughnutChart from "../../../shared/components/chart/DoughnutChart";
import MiniRightBar      from "./MiniRightBar";
import MiniLeftBar       from "./MiniLeftBar";
import {FontAwesomeIcon}        from "@fortawesome/react-fontawesome";
import {faSquareFull} from '@fortawesome/free-solid-svg-icons'

class MetalDetect extends Component {
	constructor(props) {
		super(props);
	}

	render(){
		let chartData = [{
			data: [0, 0],
			backgroundColor: ['#0CD0EB', '#005FCE']
		}];
		let {metalDetectData} = this.props;
		let detectQty = 0, passQty = 0, total = 0;
		try {
			detectQty = metalDetectData.detect_qty;
			passQty = metalDetectData.pass_qty;
			total = detectQty + passQty;
			chartData = [{
				data           : [detectQty, passQty],
				backgroundColor: ['#0CD0EB', '#005FCE']
			}];
		} catch (e){

		}

		return (
			<div style={{width: '32%', height: 180, marginRight: 15, marginBottom: 15}}>
				<div className="d-flex">
					<div className="d-flex" style={{paddingTop: -600, width:'60%', backgroundColor:'#002F49', height: 180, paddingLeft: 10, paddingRight: 10}}>
						<div className="d-flex flex-column" style={{flex: '0 0 70%', paddingTop: 10}}>
							<span style={{color: '#FFFFFF'}}>Metal Detect</span>
							<div style={{height: 22}}></div>
							<DoughnutChart labels={['Defect']} data={chartData}
							               centerText={total.toString()}
							               showLegend={false}
							/>
						</div>
						<div className="d-flex" style={{flex: '0 0 30%'}}>
							<div className="d-flex flex-column" style={{marginTop: 52}}>
								<div>
									<span style={{color: '#0CD0EB', fontSize: 8}}><FontAwesomeIcon icon={faSquareFull} /></span>
									<span style={{color: '#BEBEBE'}}> Detect</span>
								</div>
								<span style={{color: '#FFFFFF', paddingLeft: 30}}>{detectQty}</span>
							</div>
						</div>
					</div>
					<div style={{width:'40%', backgroundColor:'#082738', height:180, paddingTop: 25, paddingLeft: 10, paddingRight: 10}}>
					</div>
				</div>
			</div>
		);
	}
}

export default MetalDetect;
