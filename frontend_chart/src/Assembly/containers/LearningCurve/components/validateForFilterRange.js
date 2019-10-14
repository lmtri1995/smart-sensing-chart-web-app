const validate = (values) => {
	const errors = {};
	if (!values.basicTargetQty || (values.basicTargetQty && !values.basicTargetQty.toString().trim())) {
		errors.basicTargetQty = 'From target qty shouldn\'t be empty';
	}
	return errors;
};

export default validate;
