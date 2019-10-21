import React, {Component}                 from 'react';
import {Field, reduxForm}                 from 'redux-form';
import PropTypes                          from 'prop-types';
import {Button, ButtonToolbar, Col, Row}  from 'reactstrap';
import {renderField}                      from "../../../shared/components/form/InputField";
import DataTable                          from "../../../shared/components/data_table/DataTable";
import {FontAwesomeIcon}                  from "@fortawesome/react-fontawesome";
import {faCircle, faPlay}                 from '@fortawesome/free-solid-svg-icons';
import {ALARM_LIST_PROCESS, ASSEMBLY_API} from "../../../constants/urlConstants";
import callAxios                          from "../../../services/api";
import LoadingSpinner                     from "../../../shared/components/loading_spinner/LoadingSpinner";
import {ALARM_MASTER_PAGE_CONSTANTS}      from "../constants";
import validate                           from './validate';

class AlarmMasterForm extends Component {
	static propTypes = {
		handleSubmit: PropTypes.func.isRequired,
		reset       : PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;

		this.modelTableRef = React.createRef();
		this.articleTableRef = React.createRef();
		this.processTableRef = React.createRef();

		this.state  = ({
			processList        : [],
			dataProcess        : [],
			formData           : {
				[field.definitionValue]: '000',
			},
			editMode           : false,
			submitButtonClicked: false,
			submissionError    : '',
			selectedModel      : '',
			selectedArticle    : '',
			selectedProcess    : '',
		});
	}

	loadProcessList = (params) => {
		let method = 'POST';
		let url    = ASSEMBLY_API + ALARM_LIST_PROCESS;

		callAxios(method, url, params).then(response => {
			try {
				let {field}       = ALARM_MASTER_PAGE_CONSTANTS;
				let responseArray = response.data.data;
				let processList   = [];
				let dataProcess   = [];
				responseArray.map(item => {
					item = {
						[field.processCd]      : item.code.toString(),
						[field.processNm]      : item.name.toString(),
						[field.definitionValue]: item.definition_value.toString(),
					};
					processList.push(item);
					dataProcess.push(item);
				});
				this.setState({
					processList: processList,
					dataProcess: dataProcess,
				});
			} catch (e) {
				console.log("Error: ", e);
			}
		});
		if (params.resetForm) {
			this.props.onReset();
		}
	};

	onModelArticleClick = (data) => {
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;
		let selectedRow = data;

		this.setState({
			submitButtonClicked: false,
		});
		this.props.onModelArticleClick(selectedRow);

		let params = {
			model_cd  : selectedRow[field.modelCd],
			article_no: selectedRow[field.articleNo],
			resetForm : true
		};

		this.loadProcessList(params);
	};

	onModelClick = (data) => {
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;

		let selectedRow = data;

		this.setState((state, props) => ({
			submitButtonClicked: false,
			selectedModel: data.model_cd,
			selectedArticle: "",
			dataArticle:[],
			dataProcess:[]
		}));

		/*let modelTable = this.refs.modelTable;
		let modules = modelTable.table.modules;
		let selectedRows = modules.selectRow.selectedRows;
		let selectedModel = selectedRows[0];

		let articleTable = this.refs.articleTable;
		let selectedArticles = articleTable.table.modules.selectRow.selectedRows;
		let selectedArticle = selectedArticles[0];
		articleTable.table.deselectRow();
		if (selectedArticle){
			//selectedArticle.toggleSelect();
			selectedArticle.modules.select.selected = false;
			selectedArticles = articleTable.table.modules.selectRow.selectedRows;
		}*/
		/*let modelTable = this.modelTableRef;
		modelTable.current.table.deselectRow();
		let processTable = this.processTableRef;
		processTable.current.table.deselectRow();*/

		this.props.deselectMainTable();
		this.props.onModelClick(selectedRow);
		this.props.loadArticleTable(selectedRow);
	};

