import PropTypes from "prop-types";
import React     from "react";

export const renderField = ({input, placeholder, type, meta: {touched, error}, className, disabled, value, style}) => {
	return (
		<div className={className}>
			<input
				{...input}
				style={style}
				value={value}
				placeholder={placeholder}
				type={type}
				disabled={disabled ? disabled : false}
			/>
			{
				touched && error && <span className="form__form-group-error">{error}</span>
			}
		</div>
	);
};

renderField.propTypes = {
	input      : PropTypes.shape().isRequired,
	placeholder: PropTypes.string,
	type       : PropTypes.string,
	meta       : PropTypes.shape({
		touched: PropTypes.bool,
		error  : PropTypes.string,
	}),
	className  : PropTypes.string,
	disabled   : PropTypes.bool,
};

renderField.defaultProps = {
	placeholder: '',
	meta       : null,
	type       : 'text',
};
