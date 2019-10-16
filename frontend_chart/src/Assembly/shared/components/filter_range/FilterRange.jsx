import React, {Component}                                         from 'react';
import '../../../scss/component/spinner.scss';
import {Field, reduxForm}                                         from 'redux-form';
import renderRadioButtonField                                     from '../form/RadioButton';
import renderDatePickerField                                      from '../form/DatePicker';
import renderSelectField                                          from "../form/Select";
import {faCalendarAlt}                                            from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon}                                          from "@fortawesome/react-fontawesome";
import {Col, Row}                                                 from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";
import {ARRAY_ARTICLES, ARRAY_LINES, ARRAY_MODELS}                from "../../../constants/propertyConstants";
import {ASSEMBLY_API, FILTER_ARTICLE, FILTER_LINE, FILTER_MODEL}  from "../../../constants/urlConstants";
import {changeFilterArticle, changeFilterLine, changeFilterModel} from "../../../redux/actions/filterActions";
import callAxios                                                  from "../../../services/api";
import {connect}                                                  from "react-redux";
import PropTypes                                                  from 'prop-types';
import validate                                                   from "./validateForFilterRange";
import moment                                                     from "moment";

class FilterRange extends Component {

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
			selectedArticle      : ARRAY_ARTICLES[0],
			callUpdateTimes      : 0
		};

		this.fillComboboxes();
	}

	fillComboboxes = () => {
		this.fillLineCombobox();
		//this.fillModelCombobox();
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
					arrayLines: arrayLines.length > 0 ? arrayLines : ARRAY_LINES,
				});

				this.props.dispatch(
					changeFilterLine(arrayLines)
				);

				/*if (this.props.screenName === 'alarmhistory') {
					this.setState((state) => ({
						...state,
						selectedLine: arrayLines.length > 0 ? arrayLines[0] : ARRAY_LINES[0],
					}));

					if (arrayLines.length > 0) {
						this.handleFilterLineChange(arrayLines[0]);
					}
				}*/
				this.setState((state) => ({
					...state,
					selectedLine: arrayLines.length > 0 ? arrayLines[0] : ARRAY_LINES[0],
				}));

				if (arrayLines.length > 0) {
					this.handleFilterLineChange(arrayLines[0]);
				}

			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	fillModelCombobox = (selectedLine = null) => {
		let {screenName}     = this.props;
		screenName           = screenName ? screenName : 'overview';
		let selectedLineCode = "";
		if (selectedLine) {
			selectedLineCode = selectedLine.value;
		}
		let method = 'POST';
		let url    = ASSEMBLY_API + FILTER_MODEL;
		let params = {
			"dropdownlist-name": "model",
			"code"             : selectedLineCode,
			"screenname"       : screenName
		};

		callAxios(method, url, params).then(response => {
			try {
				let dataArray   = response.data.data;
				let arrayModels = [
					{value: '', label: '---'}
				];
				if (dataArray.length > 0){
					arrayModels = [];
					dataArray.forEach(element => {
						arrayModels.push(
							{value: element.code, label: element.name}
						);
					});
				}

				this.setState({
					...this.state,
					arrayModels: arrayModels,
					selectedModel: arrayModels.length > 0 ? arrayModels[0] : ARRAY_MODELS[0],
				});

				if (arrayModels.length > 0){
					this.handleFilterModelChange(arrayModels[0]);
				}

				this.props.dispatch(
					changeFilterModel(arrayModels)
				);
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	fillArticleCombobox = (selectedModel = null) => {
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
				if (dataArray.length > 0){
					arrayArticles = [];
					dataArray.forEach(element => {
						arrayArticles.push(
							{value: element.code, label: element.name}
						);
					});
				}

				this.setState({
					...this.state,
					selectedArticle: arrayArticles.length > 0 ? arrayArticles[0] : ARRAY_ARTICLES[0],
					arrayArticles: arrayArticles,
				});

				if (arrayArticles.length > 0){
					this.handleFilterArticleChange(arrayArticles[0]);
				}

				this.props.dispatch(
					changeFilterArticle(arrayArticles)
				);
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

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
		if (moment(value.toISOString()).isSameOrAfter(this.state.selectedFromDate) && moment(value.toISOString()).isSameOrBefore(new Date())) {
			this.props.handleFilterToDateChange(value);
			this.setState({
				...this.state,
				selectedToDate: value,
			});
		}
	};

	handleFilterLineChange = (value) => {
		this.props.handleFilterLineChange(value);

		this.setState({
			...this.state,
			selectedLine   : value,
			selectedModel  : ARRAY_MODELS[0],
			selectedArticle: ARRAY_ARTICLES[0]
		});

		if (this.props.screenName !== 'alarmhistory') {
			this.fillModelCombobox(value);
		}


	};

	handleFilterModelChange = (value) => {
		this.props.handleFilterModelChange(value);
		this.fillArticleCombobox(value);
		this.setState({
			...this.state,
			selectedModel  : value,
			selectedArticle: ARRAY_ARTICLES[0]
		});
	};

	handleFilterArticleChange = (value) => {
		this.props.handleFilterArticleChange(value);
		this.setState({
			...this.state,
			selectedArticle: value,
		});
	};

	onCheckboxChange = (value) => {
		if (parseInt(value) === 1) {
			this.setState({
				...this.state,
				disableFromDatePicker: true,
				disableToDatePicker  : true,
				selectedFromDate     : new Date(moment().startOf("day").toISOString()),
				selectedToDate       : new Date(moment().endOf("day").toISOString()),
			});
		} else {
			this.setState({
				...this.state,
				disableFromDatePicker: false,
				disableToDatePicker  : false,
			});
		}
	};

	modelFilter = (arrayModels) => (
		<Col md={2} lg={2} style={{marginLeft: -40}}>
			<Row>
				<Col md={2} lg={2}>
					<span className="form__form-group-label">Model: </span>
				</Col>
				<Col md={9} lg={9} style={{marginLeft: 10, marginTop: -12}}>
					<Field
						name="filterModel"
						component={renderSelectField}
						options={arrayModels}
						onChange={this.handleFilterModelChange}
						selected={this.state.selectedModel}
					/>
				</Col>
			</Row>
		</Col>
	);

	articleFilter = (arrayArticles) => (
		<Col md={2} lg={2}>
			<Row>
				<Col md={2} lg={2}>
					<span className="form__form-group-label">Article: </span>
				</Col>
				<Col md={9} lg={9} style={{marginLeft: 10, marginTop: -12}}>
					<Field
						name="filterArticle"
						component={renderSelectField}
						options={arrayArticles}
						onChange={this.handleFilterArticleChange}
						selected={this.state.selectedArticle}
					/>
				</Col>
			</Row>
		</Col>
	);

	render() {
		let {handleSubmit, screenName}               = this.props;
		let {arrayLines, arrayModels, arrayArticles} = this.state;
		return (
			<form className="form form--preview" onSubmit={handleSubmit} style={{paddingLeft: 20}}>
				<Col md={6} lg={6}>
					<Row>
						<Col md={2} lg={2} style={{justifyContent: "flex-end"}}>
							<span className="form__form-group-label">Date Period:</span>
						</Col>
						<Col md={3} lg={3}>
							<div className="form__form-group" style={{marginLeft: 20}}>
								<div className="form__form-group-field">
									<Field
										name="dateRadio"
										component={renderRadioButtonField}
										label="Today"
										radioValue="1"
										defaultChecked
										onChange={this.onCheckboxChange}
									/>
									<Field
										name="dateRadio"
										component={renderRadioButtonField}
										label="Select"
										radioValue="2"
										onChange={this.onCheckboxChange}
									/>
								</div>
							</div>
						</Col>
						<Col md={4} lg={4} style={{marginTop: -7}}>
							<div className="form__form-group" style={{marginLeft: 20}}>
								<div className="form__form-group-field">
									<div style={{width: 100}}>
										<Field
											name="filterFromDate"
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
											name="filterToDate"
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
				</Col>
				<Col md={2} lg={2} style={{marginLeft: -120}}>
					<Row>
						<Col md={2} lg={2}>
							<span className="form__form-group-label">Line: </span>
						</Col>
						<Col md={10} lg={10} style={{marginTop: -12}}>
							<Field
								name="filterLine"
								component={renderSelectField}
								options={arrayLines}
								onChange={this.handleFilterLineChange}
								selected={this.state.selectedLine}
							/>
						</Col>
					</Row>
				</Col>
				{
					screenName ? screenName === "alarmhistory"
					             ? null
					             : this.modelFilter(arrayModels)
					           : this.modelFilter(arrayModels)
				}
				{
					screenName ? screenName === "alarmhistory"
					             ? null
					             : this.articleFilter(arrayArticles)
					           : this.articleFilter(arrayArticles)
				}
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
})(FilterRange));
