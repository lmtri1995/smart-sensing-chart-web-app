import React, {Component}                          from 'react';
import '../../../scss/component/spinner.scss';
import {Field, reduxForm}                          from 'redux-form';
import renderRadioButtonField                      from '../../../shared/components/form/RadioButton';
import renderDatePickerField                       from '../../../shared/components/form/DatePicker';
import renderSelectField                           from "../../../shared/components/form/Select";
import {faCalendarAlt}                             from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon}                           from "@fortawesome/react-fontawesome";
import {Col, Row}                                  from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";
import {ARRAY_ARTICLES, ARRAY_LINES, ARRAY_MODELS} from "../../../constants/propertyConstants";
import {ASSEMBLY_API, FILTER_LINE, FILTER_MODEL}   from "../../../constants/urlConstants";
import {changeFilterLine, changeFilterModel}       from "../../../redux/actions/filterActions";
import callAxios                                   from "../../../services/api";
import {connect}                                   from "react-redux";
import PropTypes                                   from 'prop-types';
import validate                                    from "./validateForFilterRange";
import {renderField}                               from "../../../shared/components/form/InputField";
import {LEARNING_CURVE_CONSTANTS}                  from "./../constants";
import Modal                                       from "./../components/Modal";
import moment                                      from "moment";


let {field} = LEARNING_CURVE_CONSTANTS;

class FilterRangeForLearningCurve extends Component {