	onModelDeselect = (data) => {
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;

		let selectedRow = data;

		let articleTable = this.articleTableRef;
		articleTable.current.table.deselectRow();
		let processTable = this.processTableRef;
		processTable.current.table.deselectRow();

		this.setState((state, props) => ({
			submitButtonClicked: false,
			selectedModel      : "",
			selectedArticle    : "",
			dataArticle: [],
			dataProcess: [],
		}));

		this.props.onModelDeselect(data);
	}

	onArticleClick = (data) => {
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;
		this.setState((state, props) => ({
			submitButtonClicked: false,
			selectedArticle: data.article_no
		}));
		let selectedRow = data;
		this.props.onArticleClick(selectedRow);
		let params = {
			model_cd  : this.state.selectedModel,
			article_no: this.state.selectedArticle,
			resetForm : true,
		};
		this.loadProcessList(params);
	}

	onArticleDeselect = (data) => {
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;
		let selectedRow = data;

		this.setState((state, props) => ({
			submitButtonClicked: false,
			selectedArticle    : "",
			dataArticle        : [],
			dataProcess        : []
		}));
		this.props.onArticleDeselect(data);
	}

	onProcessClick = (data) => {
		let selectedProcessCode = data.process_cd;

		let {field}       = ALARM_MASTER_PAGE_CONSTANTS;
		let {processList} = this.state;

		processList.some(item => {
			if (item[field.processCd] == selectedProcessCode) {
				this.setState({
					submitButtonClicked: false,
				});
				this.props.change(field.definitionValue, item[field.definitionValue]);
				this.props.onProcessClick(selectedProcessCode, item[field.definitionValue]);
				return true;
			}
			return false;
		});
	};

	onProcessDeselect = (data) => {
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;

		let selectedRow = data;

		this.setState((state, props) => ({
			submitButtonClicked: false,
		}));
		this.props.onProcessDeselect(data);
	}

	callChildLoadProcessList = (params) => {
		this.loadProcessList(params);
	};

	onAlarmSensorTableRowClick = (selectedProcessCode, definitionValue) => {
		console.log("onAlarmSensorTableRowClick onAlarmSensorTableRowClick onAlarmSensorTableRowClick");
		console.log("onAlarmSensorTableRowClick onAlarmSensorTableRowClick onAlarmSensorTableRowClick");
		console.log("selectedProcessCode: ", selectedProcessCode);
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;
		this.props.change(field.definitionValue, definitionValue);

		let modelTable = this.modelTableRef;
		modelTable.current.table.deselectRow();
		//this.props.onModelDeselect();
		//this.props.onAlarmSensorTableRowClick();

		this.setState({
			formData           : {
				...this.state.formData,
				[field.processCd]      : selectedProcessCode,
				[field.definitionValue]: definitionValue,
			},
			dataProcess: [],
			submitButtonClicked: false,
		});
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.formData !== prevProps.formData) {
			this.setState({
				formData: this.props.formData,
				editMode: this.props.editMode,
			});
		}

		//When click row in the below table, have to dispatch value so that submit receives values
		let {field}    = ALARM_MASTER_PAGE_CONSTANTS;
		let {formData} = this.state;

		let model_name   = formData[field.modelNm] ? formData[field.modelNm] : '';
		let article_name = formData[field.articleNm] ? formData[field.articleNm] : '';

		let temp_standard_from = formData[field.tempStandardFrom] ? formData[field.tempStandardFrom] : '0';
		let temp_standard_to   = formData[field.tempStandardTo] ? formData[field.tempStandardTo] : '0';
		let temp_yellow_first  = formData[field.tempYellowFirst] ? formData[field.tempYellowFirst] : '0';
		let temp_yellow_last   = formData[field.tempYellowLast] ? formData[field.tempYellowLast] : '0';
		let temp_red_first     = formData[field.tempRedFirst] ? formData[field.tempRedFirst] : '0';
		let temp_red_last      = formData[field.tempRedLast] ? formData[field.tempRedLast] : '0';

