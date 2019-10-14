import {Component}                                              from "react";
import React                                                    from "react";
import MiniRightBar                                             from "./MiniRightBar";
import {countPrep, countCuring, drawChartItem, countQtyPercent} from "./sharedFunction";

class ComputerStiching extends Component {
	constructor(props) {
		super(props);
		this.state = {
			computerStichingData: [],
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if (this.props.computerStichingData != prevProps.computerStichingData){
			let {computerStichingData} = this.props;
			this.setState((state, props) => ({
				computerStichingData: computerStichingData,
			}));
		}
	}

	render(){
		let {computerStichingData} = this.state;
		console.log("computerStichingData: ", computerStichingData);
		let chart   = drawChartItem(computerStichingData);
		let prep    = countPrep(computerStichingData);
		let curing  = countCuring(computerStichingData);
		let qty     = countQtyPercent(computerStichingData);
		let cycle   = prep + curing;
		return (
			<div style={{width: '32%', height: 180, marginRight: 15, marginBottom: 15}}>
				<div className="d-flex">
					<div className="d-flex flex-column" style={{width:'60%', backgroundColor:'#002F49', height: 180, paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
						<span style={{color: '#FFFFFF', marginBottom: 15}}>Computer Stiching</span>
						{chart}
					</div>
					<MiniRightBar prep={prep} curing={curing} cycle={cycle} qty={qty}/>
				</div>
			</div>
		);

	}
}

export default ComputerStiching;
