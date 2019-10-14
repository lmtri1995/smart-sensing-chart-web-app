import {Component}                         from "react";
import React                               from "react";
import MiniRightBar                        from "./MiniRightBar";
import MiniLeftBar                         from "./MiniLeftBar";
import {handleLeftPanel, handleRightPanel} from "./sharedFunction";

class Cememting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cementingData: [],
			tempPresTimeItem: {
				tempGreen: 0,
				tempYellow: 0,
				tempRed: 0,
				presGreen: 0,
				presYellow: 0,
				presRed: 0,
				timerGreen: 0,
				timerYellow: 0,
				timerRed: 0
			},
			rightPanelItem: {
				qty: 0,
				prep: 0,
				curing: 0,
				cycle: 0
			}
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if (this.props.cementingData != prevProps.cementingData){
			let {cementingData} = this.props;
			let tempPresTimeItem = handleLeftPanel(cementingData);
			let rightPanelItem = handleRightPanel(cementingData);
			this.setState((state, props) => ({
				cementingData: cementingData,
				tempPresTimeItem: tempPresTimeItem,
				rightPanelItem: rightPanelItem
			}));
		}
	}

	render(){
		let {cementingData, tempPresTimeItem, rightPanelItem} = this.state;

		return (
			<div style={{width: '32%', height: 180, marginRight: 15, marginBottom: 15}}>
				<div className="d-flex">
					<MiniLeftBar process="Cementing" tempPressTimer="100"
					             tempGreen = {tempPresTimeItem.tempGreen}
					             tempYellow = {tempPresTimeItem.tempYellow}
					             tempRed = {tempPresTimeItem.tempRed}
					             presGreen = {tempPresTimeItem.presGreen}
					             presYellow = {tempPresTimeItem.presYellow}
					             presRed = {tempPresTimeItem.presRed}
					             timerGreen = {tempPresTimeItem.timerGreen}
					             timerYellow = {tempPresTimeItem.timerYellow}
					             timerRed = {tempPresTimeItem.timerRed}/>
					<MiniRightBar qty={rightPanelItem.qty} prep={rightPanelItem.prep} curing={rightPanelItem.curing} cycle={rightPanelItem.cycle}/>
				</div>
			</div>
		);

	}
}

export default Cememting;