		let pres_standard_from = formData[field.presStandardFrom] ? formData[field.presStandardFrom] : '0';
		let pres_standard_to   = formData[field.presStandardTo] ? formData[field.presStandardTo] : '0';
		let pres_yellow_first  = formData[field.presYellowFirst] ? formData[field.presYellowFirst] : '0';
		let pres_yellow_last   = formData[field.presYellowLast] ? formData[field.presYellowLast] : '0';
		let pres_red_first     = formData[field.presRedFirst] ? formData[field.presRedFirst] : '0';
		let pres_red_last      = formData[field.presRedLast] ? formData[field.presRedLast] : '0';

		let cur_standard_from = formData[field.curStandardFrom] ? formData[field.curStandardFrom] : '0';
		let cur_standard_to   = formData[field.curStandardTo] ? formData[field.curStandardTo] : '0';
		let cur_yellow_first  = formData[field.curYellowFirst] ? formData[field.curYellowFirst] : '0';
		let cur_yellow_last   = formData[field.curYellowLast] ? formData[field.curYellowLast] : '0';
		let cur_red_first     = formData[field.curRedFirst] ? formData[field.curRedFirst] : '0';
		let cur_red_last      = formData[field.curRedLast] ? formData[field.curRedLast] : '0';

		let remark          = formData[field.remark] ? formData[field.remark] : '';
		let definitionValue = formData[field.definitionValue] ? formData[field.definitionValue] : '000';

		this.props.change(field.modelNm, model_name);
		this.props.change(field.articleNm, article_name);

		this.props.change(field.processCd, formData[field.processCd]);

		this.props.change(field.tempStandardFrom, temp_standard_from);
		this.props.change(field.tempStandardTo, temp_standard_to);
		this.props.change(field.tempYellowFirst, temp_yellow_first);
		this.props.change(field.tempYellowLast, temp_yellow_last);
		this.props.change(field.tempRedFirst, temp_red_first);
		this.props.change(field.tempRedLast, temp_red_last);

		this.props.change(field.presStandardFrom, pres_standard_from);
		this.props.change(field.presStandardTo, pres_standard_to);
		this.props.change(field.presYellowFirst, pres_yellow_first);
		this.props.change(field.presYellowLast, pres_yellow_last);
		this.props.change(field.presRedFirst, pres_red_first);
		this.props.change(field.presRedLast, pres_red_last);

		this.props.change(field.curStandardFrom, cur_standard_from);
		this.props.change(field.curStandardTo, cur_standard_to);
		this.props.change(field.curYellowFirst, cur_yellow_first);
		this.props.change(field.curYellowLast, cur_yellow_last);
		this.props.change(field.curRedFirst, cur_red_first);
		this.props.change(field.curRedLast, cur_red_last);

