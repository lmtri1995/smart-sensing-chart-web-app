import PropTypes from "prop-types";
import React     from "react";
import {Field}   from "redux-form";

export const textAreaField = ({input, placeholder, type, meta: {touched, error}, className, disabled, value, style, wrap, rows, cols}) => {
	return (
		<div className={className}>
			<textarea
				{...input}
				style={style}
				value={value}
				wrap={wrap}
				placeholder={placeholder}
				disabled={disabled ? disabled : false}
			/>
			{
				touched && error && <span className="form__form-group-error">{error}</span>
			}
		</div>
	);
};

textAreaField.propTypes = {
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

textAreaField.defaultProps = {
	placeholder: '',
	meta       : null,
	type       : 'textarea',
};
