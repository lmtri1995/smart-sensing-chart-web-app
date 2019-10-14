import {Component}                         from "react";
import React                               from "react";
import MiniRightBar                        from "./MiniRightBar";
import MiniLeftBar                         from "./MiniLeftBar";
import {handleLeftPanel, handleRightPanel} from "./sharedFunction";

class Chiller extends Component {
	constructor(props) {
		super(props);
		this.state = {
			chillerData: [],
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if (this.props.chillerData != prevProps.chillerData){
			let {chillerData} = this.props;
			this.setState((state, props) => ({
				chillerData: chillerData,
			}));
		}
	}

	render(){
		let {chillerData} = this.state;
		let tempPresTimeItem = handleLeftPanel(chillerData);
		let rightPanelItem = handleRightPanel(chillerData);
		return (
			<div style={{width: '32%', height: 180, marginRight: 15, marginBottom: 15}}>
				<div className="d-flex">
					<MiniLeftBar process="Chiller" tempPressTimer="100"
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

export default Chiller;