		this.props.change(field.remark, remark);
		this.props.change(field.definitionValue, definitionValue);
	}

	render() {
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;

		let {columnsModelArticle, columnsModel, columnsArticle, dataModelArticle, columnsProcess, dataModel, dataArticle, handleSubmit, reset, onReset, submissionState} = this.props;
		let {formData, processList, dataProcess, submitButtonClicked, submissionError}                          = this.state;
		let definitionArray     = formData[field.definitionValue]
		                          ? formData[field.definitionValue].split("")
		                          : [0, 0, 0];
		let temperatureDisabled = parseInt(definitionArray[0]) === 0;
		let pressureDisabled    = parseInt(definitionArray[1]) === 0;
		let curingTimeDisabled  = parseInt(definitionArray[2]) === 0;

		return (
			<div style={{display: "flex", marginLeft: 18}}>
				<Col md={1.5} lg={1.5} style={{minHeight: 300, minWidth: 200}}>
					{/*<DataTable columns={columnsModelArticle} data={dataModelArticle} options={{
						height: "500px",
						border: "none",
					}} onRowClick={this.onModelArticleClick} id="modelTable"/>*/}
						<DataTable id="modelTable" columns={columnsModel} data={dataModel} ref={this.modelTableRef}
						           options={{
							           height         : "40em",
							           columnVertAlign: "bottom"
						           }}
						           onRowClick={this.onModelClick}
						           onRowDeselect={this.onModelDeselect}
						/>
				</Col>
				<Col md={1.5} lg={1.5} style={{minHeight: 300, minWidth: 220}}>
					<DataTable id="articleTable" columns={columnsArticle} data={dataArticle} ref={this.articleTableRef}
					           options={{
						           height         : "40em",
						           columnVertAlign: "bottom"
					           }}
					           onRowClick={this.onArticleClick}
					           onRowDeselect={this.onArticleDeselect}
					/>
				</Col>
				<Col md={1.5} lg={1.5} style={{minHeight: 300, minWidth: 220}}>
					{/*<div style={{display: "flex", flexDirection: "column"}}>
						<span className="form__form-group-label text-uppercase"
						      style={{paddingTop: 30, paddingLeft: 20, minHeight: 80}}>Process</span>
						<ul className="list-group bg-transparent" style={{width: "100%"}} onClick={this.onProcessClick}>
							{
								processList.map(item => {
									let itemClass = (item[field.processCd] == formData[field.processCd])
									                ? 'list-group-item border-0 selected-process-code'
									                : 'list-group-item border-0 not-selected-process-code';
									let innerData = (item[field.processCd] == formData[field.processCd])
									                ? <div className={"d-flex"}>
										                <div style={{width: '90%'}}>{item[field.processNm]}</div>
										                <div>
											                <FontAwesomeIcon style={{
												                color      : 'rgba(255, 255, 255, 0.54)',
												                fontSize   : 8,
												                justifySelf: "flex-end"
											                }} icon={faPlay}/>
										                </div>
									                </div>
									                : item[field.processNm];
									return <li className={itemClass} key={item[field.processCd]}
									           value={item[field.processCd]}>{innerData}</li>;
								})
							}
						</ul>

					</div>*/}
					<DataTable id="processTable" columns={columnsProcess} data={dataProcess} ref={this.processTableRef}
					           options={{
						           height         : "40em",
						           columnVertAlign: "bottom"
					           }}
					           onRowClick={this.onProcessClick}
					           onRowDeselect={this.onProcessDeselect}
					/>
				</Col>
				<Col md={7} lg={7} style={{backgroundColor: '#1E2229'}}>
					<form className="form form--horizontal" onSubmit={handleSubmit}>
						<Col md={6} lg={6} style={{marginTop: 20}}>
							<div className="form__form-group">
								<span className="form__form-group-label">Model</span>
								<div className="form__form-group-field">
									<Field
										name={field.modelNm}
										component={renderField}
										type="text"
										props={{
											disabled: true,
											value   : formData[field.modelNm]
											          ? formData[field.modelNm]
											          : ''
										}}
										className={"marginLeft-20"}
									/>
								</div>
							</div>
						</Col>
						<Col md={6} lg={6} style={{marginTop: 20}}>
							<div className="form__form-group">
								<span className="form__form-group-label">Article</span>
								<div className="form__form-group-field">
									<Field
										name={field.articleNm}
										component={renderField}
										type="text"
										props={{
											disabled: true,
											value   : formData[field.articleNm]
											          ? formData[field.articleNm]
											          : ''
										}}
									/>
								</div>
							</div>
						</Col>

						<div style={{height: 100}}></div>
						<Col md={3} lg={3}>
							<Field
								name={field.processCd}
								component="input"
								type="hidden"
							/>
						</Col>
						<Col md={3} lg={3}>
							<span className="form__form-group-label text-center text-uppercase ml-4">Temperature</span><span className="text-white" style={{marginLeft: -5}}>(°C)</span>
						</Col>
						<Col md={3} lg={3}>
							<span className="form__form-group-label text-center text-uppercase ml-4">Pressure</span><span className="text-white" style={{marginLeft: -10}}>(Pa)</span>
						</Col>
						<Col md={3} lg={3}>
							<span className="form__form-group-label text-center text-uppercase ml-4">Timer</span><span className="text-white" style={{marginLeft: -24}}>(s)</span>
						</Col>

						<hr style={{height: 30}}/>
						<Col md={3} lg={3} style={{paddingTop: 15}}>
							<span className="form__form-group-label"><FontAwesomeIcon
								style={{color: '#03CF65', fontSize: 8}} icon={faCircle}/> Standard Value</span>
						</Col>
						<Col md={3} lg={3} style={{borderRight: '3px solid #535353'}}>
							<Row style={{paddingTop: 15}}>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">From</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.tempStandardFrom}
										component={renderField}
										type="text"
										props={{
											disabled: temperatureDisabled,
											value   : formData[field.processCd] && !temperatureDisabled
											          ? formData[field.tempStandardFrom]
											          : '',
										}}
										placeholder={formData[field.processCd] && !temperatureDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
											// If the most recent input character of newValue is minus sign
											/*if (newValue[newValue.length - 1] === '-') {
												// But it's not at index 0
												// Then remove it
												if (newValue.length > 1) {
													newValue = newValue.slice(0, -1);
												}
											} else if ('0123456789'.indexOf(newValue[newValue.length - 1]) === -1) {
												// If the most recent input character of newValue is not a number
												// Then remove it
												newValue = newValue.slice(0, -1);
											}*/
											/*if (!/^(([-]?[0-9]{1,3}([.][0-9]{1,2})?)|([-]?[0-9]{1,3}[.]?))$/i.test(newValue)) {
												newValue = newValue.slice(0, -1);
											}*/
											this.setState({
												formData: {
													...formData,
													[field.tempStandardFrom]: newValue,
												}
											});
										}}
									/>
								</Col>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">To</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.tempStandardTo}
										component={renderField}
										type="text"
										props={{
											disabled: temperatureDisabled,
											value   : formData[field.processCd] && !temperatureDisabled
											          ? (
												          formData[field.tempStandardTo] != undefined
												          ? formData[field.tempStandardTo]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !temperatureDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.tempStandardTo]: newValue
													                        ? newValue === '-'
													                          ? newValue
													                          : (+newValue).toString()
													                        : newValue,
												}
											});
										}}
									/>
								</Col>
							</Row>
						</Col>

						<Col md={3} lg={3} style={{borderRight: '3px solid #535353'}}>
							<Row style={{paddingTop: 15}}>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">From</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.presStandardFrom}
										component={renderField}
										type="text"
										props={{
											disabled: pressureDisabled,
											value   : formData[field.processCd] && !pressureDisabled
											          ? (
												          formData[field.presStandardFrom] != undefined
												          ? formData[field.presStandardFrom]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !pressureDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.presStandardFrom]: newValue
													                          ? newValue === '-'
													                            ? newValue
													                            : (+newValue).toString()
													                          : newValue,
												}
											});
										}}
									/>
								</Col>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">To</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.presStandardTo}
										component={renderField}
										type="text"
										props={{
											disabled: pressureDisabled,
											value   : formData[field.processCd] && !pressureDisabled
											          ? (
												          formData[field.presStandardTo] != undefined
												          ? formData[field.presStandardTo]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !pressureDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.presStandardTo]: newValue
													                        ? newValue === '-'
													                          ? newValue
													                          : (+newValue).toString()
													                        : newValue,
												}
											});
										}}
									/>
								</Col>
							</Row>
						</Col>
						<Col md={3} lg={3}>
							<Row style={{paddingTop: 15}}>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">From</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.curStandardFrom}
										component={renderField}
										type="text"
										props={{
											disabled: curingTimeDisabled,
											value   : formData[field.processCd] && !curingTimeDisabled
											          ? (
												          formData[field.curStandardFrom] != undefined
												          ? formData[field.curStandardFrom]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !curingTimeDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.curStandardFrom]: newValue
													                         ? newValue === '-'
													                           ? newValue
													                           : (+newValue).toString()
													                         : newValue,
												}
											});
										}}
									/>
								</Col>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">To</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.curStandardTo}
										component={renderField}
										type="text"
										props={{
											disabled: curingTimeDisabled,
											value   : formData[field.processCd] && !curingTimeDisabled
											          ? (
												          formData[field.curStandardTo] != undefined
												          ? formData[field.curStandardTo]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !curingTimeDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.curStandardTo]: newValue
													                       ? newValue === '-'
													                         ? newValue
													                         : (+newValue).toString()
													                       : newValue,
												}
											});
										}}
									/>
								</Col>
							</Row>
						</Col>

						<hr style={{height: 30}}/>
						<Col md={3} lg={3} style={{paddingTop: 15}}>
							<span className="form__form-group-label"><FontAwesomeIcon
								style={{color: '#FFD44F', fontSize: 8}} icon={faCircle}/> Yellow Range</span>
						</Col>
						<Col md={3} lg={3} style={{borderRight: '3px solid #535353'}}>
							<Row style={{paddingTop: 15}}>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">&lt;</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.tempYellowFirst}
										component={renderField}
										type="text"
										props={{
											disabled: temperatureDisabled,
											value   : formData[field.processCd] && !temperatureDisabled
											          ? (
												          formData[field.tempYellowFirst] != undefined
												          ? formData[field.tempYellowFirst]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !temperatureDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.tempYellowFirst]: newValue
													                         ? newValue === '-'
													                           ? newValue
													                           : (+newValue).toString()
													                         : newValue,
												}
											});
										}}
									/>
								</Col>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">&gt;</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.tempYellowLast}
										component={renderField}
										type="text"
										props={{
											disabled: temperatureDisabled,
											value   : formData[field.processCd] && !temperatureDisabled
											          ? (
												          formData[field.tempYellowLast] != undefined
												          ? formData[field.tempYellowLast]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !temperatureDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.tempYellowLast]: newValue
													                        ? newValue === '-'
													                          ? newValue
													                          : (+newValue).toString()
													                        : newValue,
												}
											});
										}}
									/>
								</Col>
							</Row>
						</Col>
						<Col md={3} lg={3} style={{borderRight: '3px solid #535353'}}>
							<Row style={{paddingTop: 15}}>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">&lt;</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.presYellowFirst}
										component={renderField}
										type="text"
										props={{
											disabled: pressureDisabled,
											value   : formData[field.processCd] && !pressureDisabled
											          ? (
												          formData[field.presYellowFirst] != undefined
												          ? formData[field.presYellowFirst]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !pressureDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.presYellowFirst]: newValue
													                         ? newValue === '-'
													                           ? newValue
													                           : (+newValue).toString()
													                         : newValue,
												}
											});
										}}
									/>
								</Col>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">&gt;</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.presYellowLast}
										component={renderField}
										type="text"
										props={{
											disabled: pressureDisabled,
											value   : formData[field.processCd] && !pressureDisabled
											          ? (
												          formData[field.presYellowLast] != undefined
												          ? formData[field.presYellowLast]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !pressureDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.presYellowLast]: newValue
													                        ? newValue === '-'
													                          ? newValue
													                          : (+newValue).toString()
													                        : newValue,
												}
											});
										}}
									/>
								</Col>
							</Row>
						</Col>
						<Col md={3} lg={3}>
							<Row style={{paddingTop: 15}}>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">&lt;</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.curYellowFirst}
										component={renderField}
										type="text"
										props={{
											disabled: curingTimeDisabled,
											value   : formData[field.processCd] && !curingTimeDisabled
											          ? (
												          formData[field.curYellowFirst] != undefined
												          ? formData[field.curYellowFirst]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !curingTimeDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.curYellowFirst]: newValue
													                        ? newValue === '-'
													                          ? newValue
													                          : (+newValue).toString()
													                        : newValue,
												}
											});
										}}
									/>
								</Col>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">&gt;</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.curYellowLast}
										component={renderField}
										type="text"
										props={{
											disabled: curingTimeDisabled,
											value   : formData[field.processCd] && !curingTimeDisabled
											          ? (
												          formData[field.curYellowLast] != undefined
												          ? formData[field.curYellowLast]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !curingTimeDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.curYellowLast]: newValue
													                       ? newValue === '-'
													                         ? newValue
													                         : (+newValue).toString()
													                       : newValue,
												}
											});
										}}
									/>
								</Col>
							</Row>
						</Col>

						<hr style={{height: 30}}/>
						<Col md={3} lg={3} style={{paddingTop: 15}}>
							<span className="form__form-group-label"><FontAwesomeIcon
								style={{color: '#F84E4E', fontSize: 8}} icon={faCircle}/> Red Range</span>
						</Col>
						<Col md={3} lg={3}  style={{borderRight: '3px solid #535353'}}>
							<Row style={{paddingTop: 15}}>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">&lt;</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.tempRedFirst}
										component={renderField}
										type="text"
										props={{
											disabled: temperatureDisabled,
											value   : formData[field.processCd] && !temperatureDisabled
											          ? (
												          formData[field.tempRedFirst] != undefined
												          ? formData[field.tempRedFirst]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !temperatureDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.tempRedFirst]: newValue
													                      ? newValue === '-'
													                        ? newValue
													                        : (+newValue).toString()
													                      : newValue,
												}
											});
										}}
									/>
								</Col>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">&gt;</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.tempRedLast}
										component={renderField}
										type="text"
										props={{
											disabled: temperatureDisabled,
											value   : formData[field.processCd] && !temperatureDisabled
											          ? (
												          formData[field.tempRedLast] != undefined
												          ? formData[field.tempRedLast]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !temperatureDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.tempRedLast]: newValue
													                     ? newValue === '-'
													                       ? newValue
													                       : (+newValue).toString()
													                     : newValue,
												}
											});
										}}
									/>
								</Col>
							</Row>
						</Col>
						<Col md={3} lg={3} style={{borderRight: '3px solid #535353'}}>
							<Row style={{paddingTop: 15}}>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">&lt;</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.presRedFirst}
										component={renderField}
										type="text"
										props={{
											disabled: pressureDisabled,
											value   : formData[field.processCd] && !pressureDisabled
											          ? (
												          formData[field.presRedFirst] != undefined
												          ? formData[field.presRedFirst]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !pressureDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.presRedFirst]: newValue
													                      ? newValue === '-'
													                        ? newValue
													                        : (+newValue).toString()
													                      : newValue,
												}
											});
										}}
									/>
								</Col>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">&gt;</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.presRedLast}
										component={renderField}
										type="text"
										props={{
											disabled: pressureDisabled,
											value   : formData[field.processCd] && !pressureDisabled
											          ? (
												          formData[field.presRedLast] != undefined
												          ? formData[field.presRedLast]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !pressureDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.presRedLast]: newValue
													                     ? newValue === '-'
													                       ? newValue
													                       : (+newValue).toString()
													                     : newValue,
												}
											});
										}}
									/>
								</Col>
							</Row>
						</Col>
						<Col md={3} lg={3}>
							<Row style={{paddingTop: 15}}>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">&lt;</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.curRedFirst}
										component={renderField}
										type="text"
										props={{
											disabled: curingTimeDisabled,
											value   : formData[field.processCd] && !curingTimeDisabled
											          ? (
												          formData[field.curRedFirst] != undefined
												          ? formData[field.curRedFirst]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !curingTimeDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.curRedFirst]: newValue
													                     ? newValue === '-'
													                       ? newValue
													                       : (+newValue).toString()
													                     : newValue,
												}
											});
										}}
									/>
								</Col>
								<Col md={2} lg={2}>
									<span className="form__form-group-label">&gt;</span>
								</Col>
								<Col md={4} lg={4} style={{marginTop:-6}}>
									<Field
										name={field.curRedLast}
										component={renderField}
										type="text"
										props={{
											disabled: curingTimeDisabled,
											value   : formData[field.processCd] && !curingTimeDisabled
											          ? (
												          formData[field.curRedLast] != undefined
												          ? formData[field.curRedLast]
												          : '0'
											          )
											          : '',
										}}
										placeholder={formData[field.processCd] && !curingTimeDisabled ? '0' : ''}
										onChange={(event, newValue) => {
											if (submitButtonClicked) {
												this.setState({
													submitButtonClicked: false,
												});
											}
											if (submissionError) {
												this.setState({
													submissionError: '',
												});
											}
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
											}
											this.setState({
												formData: {
													...formData,
													[field.curRedLast]: newValue
													                    ? newValue === '-'
													                      ? newValue
													                      : (+newValue).toString()
													                    : newValue,
												}
											});
										}}
									/>
								</Col>
							</Row>
						</Col>

						<hr style={{height: 30}}/>
						<Col md={4} lg={4}>
						</Col>
						<Col md={8} lg={8} style={{marginLeft: -80, marginTop: 20}}>
							<Field
								name={field.remark}
								component={renderField}
								type="text"
								placeholder="Remark"
								props={{
									value: formData[field.remark] ? formData[field.remark] : ''
								}}
								onChange={e => {
									if (submitButtonClicked) {
										this.setState({
											submitButtonClicked: false,
										});
									}
									if (submissionError) {
										this.setState({
											submissionError: '',
										});
									}
									this.setState({
										formData: {
											...formData,
											[field.remark]: e.target.value,
										}
									});
								}}
							/>
							<Field
								name={field.definitionValue}
								component="input"
								type="hidden"
							/>
						</Col>

						<hr style={{height: 30}}/>
						<Col md={12} lg={12} style={{display: 'flex', justifyContent: 'flex-end', marginTop: 20}}>
							<ButtonToolbar className="form__button-toolbar">
								<Button color="primary" type="submit" onClick={() => {
									if (!submitButtonClicked) {
										this.setState({
											submitButtonClicked: true,
										});
									}
								}}>
									{(() => {
										let {initial, onGoing, done} = ALARM_MASTER_PAGE_CONSTANTS.submissionState;
										if (this.state.editMode) {
											switch (submissionState) {
												case initial:
													return 'Save';
												case onGoing:
													return 'Saving';
												case done:
													return 'Saved';
												default:
													return 'Save';
											}
										} else {
											switch (submissionState) {
												case initial:
													return 'Submit';
												case onGoing:
													return 'Submitting';
												case done:
													return 'Submitted';
												default:
													return 'Submit';
											}
										}
									})()}
									{
										submissionState === ALARM_MASTER_PAGE_CONSTANTS.submissionState.onGoing
										? <LoadingSpinner/>
										: ''
									}
								</Button>
								<Field
									name={field.emptyForm}
									type="hidden"
									component={({meta: {error}}) => {
										if (!this.state.submissionError && error) {
											this.setState({
												submissionError: error,
											});
										} else if (this.state.submissionError && !error) {
											this.setState({
												submissionError: '',
											});
										}
										return null;
									}}
								/>
								<Button type="button" onClick={() => {
									reset();
									if (submitButtonClicked) {
										this.setState({
											submitButtonClicked: false,
										});
									}
									onReset();
								}}>
									Cancel
								</Button>
							</ButtonToolbar>
						</Col>
						<Col md={12} lg={12} style={{display: 'flex', justifyContent: 'flex-end', color: '#ad3f38'}}>
							{submitButtonClicked && submissionError}
						</Col>
					</form>
				</Col>
			</div>
		);
	}
}

export default reduxForm({
	form: ALARM_MASTER_PAGE_CONSTANTS.alarmMasterFormName,
	validate,
})(AlarmMasterForm);
