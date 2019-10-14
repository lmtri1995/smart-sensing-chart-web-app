import React, {Component} from "react";
import {Row}              from "reactstrap";

class HourBar extends Component {
	handleHourClick = (selectedHour) => {
		this.props.handleHourFilterChange(selectedHour);
	};

	render() {
		let {selectedHour} = this.props;
		let hourArray      = ['All', '7:30', '8:30', '9:30', '10:30',
		                      '11:30', '12:30', '13:30', '14:30', '15:30',
		                      '16:30', '17:30', '18:30', '19:30', '20:30',
		                      '21:30', '22:30'
		];
		let divArray       = [];

		for (let i = 0; i < hourArray.length; i++) {
			let backgroundColor = '#1E2229';
			if (selectedHour == hourArray[i]) {
				backgroundColor = '#1D2F56';
			}
			divArray[i] =
				<div key={hourArray[i]} style={{color: '#BEBEBE', backgroundColor: backgroundColor, padding: 30}}
				     onClick={this.handleHourClick.bind(this, hourArray[i])}>{hourArray[i]}</div>;
		}

		return <Row>
			<div style={{
				display       : 'flex',
				padding       : 15,
				flexWrap      : 'wrap',
				justifyContent: 'space-between',
				width         : '100%'
			}}>
				{divArray}
			</div>
		</Row>;
	}
}

export default HourBar;
