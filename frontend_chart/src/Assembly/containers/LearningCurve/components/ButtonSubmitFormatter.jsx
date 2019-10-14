import React, {Component}         from 'react';
import Modal                      from "../components/Modal";
import {LEARNING_CURVE_CONSTANTS} from "../constants";

class ButtonSubmitFormatter extends Component {
	constructor(props) {
		super(props);
	}

	onOkClicked = (rowData) => {
		//LearningCurve.prototype.handleModelSubmit();
		this.props.onOkClicked(rowData);
	};


	render() {
		let rowData = this.props.cell._cell.row.data;
		/*model_no: "MU534"
		 model_nm: "PRINCESS WIDE D"*/
		let modelSubmissionStatus = -1;
		let message               = `You're about to submit new value for target quantity
		for model: ${rowData[LEARNING_CURVE_CONSTANTS.field.modelName]} model number: ${rowData[LEARNING_CURVE_CONSTANTS.field.modelNo]}`;
		//return <div>{rowData.basic_target_qty}</div>
		return <Modal
			style={{marginLeft: -25, marginTop: -8}}
			type="submit"
			color="primary"
			title="Congratulations!"
			btn="Submit"
			message={message}
			onOkClicked={() => this.onOkClicked(rowData)}
			submissionStatus={modelSubmissionStatus}
		/>;
	}
}

export default ButtonSubmitFormatter;
