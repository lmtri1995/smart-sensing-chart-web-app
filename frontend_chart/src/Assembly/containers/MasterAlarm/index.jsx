import React, {Component}                                from 'react';
import {Col, Container, Row}                             from 'reactstrap';
import AlarmMasterForm                                   from "./components/AlarmMasterForm";
import {reduxForm}                                       from "redux-form";
import DataTable                                         from "../../shared/components/data_table/DataTable";
import {ALARM_MODEL_ARTICLE, ALARM_SENSOR, ASSEMBLY_API, ALARM_ARTICLE} from "../../constants/urlConstants";
import callAxios                                         from "../../services/api";
import {
	ALARM_MASTER_PAGE_CONSTANTS,
	alarmSensorTableColumns,
	defaultAlarmSensorTableData,
	defaultModelArticleTableData,
	defaultModelTableData,
	defaultArticleTableData,
	defaultProcessTableData,
	modelArticleTableColumns,
	modelTableColumns,
	articleTableColumns,
	processTableColumns
}                                                        from "./constants";

class MasterAlarm extends Component {

	constructor(props) {
		super(props);

		let {field, submissionState} = ALARM_MASTER_PAGE_CONSTANTS;

		this.child = React.createRef();
		this.mainTableRef = React.createRef();

		this.state = {
			columnsModelArticle: modelArticleTableColumns,
			columnsModel       : modelTableColumns,
			columnsArticle     : articleTableColumns,
			columnsProcess     : processTableColumns,
			dataModelArticle   : [...defaultModelArticleTableData],
			dataModel          : [...defaultModelTableData],
			dataArticle        : [...defaultArticleTableData],
			dataProcess        : [...defaultProcessTableData],
			columnsAlarmSensor : alarmSensorTableColumns,
			dataAlarmSensor    : [...defaultAlarmSensorTableData],
			formData           : {
				[field.definitionValue]: '000',
			},
			editMode           : false,
			submissionState    : submissionState.initial,   // -1: Submit/Save, 0: Submitting/Saving, 1: Submitted/Saved
		};
	}

