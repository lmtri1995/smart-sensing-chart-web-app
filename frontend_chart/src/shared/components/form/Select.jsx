import React, {PureComponent} from 'react';
import Select                 from 'react-select';
import PropTypes              from 'prop-types';

class SelectField extends PureComponent {
	static propTypes = {
		onChange   : PropTypes.func.isRequired,
		name       : PropTypes.string.isRequired,
		placeholder: PropTypes.string,
		options    : PropTypes.arrayOf(PropTypes.shape({
			value: PropTypes.string,
			label: PropTypes.string,
		})),
		value      : PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.shape({
				value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
				label: PropTypes.string,
			}),
		]).isRequired,
		disabled   : PropTypes.bool,
	};

	static defaultProps = {
		placeholder: '',
		options    : [],
	};

	handleChange = (selectedOption) => {
		const {onChange} = this.props;
		onChange(selectedOption);
	};

	render() {
		const {
			      value, name, placeholder, options, disabled
		      } = this.props;

		return (
			<Select
				name={name}
				value={value}
				onChange={this.handleChange}
				options={options}
				clearable={false}
				className="react-select"
				placeholder={placeholder}
				classNamePrefix="react-select"
				isDisabled={disabled}
			/>
		);
	}
}

const renderSelectField = (props) => {
	const {
		      input, meta, options, placeholder, className, selected, disabled
	      } = props;
	return (
		<div className={className}>
			<SelectField
				{...input}
				options={options}
				placeholder={placeholder}
				value={selected}
				disabled={disabled}
			/>
			{meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
		</div>
	);
};

renderSelectField.propTypes = {
	input      : PropTypes.shape({
		onChange: PropTypes.func,
		name    : PropTypes.string,
	}).isRequired,
	meta       : PropTypes.shape({
		touched: PropTypes.bool,
		error  : PropTypes.string,
	}),
	options    : PropTypes.arrayOf(PropTypes.shape({
		value: PropTypes.string,
		label: PropTypes.string,
	})),
	placeholder: PropTypes.string,
};

renderSelectField.defaultProps = {
	meta       : null,
	options    : [],
	placeholder: '',
};

export default renderSelectField;
