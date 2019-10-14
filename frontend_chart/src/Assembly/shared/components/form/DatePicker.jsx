import React, {PureComponent} from 'react';
import DatePicker             from 'react-datepicker';
import PropTypes              from 'prop-types';

class DatePickerField extends PureComponent {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
	};

	constructor() {
		super();
		this.state        = {
			startDate: null,
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(date) {
		const {onChange} = this.props;
		this.setState({
			startDate: date,
		});
		onChange(date);
	}

	render() {
		const {startDate}                = this.state;
		const {disabled, selected, meta} = this.props;
		return (
			<div className="date-picker">
				<DatePicker
					className="form__form-group-datepicker"
					selected={startDate}
					onChange={this.handleChange}
					dateFormat="dd/MM/yyyy"
					dropDownMode="select"
					disabled={true === disabled}
					selected={selected}
				/>
				{
					meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>
				}
			</div>
		);
	}
}

const renderDatePickerField = (props) => {
	const {input, meta} = props;
	return <DatePickerField {...input} meta={meta} disabled={props.disabled} selected={props.selected}/>;
};

renderDatePickerField.propTypes = {
	input: PropTypes.shape({
		onChange: PropTypes.func,
		name    : PropTypes.string,
	}).isRequired,
};

export default renderDatePickerField;