	loadModelArticleTable = () => {
		let method  = 'POST';
		let url     = ASSEMBLY_API + ALARM_MODEL_ARTICLE;
		let params  = {
			"value_yn": 0
		};
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;

		callAxios(method, url, params).then(response => {
			try {
				let responseArray = response.data.data;
				let dataArray     = [];

				responseArray.map(item => {
					item = {
						[field.modelNm]  : item.model_nm ? item.model_nm.toString() : '',
						[field.modelCd]  : item.model_cd ? item.model_cd.toString() : '',
						[field.articleNm]: item.article_nm ? item.article_nm.toString() : '',
						[field.articleNo]: item.article_no ? item.article_no.toString() : '',
					};
					dataArray.push(item);
				});
				this.setState({
					dataModelArticle: dataArray,
				});
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	loadModelTable = () => {
		let method  = 'POST';
		let url     = ASSEMBLY_API + ALARM_MODEL_ARTICLE;
		let params  = {
			"value_yn": 0
		};
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;

		callAxios(method, url, params).then(response => {
			try {
				let responseArray = response.data.data;
				let dataArray     = [];
				responseArray.map(item => {
					item = {
						[field.modelNm]  : item.model_nm ? item.model_nm.toString() : '',
						[field.modelCd]  : item.model_cd ? item.model_cd.toString() : '',
					};
					dataArray.push(item);
				});
				this.setState({
					dataModel: dataArray,
				});
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	loadArticleTable = (data) => {
		let method  = 'POST';
		let url     = ASSEMBLY_API + ALARM_ARTICLE;
		let params  = {
			"model_cd": data && data.model_cd?data.model_cd:''
		};
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;

		callAxios(method, url, params).then(response => {
			try {
				let responseArray = response.data.data;
				let dataArray     = [];
				responseArray.map(item => {
					item = {
						[field.articleNm]: item.article_nm ? item.article_nm.toString() : '',
						[field.articleNo]: item.article_no ? item.article_no.toString() : '',
					};
					dataArray.push(item);
				});
				this.setState({
					dataArticle: dataArray,
				});
			} catch (e) {
				console.log("Error: ", e);
			}
		});

		/*callAxios(method, url, params).then(response => {
			try {
				let responseArray = response.data.data;
				let dataArray     = [];
				console.log("89 89 89 89 89 89 89");
				console.log("89 89 89 89 89 89 89");
				console.log("89 89 89 89 89 89 89");
				console.log("responseArray: ", responseArray);
				responseArray.map(item => {
					item = {
						[field.modelNm]  : item.model_nm ? item.model_nm.toString() : '',
						[field.modelCd]  : item.model_cd ? item.model_cd.toString() : '',
					};
					dataArray.push(item);
				});
				this.setState({
					dataModel: dataArray,
				});
			} catch (e) {
				console.log("Error: ", e);
			}
		});*/
	}

	loadAlarmSensorTable = () => {
		let method  = 'POST';
		let url     = ASSEMBLY_API + ALARM_SENSOR;
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;

		callAxios(method, url, {}).then(response => {
			try {
				let responseArray = response.data.data;
				let dataArray     = [];

				responseArray.map(item => {
					item = {
						[field.modelNm]  : item.model_nm ? item.model_nm : '0',
						[field.modelCd]  : item.model_cd ? item.model_cd : '0',
						[field.articleNm]: item.article_nm ? item.article_nm : '0',
						[field.articleNo]: item.article_no ? item.article_no : '0',
						[field.processNm]: item.process_nm ? item.process_nm : '0',
						[field.processCd]: item.process_cd ? item.process_cd : '0',

						[field.tempStandard]: `${item.temp_standard_from} \u279c ${item.temp_standard_to}`,
						[field.tempYellow]  : `${item.temp_yellow_first} \u279c ${item.temp_yellow_last}`,
						[field.tempRed]     : `${item.temp_red_first} \u279c ${item.temp_red_last}`,
						[field.presStandard]: `${item.pres_standard_from} \u279c ${item.pres_standard_to}`,
						[field.presYellow]  : `${item.pres_yellow_first} \u279c ${item.pres_yellow_last}`,
						[field.presRed]     : `${item.pres_red_first} \u279c ${item.pres_red_last}`,
						[field.curStandard] : `${item.cur_standard_from} \u279c ${item.cur_standard_to}`,
						[field.curYellow]   : `${item.cur_yellow_first} \u279c ${item.cur_yellow_last}`,
						[field.curRed]      : `${item.cur_red_first} \u279c ${item.cur_red_last}`,

						[field.tempStandardFrom]: item.temp_standard_from,
						[field.tempStandardTo]  : item.temp_standard_to,
						[field.tempYellowFirst] : item.temp_yellow_first,
						[field.tempYellowLast]  : item.temp_yellow_last,
						[field.tempRedFirst]    : item.temp_red_first,
						[field.tempRedLast]     : item.temp_red_last,
						[field.presStandardFrom]: item.pres_standard_from,
						[field.presStandardTo]  : item.pres_standard_to,
						[field.presYellowFirst] : item.pres_yellow_first,
						[field.presYellowLast]  : item.pres_yellow_last,
						[field.presRedFirst]    : item.pres_red_first,
						[field.presRedLast]     : item.pres_red_last,
						[field.curStandardFrom] : item.cur_standard_from,
						[field.curStandardTo]   : item.cur_standard_to,
						[field.curYellowFirst]  : item.cur_yellow_first,
						[field.curYellowLast]   : item.cur_yellow_last,
						[field.curRedFirst]     : item.cur_red_first,
						[field.curRedLast]      : item.cur_red_last,

						[field.definitionValue]: item.definition_value,
					};
					dataArray.push(item);
				});
				this.setState({
					dataAlarmSensor: dataArray,
				});
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	onModelArticleClick = (selectedRow) => {
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;
		this.setState({
			formData       : {
				...this.state.formData,
				[field.modelNm]        : selectedRow[field.modelNm],
				[field.modelCd]        : selectedRow[field.modelCd],
				[field.articleNm]      : selectedRow[field.articleNm],
				[field.articleNo]      : selectedRow[field.articleNo],
				[field.definitionValue]: '000',
			},
			editMode       : false,
			submissionState: ALARM_MASTER_PAGE_CONSTANTS.submissionState.initial,
		});
	};

	onModelClick = (selectedRow) => {
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;
		this.setState({
			formData       : {
				...this.state.formData,
				[field.modelNm]        : selectedRow[field.modelNm],
				[field.modelCd]        : selectedRow[field.modelCd],
				[field.articleNm]      : "",
				[field.articleNo]      : "",
				[field.definitionValue]: '000',
			},
			editMode       : false,
			submissionState: ALARM_MASTER_PAGE_CONSTANTS.submissionState.initial,
		});
	};

	onModelDeselect = (data) => {
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;
		this.setState({
			formData       : {
				...this.state.formData,
				[field.modelNm]        : "",
				[field.modelCd]        : "",
				[field.articleNm]      : "",
				[field.articleNo]      : "",
				[field.definitionValue]: '000',
			},
			dataArticle: [],
			dataProcess: [],
			editMode       : false,
			submissionState: ALARM_MASTER_PAGE_CONSTANTS.submissionState.initial,
		});
	}

	onArticleClick = (selectedRow) => {
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;
		this.setState({
			formData       : {
				...this.state.formData,
				[field.articleNm]      : selectedRow[field.articleNm],
				[field.articleNo]      : selectedRow[field.articleNo],
				[field.definitionValue]: '000',
			},
			editMode       : false,
			submissionState: ALARM_MASTER_PAGE_CONSTANTS.submissionState.initial,
		});
	}

	onArticleDeselect = (data) => {
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;
		this.setState({
			formData       : {
				...this.state.formData,
				[field.articleNm]      : "",
				[field.articleNo]      : "",
				[field.definitionValue]: '000',
			},
			editMode       : false,
			submissionState: ALARM_MASTER_PAGE_CONSTANTS.submissionState.initial,
		});
	}

	deselectMainTable = () => {
		let mainTable = this.mainTableRef;
		mainTable.current.table.deselectRow();
	}

	onProcessClick = (processCode, definitionValue) => {
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;

		let temp_standard_from = '0';
		let temp_standard_to   = '0';
		let temp_yellow_first  = '0';
		let temp_yellow_last   = '0';
		let temp_red_first     = '0';
		let temp_red_last      = '0';

		let pres_standard_from = '0';
		let pres_standard_to   = '0';
		let pres_yellow_first  = '0';
		let pres_yellow_last   = '0';
		let pres_red_first     = '0';
		let pres_red_last      = '0';

		let cur_standard_from = '0';
		let cur_standard_to   = '0';
		let cur_yellow_first  = '0';
		let cur_yellow_last   = '0';
		let cur_red_first     = '0';
		let cur_red_last      = '0';

		/*
		 Deselect main table
		 */
		let mainTable = this.mainTableRef;
		mainTable.current.table.deselectRow();

		for (let i = 0; i < definitionValue.length; ++i) {
			switch (i) {
				case 0:
					if (definitionValue.charAt(i) === '0') {
						temp_standard_from = '';
						temp_standard_to   = '';
						temp_yellow_first  = '';
						temp_yellow_last   = '';
						temp_red_first     = '';
						temp_red_last      = '';
					}
					break;
				case 1:
					if (definitionValue.charAt(i) === '0') {
						pres_standard_from = '';
						pres_standard_to   = '';
						pres_yellow_first  = '';
						pres_yellow_last   = '';
						pres_red_first     = '';
						pres_red_last      = '';
					}
					break;
				case 2:
					if (definitionValue.charAt(i) === '0') {
						cur_standard_from = '';
						cur_standard_to   = '';
						cur_yellow_first  = '';
						cur_yellow_last   = '';
						cur_red_first     = '';
						cur_red_last      = '';
					}
					break;
				default:
					console.log("Error", "Wrong Definition Value Format");
					break;
			}
		}
		this.setState({
			editMode: false,
			formData: {
				...this.state.formData,
				[field.processCd]       : processCode,
				[field.tempStandardFrom]: temp_standard_from,
				[field.tempStandardTo]  : temp_standard_to,
				[field.tempYellowFirst] : temp_yellow_first,
				[field.tempYellowLast]  : temp_yellow_last,
				[field.tempRedFirst]    : temp_red_first,
				[field.tempRedLast]     : temp_red_last,
				[field.presStandardFrom]: pres_standard_from,
				[field.presStandardTo]  : pres_standard_to,
				[field.presYellowFirst] : pres_yellow_first,
				[field.presYellowLast]  : pres_yellow_last,
				[field.presRedFirst]    : pres_red_first,
				[field.presRedLast]     : pres_red_last,
				[field.curStandardFrom] : cur_standard_from,
				[field.curStandardTo]   : cur_standard_to,
				[field.curYellowFirst]  : cur_yellow_first,
				[field.curYellowLast]   : cur_yellow_last,
				[field.curRedFirst]     : cur_red_first,
				[field.curRedLast]      : cur_red_last,
				[field.remark]          : '',
				[field.definitionValue] : definitionValue,
			},
		});
	};

	onProcessDeselect = (data) => {
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;
		this.setState({
			formData       : {
				...this.state.formData,
				[field.definitionValue]: '000',
			},
			editMode       : false,
			submissionState: ALARM_MASTER_PAGE_CONSTANTS.submissionState.initial,
		});
	}

	onAlarmSensorTableRowClick = (data) => {
		let {field, submissionState} = ALARM_MASTER_PAGE_CONSTANTS;
		let selectedRow              = data;
		this.setState({
			editMode       : true,
			submissionState: submissionState.initial,
			formData       : {
				...this.state.formData,
				[field.modelNm]         : selectedRow[field.modelNm],
				[field.modelCd]         : selectedRow[field.modelCd],
				[field.articleNo]       : selectedRow[field.articleNo],
				[field.articleNm]       : selectedRow[field.articleNm],
				[field.processNm]       : selectedRow[field.processNm],
				[field.processCd]       : selectedRow[field.processCd],
				[field.tempStandardFrom]: selectedRow[field.tempStandardFrom],
				[field.tempStandardTo]  : selectedRow[field.tempStandardTo],
				[field.tempYellowFirst] : selectedRow[field.tempYellowFirst],
				[field.tempYellowLast]  : selectedRow[field.tempYellowLast],
				[field.tempRedFirst]    : selectedRow[field.tempRedFirst],
				[field.tempRedLast]     : selectedRow[field.tempRedLast],
				[field.presStandardFrom]: selectedRow[field.presStandardFrom],
				[field.presStandardTo]  : selectedRow[field.presStandardTo],
				[field.presYellowFirst] : selectedRow[field.presYellowFirst],
				[field.presYellowLast]  : selectedRow[field.presYellowLast],
				[field.presRedFirst]    : selectedRow[field.presRedFirst],
				[field.presRedLast]     : selectedRow[field.presRedLast],
				[field.curStandardFrom] : selectedRow[field.curStandardFrom],
				[field.curStandardTo]   : selectedRow[field.curStandardTo],
				[field.curYellowFirst]  : selectedRow[field.curYellowFirst],
				[field.curYellowLast]   : selectedRow[field.curYellowLast],
				[field.curRedFirst]     : selectedRow[field.curRedFirst],
				[field.curRedLast]      : selectedRow[field.curRedLast],
				[field.definitionValue] : selectedRow[field.definitionValue],
			},
			dataArticle: [],
			dataProcess: [],
		});
		let params = {
			model_cd        : selectedRow[field.modelCd],
			article_no      : selectedRow[field.articleNo],
			process_cd      : selectedRow[field.processCd],
			definition_value: selectedRow[field.definitionValue],
		};
		//this.child.ref.current.wrapped.current.callChildLoadProcessList(params);
		this.child.ref.current.wrapped.current.onAlarmSensorTableRowClick(params.process_cd, params.definition_value);
	};

	handleSubmit = (values) => {
		let {initial, onGoing, done} = ALARM_MASTER_PAGE_CONSTANTS.submissionState;

		this.setState({
			submissionState: onGoing,
		});
		let {field} = ALARM_MASTER_PAGE_CONSTANTS;

		let definitionValue = values[field.definitionValue];
		let formData        = this.state.formData;
		let method          = 'POST';
		let url             = '/api/asc/masalarmsensor';
		if (values[field.processCd]) {
			for (let i = 0; i < definitionValue.length; i++) {
				if (definitionValue[i] > 0) {
					let standard_from = 0;
					let standard_to   = 0;
					let yellow_first  = 0;
					let yellow_last   = 0;
					let red_first     = 0;
					let red_last      = 0;
					let sensor_type   = i + 1;
					if (sensor_type == 1) {
						standard_from = values[field.tempStandardFrom];
						standard_to   = values[field.tempStandardTo];
						yellow_first  = values[field.tempYellowFirst];
						yellow_last   = values[field.tempYellowLast];
						red_first     = values[field.tempRedFirst];
						red_last      = values[field.tempRedLast];
					} else if (sensor_type == 2) {
						standard_from = values[field.presStandardFrom];
						standard_to   = values[field.presStandardTo];
						yellow_first  = values[field.presYellowFirst];
						yellow_last   = values[field.presYellowLast];
						red_first     = values[field.presRedFirst];
						red_last      = values[field.presRedLast];
					} else if (sensor_type == 3) {
						standard_from = values[field.curStandardFrom];
						standard_to   = values[field.curStandardTo];
						yellow_first  = values[field.curYellowFirst];
						yellow_last   = values[field.curYellowLast];
						red_first     = values[field.curRedFirst];
						red_last      = values[field.curRedLast];
					}
					let param = {
						"status"       : this.state.editMode ? "UPDATE" : "INSERT",
						"model_cd"     : formData[field.modelCd],
						"article_no"   : formData[field.articleNo],
						"process_cd"   : formData[field.processCd],
						"sensor_type"  : sensor_type,   //1: temp, 2: pressure, 3: curing time
						"standard_from": standard_from,
						"standard_to"  : standard_to,
						"yellow_first" : yellow_first,
						"yellow_last"  : yellow_last,
						"red_first"    : red_first,
						"red_last"     : red_last,
						"time_first"   : '0',
						"time_last"    : '0',
						"remark"       : values[field.remark] ? values[field.remark] : '',
						"username"     : "truongho"
					};
					callAxios(method, url, param).then(response => {
						//Update parent combobox items
						try {
							if (response.status == 200) {
								if (!this.state.editMode){
									this.loadModelArticleTable();
									this.loadModelTable();
									this.loadArticleTable({model_cd: formData[field.modelCd]});
								}
								this.loadAlarmSensorTable();

								//reload process loading
								this.child.ref.current.wrapped.current.callChildLoadProcessList({
									model_cd  : formData[field.modelCd],
									article_no: formData[field.articleNo],
								});
								this.setState({
									submissionState: done,
								});
								setTimeout(() => {
									this.setState((state, props) => ({
										formData       : {
											...state.formData,
											[field.tempStandardFrom]: values[field.tempStandardFrom],
											[field.tempStandardTo]  : values[field.tempStandardTo],
											[field.tempYellowFirst] : values[field.tempYellowFirst],
											[field.tempYellowLast]  : values[field.tempYellowLast],
											[field.tempRedFirst]    : values[field.tempRedFirst],
											[field.tempRedLast]     : values[field.tempRedLast],

											[field.presStandardFrom]: values[field.presStandardFrom],
											[field.presStandardTo]  : values[field.presStandardTo],
											[field.presYellowFirst] : values[field.presYellowFirst],
											[field.presYellowLast]  : values[field.presYellowLast],
											[field.presRedFirst]    : values[field.presRedFirst],
											[field.presRedLast]     : values[field.presRedLast],

											[field.curStandardFrom]: values[field.curStandardFrom],
											[field.curStandardTo]  : values[field.curStandardTo],
											[field.curYellowFirst] : values[field.curYellowFirst],
											[field.curYellowLast]  : values[field.curYellowLast],
											[field.curRedFirst]    : values[field.curRedFirst],
											[field.curRedLast]     : values[field.curRedLast],

											[field.remark]         : values[field.remark],
											[field.definitionValue]: values[field.definitionValue],
										},
										submissionState: initial,
										editMode       : false,
									}));
								}, 1000);
							}
						} catch (e) {
							console.log("Error: ", e);
						}
					});
				}
			}
		} else {
			this.setState({
				submissionState: initial,
			});
		}

		event.preventDefault();
	};

	onReset = () => {
		let {field, submissionState} = ALARM_MASTER_PAGE_CONSTANTS;
		this.setState((state, props) => ({
			formData       : {
				[field.modelNm]  : state.formData[field.modelNm],
				[field.modelCd]  : state.formData[field.modelCd],
				[field.articleNm]: state.formData[field.articleNm],
				[field.articleNo]: state.formData[field.articleNo],

				[field.definitionValue]: '000',
			},
			editMode       : false,
			submissionState: submissionState.initial,
		}));
	};

	componentDidMount() {
		this.loadModelArticleTable();
		this.loadModelTable();
		this.loadAlarmSensorTable();
	}

	render() {
		let {columnsModelArticle, columnsModel, columnsArticle, columnsProcess, dataModelArticle, dataModel, dataArticle, dataProcess, columnsAlarmSensor, dataAlarmSensor, formData, editMode, submissionState} = this.state;
		return (
			<Container className="dashboard">
				<Row>
					<AlarmMasterForm ref={node => this.child = node}
					                 columnsModelArticle={columnsModelArticle}
					                 columnsModel={columnsModel}
					                 columnsArticle={columnsArticle}
					                 columnsProcess={columnsProcess}
					                 dataModelArticle={dataModelArticle}
					                 dataModel={dataModel}
					                 dataArticle={dataArticle}
					                 dataProcess={dataProcess}
					                 onModelArticleClick={this.onModelArticleClick}
					                 onModelClick={this.onModelClick}
					                 onModelDeselect={this.onModelDeselect}
					                 onArticleClick={this.onArticleClick}
					                 onArticleDeselect={this.onArticleDeselect}
					                 onProcessClick={this.onProcessClick}
					                 onProcessDeselect={this.onProcessDeselect}
					                 formData={formData}
					                 onSubmit={this.handleSubmit}
					                 onReset={this.onReset}
					                 editMode={editMode}
					                 submissionState={submissionState}
					                 loadArticleTable={this.loadArticleTable}
					                 deselectMainTable={this.deselectMainTable}
					/>
				</Row>
				<Row style={{marginTop: 50}}>
					<Col md={12} lg={12}>
						<DataTable id="mainTable" columns={columnsAlarmSensor} data={dataAlarmSensor}
						           options={{
							           height         : "40em",
							           columnVertAlign: "bottom"
						           }}
						           onRowClick={this.onAlarmSensorTableRowClick}
						           ref={this.mainTableRef}
						/>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default reduxForm({
	form: ALARM_MASTER_PAGE_CONSTANTS.alarmMasterFormName,
})(MasterAlarm);
