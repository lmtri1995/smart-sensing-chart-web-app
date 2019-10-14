import {Component}              from "react";
import React                    from "react";
import {FontAwesomeIcon}        from "@fortawesome/react-fontawesome";
import {faCircle, faSquareFull} from '@fortawesome/free-solid-svg-icons'
import MixedLineBarChart        from "../../../shared/components/chart/MixedLineBarChart";
import {drawChartItem}          from "./sharedFunction";

class Packing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			packingData: [],
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if (this.props.packingData != prevProps.packingData){
			let {packingData} = this.props;
			this.setState((state, props) => ({
				packingData: packingData,
			}));
		}
	}

	render(){
		let chartData = [{
			data: [50, 50],
			backgroundColor: ['#0CD0EB', '#005FCE']
		}];
		let {packingData} = this.state;
		let chart   = drawChartItem(packingData);
		return (
			<div className="d-flex" style={{height: '100%'}}>
				<div className="d-flex flex-column" style={{width:'60%', backgroundColor:'#002F49', height: 180, paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
					<span style={{color: '#FFFFFF', marginBottom: 15}}>Packing</span>
					{chart}
				</div>
				<div className="d-flex flex-column" style={{width:'40%', backgroundColor:'#082738', height:180, paddingTop: 25, paddingLeft: 10, paddingRight: 10}}>
					<div style={{color: '#FFFFFF', paddingTop: 10}}>
						<span style={{color:'#2880E9', fontSize: 8}}><FontAwesomeIcon icon={faSquareFull} /></span> Packing
					</div>
					<div style={{color: '#FFFFFF', paddingTop: 10}}>
						<span style={{color:'#005FCE', fontSize: 8}}><FontAwesomeIcon icon={faSquareFull} /></span> Target
					</div>
				</div>
			</div>
		);
	}
}

export default Packing;
