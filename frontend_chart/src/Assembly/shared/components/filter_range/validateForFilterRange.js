const validate = (values) => {
	const errors = {};
	if (!values.filterFromDate || (values.filterFromDate && !values.filterFromDate.toString().trim())) {
		errors.filterFromDate = 'From date field shouldn\'t be empty';
	}
	return errors;
};

export default validate;