	static propTypes = {
		handleFilterFromDateChange: PropTypes.func.isRequired,
		handleFilterToDateChange  : PropTypes.func.isRequired,
		handleFilterModelChange   : PropTypes.func.isRequired,
		handleFilterLineChange    : PropTypes.func.isRequired,
		handleFilterArticleChange : PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = {
			disableFromDatePicker: true,
			disableToDatePicker  : true,
			arrayLines           : ARRAY_LINES,
			selectedLine         : ARRAY_LINES[0],
			arrayModels          : ARRAY_MODELS,
			selectedModel        : ARRAY_MODELS[0],
			arrayArticles        : ARRAY_ARTICLES,
			//selectedArticle      : ARRAY_ARTICLES[0],
			formData             : {},
			selectedFromDate     : new Date(),
			selectedToDate       : new Date(),
		};

		this.fillComboboxes();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.formData[field.basicTargetQty] !== prevProps.formData[field.basicTargetQty]) {
			this.setState({
				formData: this.props.formData,
			});
		}
		let {formData}     = this.state;
		let basicTargetQty = formData[field.basicTargetQty] ? formData[field.basicTargetQty] : '0';
		this.props.change(field.basicTargetQty, basicTargetQty);
	}

	fillComboboxes = () => {
		this.fillLineCombobox();
		this.fillModelCombobox();
		//this.fillArticleCombobox();
	};

	fillLineCombobox = () => {
		let method = 'POST';
		let url    = ASSEMBLY_API + FILTER_LINE;
		let params = {
			"dropdownlist-name": "line"
		};

		callAxios(method, url, params).then(response => {
			try {
				let dataArray  = response.data.data;
				let arrayLines = [];
				dataArray.forEach(element => {
					arrayLines.push(
						{value: element.code, label: element.name}
					);
				});

				this.setState({
					...this.state,
					selectedLine: arrayLines.length > 0 ? arrayLines[0] : ARRAY_LINES[0],
					arrayLines  : arrayLines.length > 0 ? arrayLines : ARRAY_LINES,
				});

				this.props.dispatch(
					changeFilterLine(arrayLines)
				);

				if (arrayLines.length > 0) {
					this.handleFilterLineChange(arrayLines[0]);
				}
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	fillModelCombobox = (selectedLine = null) => {
		let selectedLineCode = "";
		if (selectedLine) {
			selectedLineCode = selectedLine.value;
		}
		let method = 'POST';
		let url    = ASSEMBLY_API + FILTER_MODEL;
		let params = {
			"dropdownlist-name": "model",
			"code"             : selectedLineCode,
			"screenname"       : "learningcurve"
		};

		callAxios(method, url, params).then(response => {
			try {
				let dataArray   = response.data.data;
				let arrayModels = [];
				dataArray.forEach(element => {
					if (element.code.toString().trim() && element.name.toString().trim()) {
						arrayModels.push({
							value  : element.code,
							label  : element.name,
							workYMD: element.work_ymd,
						});
					}
				});

				this.setState({
					...this.state,
					selectedModel: arrayModels.length > 0 ? arrayModels[0] : ARRAY_MODELS[0],
					arrayModels  : arrayModels.length > 0 ? arrayModels : ARRAY_MODELS,
				});

				this.props.dispatch(
					changeFilterModel(arrayModels)
				);

				if (arrayModels.length > 0) {
					this.handleFilterModelChange(arrayModels[0]);
				}
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	/*fillArticleCombobox = (selectedModel = null) => {
	 let method = 'POST';
	 let url    = ASSEMBLY_API + FILTER_ARTICLE;

	 let selectedModelCode = "";
	 if (selectedModel) {
	 selectedModelCode = selectedModel.value;
	 }

	 let params = {
	 "dropdownlist-name": "article",
	 "code"             : selectedModelCode
	 };

	 callAxios(method, url, params).then(response => {
	 try {
	 let dataArray     = response.data.data;
	 let arrayArticles = [
	 {value: '', label: '---'}
	 ];
	 dataArray.forEach(element => {
	 arrayArticles.push(
	 {value: element.code, label: element.name}
	 );
	 });

	 this.setState({
	 ...this.state,
	 arrayArticles: arrayArticles,
	 });

	 this.props.dispatch(
	 changeFilterArticle(arrayArticles)
	 );
	 } catch (e) {
	 console.log("Error: ", e);
	 }
	 });
	 }*/

	handleFilterFromDateChange = (value) => {
		if (moment(value.toISOString()).isSameOrBefore(this.state.selectedToDate)) {
			this.props.handleFilterFromDateChange(value);
			this.setState({
				...this.state,
				selectedFromDate: value,
			});
		}
	};

	handleFilterToDateChange = (value) => {
		if (moment(value.toISOString()).isSameOrAfter(this.state.selectedFromDate)) {
			this.props.handleFilterToDateChange(value);
			this.setState({
				...this.state,
				selectedToDate: value,
			});
		}
	};

	handleFilterLineChange = (value) => {
		this.props.handleFilterLineChange(value);

		this.fillModelCombobox(value);

		this.setState({
			...this.state,
			selectedLine : value,
			selectedModel: ARRAY_MODELS[0],
			//selectedArticle: ARRAY_ARTICLES[0]
		});
		this.props.change(field.filterLine, value);
	};

	handleFilterModelChange = (value) => {
		this.props.handleFilterModelChange(value);
		//this.fillArticleCombobox(value);
		this.setState({
			...this.state,
			selectedModel: value,
			//selectedArticle: ARRAY_ARTICLES[0]
		});
		this.props.change(field.filterModel, value);
	};

	/*handleFilterArticleChange = (value) => {
	 this.props.handleFilterArticleChange(value);
	 this.setState({
	 ...this.state,
	 selectedArticle: value,
	 });
	 }*/

	onCheckboxChange = (value) => {
		if (parseInt(value) === 1) {
			this.setState({
				...this.state,
				disableFromDatePicker: true,
				disableToDatePicker  : true,
				selectedFromDate     : new Date(),
				selectedToDate       : new Date(),
			});
			this.props.handleFilterFromDateChange(new Date());
			this.props.handleFilterToDateChange(new Date());
		} else {
			this.setState({
				...this.state,
				disableFromDatePicker: false,
				disableToDatePicker  : false,
			});
		}
	};

	onOkClicked = () => {
		this.props.changeIsOKClicked(true);
		this.props.handleSubmit();
	};

	render() {
		let {arrayLines, arrayModels, formData}              = this.state;
		let {handleSubmit, selectedProcess, submissionState} = this.props;
		let message                                          = `You're about to submit new value for target quantity
		for model: ${selectedProcess[field.modelNo]} process: ${selectedProcess[field.processCode]}`;
		return (
			<form className="form form--preview d-flex" style={{paddingLeft: 20}} onSubmit={handleSubmit}>
				<div style={{width: '100%', marginBottom: 40,}}>
					<Row>
						<Col md={5} lg={5}>
						</Col>
						<Col md={1} lg={1}>
							<span className="form__form-group-label">Line: </span>
						</Col>
						<Col md={2} lg={2} style={{marginTop: -12}}>
							<Field
								name={field.filterLine}
								component={renderSelectField}
								options={arrayLines}
								onChange={this.handleFilterLineChange}
								selected={this.state.selectedLine}
							/>
						</Col>
						<Col md={4} lg={4}>
						</Col>
					</Row>
				</div>
				<div style={{width: '48%', height: 90, padding: 30, backgroundColor: '#1A1F27'}}>
					<Row>
						<Col md={1} lg={1}>
							<span className="form__form-group-label">Model: </span>
						</Col>
						<Col md={4} lg={4} style={{marginLeft: 10, marginTop: -12}}>
							<Field
								name={field.filterModel}
								component={renderSelectField}
								options={arrayModels}
								onChange={this.handleFilterModelChange}
								selected={this.state.selectedModel}
							/>
						</Col>
						<Col md={2} lg={2}>
							<span className="form__form-group-label">Target Qty:</span>
						</Col>
						<Col md={3} lg={3} style={{marginTop: -12, marginLeft: -30}}>
							<Field
								name={field.basicTargetQty}
								component={renderField}
								type="text"
								props={{
									value: formData[field.basicTargetQty]
									       ? formData[field.basicTargetQty]
									       : '0'
								}}
								placeholder={formData[field.basicTargetQty] ? '0' : ''}
								onChange={(event, newValue) => {
									// If the most recent input character of newValue is minus sign
									if (newValue[newValue.length - 1] === '-') {
										// But it's not at index 0
										// Then remove it
										if (newValue.length > 1) {
											newValue = newValue.slice(0, -1);
										}
									} else if ('0123456789'.indexOf(newValue[newValue.length - 1]) === -1) {
										// If the most recent input character of newValue is not a number
										// Then remove it
										newValue = newValue.slice(0, -1);
									} else if (newValue.length > 3) {
										while (newValue.length > 3) {
											newValue = newValue.slice(0, -1);
										}
									}
									this.setState({
										formData: {
											...formData,
											[field.basicTargetQty]: newValue
											                        ? newValue === '-'
											                          ? newValue
											                          : (+newValue).toString()
											                        : newValue,
										}
									});
								}}
							/>
						</Col>
						<Modal
							style={{marginLeft: 10, marginTop: -20}}
							type="submit"
							color="primary"
							title="Value will be updated!"
							btn="Submit"
							message={message}
							onOkClicked={this.onOkClicked}
							submissionState={submissionState}
						/>
					</Row>
				</div>
				<div style={{width: '0.01%'}}>
				</div>
				<div style={{width: '48%', height: 90, padding: 30, backgroundColor: '#1A1F27'}}>
					<Row>
						<Col md={2} lg={2} style={{justifyContent: "flex-end"}}>
							<span className="form__form-group-label">Date Period:</span>
						</Col>
						<Col md={4} lg={4}>
							<div className="form__form-group" style={{marginLeft: 20}}>
								<div className="form__form-group-field">
									<Field
										name={field.dateRadio}
										component={renderRadioButtonField}
										label="Today"
										radioValue="1"
										defaultChecked
										onChange={this.onCheckboxChange}
									/>
									<Field
										name={field.dateRadio}
										component={renderRadioButtonField}
										label="Select"
										radioValue="2"
										onChange={this.onCheckboxChange}
									/>
								</div>
							</div>
						</Col>
						<Col md={3} lg={3} style={{marginTop: -7}}>
							<div className="form__form-group" style={{marginLeft: -40}}>
								<div className="form__form-group-field">
									<div style={{width: 100}}>
										<Field
											name={field.filterFromDate}
											component={renderDatePickerField}
											disabled={this.state.disableFromDatePicker}
											selected={this.state.selectedFromDate}
											onChange={this.handleFilterFromDateChange}
										/>
									</div>
									<div className="form__form-group-icon">
										<FontAwesomeIcon icon={faCalendarAlt}/>
									</div>
								</div>
							</div>
						</Col>
						<span>~</span>
						<Col md={4} lg={4} style={{marginLeft: -120, marginTop: -7}}>
							<div className="form__form-group" style={{marginLeft: 20}}>
								<div className="form__form-group-field">
									<div style={{width: 100}}>
										<Field
											name={field.filterToDate}
											component={renderDatePickerField}
											disabled={this.state.disableToDatePicker}
											selected={this.state.selectedToDate}
											onChange={this.handleFilterToDateChange}
										/>
									</div>
									<div className="form__form-group-icon">
										<FontAwesomeIcon icon={faCalendarAlt}/>
									</div>
								</div>
							</div>
						</Col>
					</Row>
				</div>
			</form>
		);
	}
}

const mapStateToProps = (state) => ({
	filterFromDate: state.filterFromDate,
	filterToDate  : state.filterToDate,
	filterLine    : state.filterLine,
	filterModel   : state.filterModel,
	filterArticle : state.filterArticle,
});


export default connect(mapStateToProps)(reduxForm({
	form: 'filter_range',
	validate,
})(FilterRangeForLearningCurve));
