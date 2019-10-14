import MAPPING_STITCH_CONSTANTS from "../constants";

const validate = (values) => {
	let errors                   = {};
	const {field} = MAPPING_STITCH_CONSTANTS;

	if (values[field.hiddenMacAddressDuplicatedChecker]) {
		errors[field.macAddress] = 'Duplicated Mac Address';
	}

	if (!values[field.macAddress] || (values[field.macAddress] && !values[field.macAddress].trim())) {
		errors[field.macAddress] = 'Mac Address field shouldn\'t be empty';
	} else if (values[field.macAddress].length > 30) {
		errors[field.macAddress] = 'Mac Address field shouldn\'t longer than 30 characters';
	}


	if (!values[field.factoryCode]) {
		errors[field.factoryCode] = 'Factory code field shouldn\'t be empty';
	}

	if (!values[field.lineCode]) {
		errors[field.lineCode] = 'Line code field shouldn\'t be empty';
	}

	if (!values[field.processCode]) {
		errors[field.processCode] = 'Process code field shouldn\'t be empty';
	}

	if (!values[field.posittionCode]) {
		errors[field.posittionCode] = 'Posittion code field shouldn\'t be empty';
	}

	if (values[field.description] && values[field.description].trim().length > 300) {
		errors[field.description] = 'Description field shouldn\'t be longer than 300 characters';
	}
	return errors;
};

export default validate;
