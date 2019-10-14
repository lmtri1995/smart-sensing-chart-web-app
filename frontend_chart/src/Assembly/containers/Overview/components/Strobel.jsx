import {Component}                                              from "react";
import React                                                    from "react";
import MixedLineBarChart                                        from "../../../shared/components/chart/MixedLineBarChart";
import MiniRightBar                                             from "./MiniRightBar";
import {Col}                                                    from "reactstrap";
import {countPrep, countCuring, drawChartItem, countQtyPercent} from "./sharedFunction";

class Strobel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			strobelData: [],
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if (this.props.strobelData != prevProps.strobelData){
			let {strobelData} = this.props;
			this.setState((state, props) => ({
				strobelData: strobelData,
			}));
		}
	}

	render(){
		let {strobelData} = this.state;
		let chart   = drawChartItem(strobelData);
		let prep    = countPrep(strobelData);
		let curing  = countCuring(strobelData);
		let cycle   = prep + curing;
		let qty     = countQtyPercent(strobelData);
		return (
			<div style={{width: '32%', height: 180, marginBottom: 15}}>
				<div className="d-flex">
					<div className="d-flex flex-column" style={{width:'60%', backgroundColor:'#002F49', height: 180, paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
						<span style={{color: '#FFFFFF', marginBottom: 15}}>Strobel</span>
						{chart}
					</div>
					<MiniRightBar prep={prep} curing={curing} cycle={cycle} qty={qty}/>
				</div>
			</div>
		);

	}
}

export default Strobel;
