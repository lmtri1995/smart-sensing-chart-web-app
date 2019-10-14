import {Component}                                              from "react";
import React                                                    from "react";
import MiniRightBar                                             from "./MiniRightBar";
import {countPrep, countCuring, drawChartItem, countQtyPercent} from "./sharedFunction";

class NormalStiching extends Component {
	constructor(props) {
		super(props);
		this.state = {
			normalStichingData: [],
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if (this.props.normalStichingData != prevProps.normalStichingData){
			let {normalStichingData} = this.props;
			this.setState((state, props) => ({
				normalStichingData: normalStichingData,
			}));
		}
	}

	render(){
		let {normalStichingData} = this.state;
		let chart   = drawChartItem(normalStichingData);
		let prep    = countPrep(normalStichingData);
		let curing  = countCuring(normalStichingData);
		let cycle   = prep + curing;
		let qty     = countQtyPercent(normalStichingData);
		return (
			<div style={{backgroundColor: 'yellow', width: '32%', height: 180, marginRight: 15, marginBottom: 15}}>
				<div className="d-flex">
					<div className="d-flex flex-column" style={{width:'60%', backgroundColor:'#002F49', height: 180, paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
						<span style={{color: '#FFFFFF', marginBottom: 15}}>Normal Stiching</span>
						{chart}
					</div>
					<MiniRightBar prep={prep} curing={curing} cycle={cycle} qty={qty}/>
				</div>
			</div>
		);

	}
}

export default NormalStiching;
