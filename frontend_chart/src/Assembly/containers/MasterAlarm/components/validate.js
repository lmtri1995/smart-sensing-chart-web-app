import {ALARM_MASTER_PAGE_CONSTANTS} from "../constants";

const validate = (values) => {
	let {field, submissionError} = ALARM_MASTER_PAGE_CONSTANTS;
	let errors                   = {};

	if (!values[field.modelNm]) {
		errors[field.modelNm] = 'Model Name shouldn\'t be empty';
	}
	if (!values[field.articleNm]) {
		errors[field.articleNm] = 'Article Name shouldn\'t be empty';
	}

	let definitionArray     = values[field.definitionValue] ? values[field.definitionValue].split("") : [0, 0, 0];
	let temperatureDisabled = parseInt(definitionArray[0]) === 0;
	let pressureDisabled    = parseInt(definitionArray[1]) === 0;
	let curingTimeDisabled  = parseInt(definitionArray[2]) === 0;

	if (values[field.processCd]) {
		if (!temperatureDisabled) {
			if (!values[field.tempStandardFrom]) {
				errors[field.tempStandardFrom] = 'This shouldn\'t be empty';
			}
			if (!values[field.tempStandardTo]) {
				errors[field.tempStandardTo] = 'This shouldn\'t be empty';
			}
			if (!values[field.tempYellowFirst]) {
				errors[field.tempYellowFirst] = 'This shouldn\'t be empty';
			}
			if (!values[field.tempYellowLast]) {
				errors[field.tempYellowLast] = 'This shouldn\'t be empty';
			}
			if (!values[field.tempRedFirst]) {
				errors[field.tempRedFirst] = 'This shouldn\'t be empty';
			}
			if (!values[field.tempRedLast]) {
				errors[field.tempRedLast] = 'This shouldn\'t be empty';
			}

			if (!/^([-]?[0-9]{1,3}([.][0-9]{1,2})?)$/i.test(values[field.tempStandardFrom])) {
				errors[field.tempStandardFrom] = 'Wrong number format, right format: [-]xxxx.xx';
			}
			if (!/^([-]?[0-9]{1,3}([.][0-9]{1,2})?)$/i.test(values[field.tempStandardTo])) {
				errors[field.tempStandardTo] = 'Wrong number format, right format: [-]xxxx.xx';
			}
			if (!/^([-]?[0-9]{1,3}([.][0-9]{1,2})?)$/i.test(values[field.tempYellowFirst])) {
				errors[field.tempYellowFirst] = 'Wrong number format, right format: [-]xxxx.xx';
			}
			if (!/^([-]?[0-9]{1,3}([.][0-9]{1,2})?)$/i.test(values[field.tempYellowLast])) {
				errors[field.tempYellowLast] = 'Wrong number format, right format: [-]xxxx.xx';
			}
			if (!/^([-]?[0-9]{1,3}([.][0-9]{1,2})?)$/i.test(values[field.tempRedFirst])) {
				errors[field.tempRedFirst] = 'Wrong number format, right format: [-]xxxx.xx';
			}
			if (!/^([-]?[0-9]{1,3}([.][0-9]{1,2})?)$/i.test(values[field.tempRedLast])) {
				errors[field.tempRedLast] = 'Wrong number format, right format: [-]xxxx.xx';
			}
		}

		if (!pressureDisabled) {
			if (!values[field.presStandardFrom]) {
				errors[field.presStandardFrom] = 'This shouldn\'t be empty';
			}
			if (!values[field.presStandardTo]) {
				errors[field.presStandardTo] = 'This shouldn\'t be empty';
			}
			if (!values[field.presYellowFirst]) {
				errors[field.presYellowFirst] = 'This shouldn\'t be empty';
			}
			if (!values[field.presYellowLast]) {
				errors[field.presYellowLast] = 'This shouldn\'t be empty';
			}
			if (!values[field.presRedFirst]) {
				errors[field.presRedFirst] = 'This shouldn\'t be empty';
			}
			if (!values[field.presRedLast]) {
				errors[field.presRedLast] = 'This shouldn\'t be empty';
			}

			if (!/^([-]?[0-9]{1,3}([.][0-9]{1,2})?)$/i.test(values[field.presStandardFrom])) {
				errors[field.presStandardFrom] = 'Wrong number format, right format: [-]xxxx.xx';
			}
			if (!/^([-]?[0-9]{1,3}([.][0-9]{1,2})?)$/i.test(values[field.presStandardTo])) {
				errors[field.presStandardTo] = 'Wrong number format, right format: [-]xxxx.xx';
			}
			if (!/^([-]?[0-9]{1,3}([.][0-9]{1,2})?)$/i.test(values[field.presYellowFirst])) {
				errors[field.presYellowFirst] = 'Wrong number, right format: [-]xxxx.xx';
			}
			if (!/^([-]?[0-9]{1,3}([.][0-9]{1,2})?)$/i.test(values[field.presYellowLast])) {
				errors[field.presYellowLast] = 'Wrong number format, right format: [-]xxxx.xx';
			}
			if (!/^([-]?[0-9]{1,3}([.][0-9]{1,2})?)$/i.test(values[field.presRedFirst])) {
				errors[field.presRedFirst] = 'Wrong number format, right format: [-]xxxx.xx';
			}
			if (!/^([-]?[0-9]{1,3}([.][0-9]{1,2})?)$/i.test(values[field.presRedLast])) {
				errors[field.presRedLast] = 'Wrong number format, right format: [-]xxxx.xx';
			}
		}

		if (!curingTimeDisabled) {
			if (!values[field.curStandardFrom]) {
				errors[field.curStandardFrom] = 'This shouldn\'t be empty';
			}
			if (!values[field.curStandardTo]) {
				errors[field.curStandardTo] = 'This shouldn\'t be empty';
			}
			if (!values[field.curYellowFirst]) {
				errors[field.curYellowFirst] = 'This shouldn\'t be empty';
			}
			if (!values[field.curYellowLast]) {
				errors[field.curYellowLast] = 'This shouldn\'t be empty';
			}
			if (!values[field.curRedFirst]) {
				errors[field.curRedFirst] = 'This shouldn\'t be empty';
			}
			if (!values[field.curRedLast]) {
				errors[field.curRedLast] = 'This shouldn\'t be empty';
			}

			if (values[field.curStandardFrom] === '-') {
				errors[field.curStandardFrom] = 'Wrong number format, right format: [-]xxxx.xx';
			}
			if (values[field.curStandardTo] === '-') {
				errors[field.curStandardTo] = 'Wrong number format, right format: [-]xxxx.xx';
			}
			if (values[field.curYellowFirst] === '-') {
				errors[field.curYellowFirst] = 'Wrong number format, right format: [-]xxxx.xx';
			}
			if (values[field.curYellowLast] === '-') {
				errors[field.curYellowLast] = 'Wrong number format, right format: [-]xxxx.xx';
			}
			if (values[field.curRedFirst] === '-') {
				errors[field.curRedFirst] = 'Wrong number format, right format: [-]xxxx.xx';
			}
			if (values[field.curRedLast] === '-') {
				errors[field.curRedLast] = 'Wrong number format, right format: [-]xxxx.xx';
			}
		}
	} else {
		errors[field.emptyForm] = submissionError.emptyForm;
	}
	return errors;
};

export default validate;
