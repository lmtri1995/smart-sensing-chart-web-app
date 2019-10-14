import {Col, Progress}   from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle}    from "@fortawesome/free-solid-svg-icons";
import {Component} from "react";
import React from "react";

class MiniLeftBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tempPressTimer: '000',
			tempGreen: 0,
			tempYellow: 0,
			tempRed: 0,
			presGreen: 0,
			presYellow: 0,
			presRed: 0,
			timerGreen: 0,
			timerYellow: 0,
			timerRed: 0
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if (this.props.tempGreen != prevProps.tempGreen || this.props.tempYellow != prevProps.tempYellow || this.props.tempRed != prevProps.tempRed
		 || this.props.presGreen != prevProps.presGreen|| this.props.presYellow != prevProps.presYellow || this.props.presRed != prevProps.presRed
		 || this.props.timerGreen != prevProps.timerGreen || this.props.timerYellow != prevProps.timerYellow || this.props.timerRed != prevProps.timerRed){
			let {process, tempPressTimer, tempGreen, tempYellow, tempRed, presGreen, presYellow, presRed, timerGreen, timerYellow, timerRed} = this.props;
			this.setState((state, props) => ({
				tempGreen: tempGreen,
				tempYellow: tempYellow,
				tempRed: tempRed,
				presGreen: presGreen,
				presYellow: presYellow,
				presRed: presRed,
				timerGreen: timerGreen,
				timerYellow: timerYellow,
				timerRed: timerRed
			}));
		}
	}

	render(){
		let {process, tempPressTimer} = this.props;
		let {tempGreen, tempYellow, tempRed, presGreen, presYellow, presRed, timerGreen, timerYellow, timerRed} = this.state;
		let temperature = tempPressTimer.charAt(0);
		let pressure    = tempPressTimer.charAt(1);
		let timer       = tempPressTimer.charAt(2);
		return (
			<div className="d-flex flex-column" style={{width:'60%', backgroundColor:'#002F49', height:180, paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
				<span style={{color: '#FFFFFF', marginBottom: 15}}>{process}</span>
				{
					temperature==="1"?
						<div className="d-flex flex-row">
							<div style={{color: '#FFFFFF', flex: '0 0 40%'}}>
								Temperature
							</div>
							<div style={{marginLeft: 10, color: '#FFFFFF', flex: '0 0 20%'}}>
								<span style={{color:'#03CF65', fontSize: 10}}>{tempGreen} <FontAwesomeIcon icon={faCircle} /></span>
							</div>
							<div style={{color: '#FFFFFF', flex: '0 0 20%'}}>
								<span style={{color:'#FFD44F', fontSize: 10}}>{tempYellow} <FontAwesomeIcon icon={faCircle} /></span>
							</div>
							<div style={{color: '#FFFFFF', flex: '0 0 20%'}}>
								<span style={{color:'#F84E4E', fontSize: 10}}>{tempRed} <FontAwesomeIcon icon={faCircle} /></span>
							</div>
						</div>
					: ''
				}
				{
					pressure==="1"?
						<div className="d-flex flex-row" style={{marginTop: 15}}>
							<div style={{color: '#FFFFFF', flex: '0 0 40%'}}>
								Pressure
							</div>
							<div style={{marginLeft: 10, color: '#FFFFFF', flex: '0 0 20%'}}>
								<span style={{color:'#03CF65', fontSize: 10}}>{presGreen} <FontAwesomeIcon icon={faCircle} /></span>
							</div>
							<div style={{color: '#FFFFFF', flex: '0 0 20%'}}>
								<span style={{color:'#FFD44F', fontSize: 10}}>{presYellow} <FontAwesomeIcon icon={faCircle} /></span>
							</div>
							<div style={{color: '#FFFFFF', flex: '0 0 20%'}}>
								<span style={{color:'#F84E4E', fontSize: 10}}>{presRed} <FontAwesomeIcon icon={faCircle} /></span>
							</div>
						</div>
					: ''
				}
				{
					timer==="1"?
						<div className="d-flex flex-row" style={{marginTop: 15}}>
							<div style={{color: '#FFFFFF', flex: '0 0 40%'}}>
								Timer
							</div>
							<div style={{marginLeft: 10, color: '#FFFFFF', flex: '0 0 20%'}}>
								<span style={{color:'#03CF65', fontSize: 10}}>{timerGreen} <FontAwesomeIcon icon={faCircle} /></span>
							</div>
							<div style={{color: '#FFFFFF', flex: '0 0 20%'}}>
								<span style={{color:'#FFD44F', fontSize: 10}}>{timerYellow} <FontAwesomeIcon icon={faCircle} /></span>
							</div>
							<div style={{color: '#FFFFFF', flex: '0 0 20%'}}>
								<span style={{color:'#F84E4E', fontSize: 10}}>{timerRed} <FontAwesomeIcon icon={faCircle} /></span>
							</div>
						</div>
					: ''
				}


			</div>
		);

	}
}

export default MiniLeftBar;
