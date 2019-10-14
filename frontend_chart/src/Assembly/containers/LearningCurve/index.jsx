import React, {Component}    from "react";
import {withRouter}          from "react-router-dom";
import FilterRange           from "./components/FilterRangeForLearningCurve";
import {
	Col,
	Container,
	Row
}                            from "reactstrap";
import {changeDateToUnix}    from "../../shared/utils/Utilities";
import DataTable             from "../../shared/components/data_table/DataTable";
import {
	chartOptions,
	defaultModelTableData,
	defaultProcessTableData,
	LEARNING_CURVE_CONSTANTS,
	titleFormater,
}                            from "./constants";
import LearningCurveChart    from "./components/LearningCurveChart";
import {
	ASSEMBLY_API,
	LEARNING_CURVE_CHART,
	LEARNING_CURVE_MODEL,
	LEARNING_CURVE_PROCESS,
	LEARNING_CURVE_PROCESS_UPDATE,
}                            from "../../constants/urlConstants";
import callAxios             from "../../services/api";
import {reactFormatter}      from "react-tabulator";
import ButtonSubmitFormatter from "./components/ButtonSubmitFormatter";
import {
	ARRAY_LINES,
	ARRAY_MODELS
}                            from "../../constants/propertyConstants";

class LearningCurve extends Component {
	constructor(props) {
		super(props);

		let _this = this;

		let modelTableColumns = [
			{
				title         : "MODEL",
				field         : LEARNING_CURVE_CONSTANTS.field.modelName,
				width         : '25%',
				align         : "center",
				headerFilter  : "input",
				titleFormatter: titleFormater
			},
			{title: "Model Number", field: LEARNING_CURVE_CONSTANTS.field.modelNo, visible: false},
			{title: "Line Code", field: LEARNING_CURVE_CONSTANTS.field.lineCode, visible: false},
			{
				title         : "STITCHING",
				field         : LEARNING_CURVE_CONSTANTS.field.stitching,
				width         : '15%',
				align         : "center",
				titleFormatter: titleFormater,
				headerSort    : false
			},
			{
				title         : "SHOEMAKING",
				field         : LEARNING_CURVE_CONSTANTS.field.shoemaking,
				width         : '18%',
				align         : "center",
				titleFormatter: titleFormater,
				headerSort    : false
			},
			{
				title         : "TOTAL",
				field         : LEARNING_CURVE_CONSTANTS.field.total,
				width         : '15%',
				align         : "center",
				titleFormatter: titleFormater,
				headerSort    : false,
				/*formatter: function(cell, formatterParams){
				 cell.getElement().style.backgroundColor = "#F84E4E";
				 }*/
			},
			{
				title         : "TARGET QTY",
				field         : LEARNING_CURVE_CONSTANTS.field.basicTargetQty,
				width         : '15%',
				align         : "center",
				titleFormatter: titleFormater,
				editor        : "input",
				headerSort    : false
			},
			{title: "Work Date", field: LEARNING_CURVE_CONSTANTS.field.workYMD, visible: false},
			{
				title     : "",
				field     : LEARNING_CURVE_CONSTANTS.field.modelSubmissionState,
				width     : '10%',
				align     : "center",
				formatter : reactFormatter(<ButtonSubmitFormatter onOkClicked={(rowData) => {
					this.handleModelSubmit(rowData);
				}}/>),
				headerSort: false
			},
		];

		let processTableColumns = [
			{
				title         : "PROCESS",
				field         : LEARNING_CURVE_CONSTANTS.field.processName,
				width         : '50%',
				align         : "center",
				headerFilter  : "input",
				titleFormatter: titleFormater,
			},
			{title: "Process Code", field: LEARNING_CURVE_CONSTANTS.field.processCode, visible: false},
			{
				title         : "DAYS",
				field         : LEARNING_CURVE_CONSTANTS.field.workingDays,
				width         : '50%',
				align         : "center",
				headerSort    : false,
				titleFormatter: titleFormater,
			},
			{title: "Model Number", field: LEARNING_CURVE_CONSTANTS.field.modelNo, visible: false},
			{title: "Line Code", field: LEARNING_CURVE_CONSTANTS.field.lineCode, visible: false},
			{title: "Basic Target Qty", field: LEARNING_CURVE_CONSTANTS.field.basicTargetQty, visible: false},
			{
				title    : "Actual Qty",
				field    : LEARNING_CURVE_CONSTANTS.field.actualQty,
				visible  : false,
				formatter: this.formatTableRow
			},
		];

		this.state = {
			processTableColumns : processTableColumns,
			processTableData    : defaultProcessTableData,
			//modelTableColumns  : modelTableColumns,
			modelTableColumns   : modelTableColumns,
			modelTableData      : defaultModelTableData,
			chartInitialData    : [],
			chartOptions        : chartOptions,
			chartData           : [],
			selectedProcess     : {},
			formData            : {},
			filterFromDate      : changeDateToUnix(new Date(), "start"),//for filter
			filterToDate        : changeDateToUnix(new Date(), "end"),
			filterLine          : ARRAY_LINES[0],
			filterModel         : ARRAY_MODELS[0],
			submissionState     : LEARNING_CURVE_CONSTANTS.submissionState.initial,
			modelSubmissionState: LEARNING_CURVE_CONSTANTS.submissionState.initial,
		};
		// this.loadProcessTable();
		// this.loadModelTable();
	}

	formatTableRow = (cell, formatterParams) => {
		let {selectedProcess} = this.state;
		let rowData           = cell._cell.row.data;
		if (selectedProcess.process_cd === rowData.process_cd && selectedProcess.model_cd === rowData.model_cd) {
			cell.getRow().getElement().style.backgroundColor = '#02406C';
		}
	};

	handleModelSubmit = (rowData) => {
		/*
		 basic_target_qty: 100
		 line_cd: "2030"
		 model_cd: "AUZ71"
		 model_nm: "PRINCESS"
		 shoemaking: 61
		 stitching: 12
		 submitButton: undefined
		 total: 73
		 */
		let {modelTableColumns, modelTableData}                      = this.state;
		rowData[LEARNING_CURVE_CONSTANTS.field.modelSubmissionState] = LEARNING_CURVE_CONSTANTS.submissionState.onGoing;
		modelTableData[0]                                            = rowData;
		this.setState((state, props) => ({
			modelTableData: modelTableData,
		}));
		let method = 'POST';
		let url    = ASSEMBLY_API + LEARNING_CURVE_PROCESS_UPDATE;
		let params = {
			"status"          : "UPDATE",
			"model"           : rowData[LEARNING_CURVE_CONSTANTS.field.modelNo],
			"line"            : rowData[LEARNING_CURVE_CONSTANTS.field.lineCode],
			"basic_target_qty": rowData[LEARNING_CURVE_CONSTANTS.field.basicTargetQty],
			"work_ymd"        : rowData[LEARNING_CURVE_CONSTANTS.field.workYMD],
		};
		callAxios(method, url, params).then(response => {
			this.loadProcessTable();
			this.loadModelTable();

			rowData[LEARNING_CURVE_CONSTANTS.field.modelSubmissionState] = LEARNING_CURVE_CONSTANTS.submissionState.done;
			modelTableData[0]                                            = rowData;
			this.setState((state, props) => ({
				modelTableData: modelTableData,
			}));
		});
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		console.log("componentDidUpdate 198 198 198");
		if (prevState.filterFromDate !== this.state.filterFromDate
		    || prevState.filterToDate !== this.state.filterToDate
		    || prevState.filterLine !== this.state.filterLine
		    || prevState.filterModel !== this.state.filterModel) {
			console.log("205 205");
			this.loadProcessTable();
			this.loadModelTable();
		}
	}

	loadModelTable = () => {
		let {filterLine, filterModel, filterFromDate, filterToDate} = this.state;
		let method                                                  = 'POST';
		let url                                                     = ASSEMBLY_API + LEARNING_CURVE_MODEL;
		let params                                                  = {
			"factory"   : "",
			"line"      : filterLine.value,
			"process"   : "",
			// "model"     : filterModel.value,
			"article_no": "",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};
		callAxios(method, url, params).then(response => {
			try {
				let data           = response.data.data;
				let modelTableData = [];
				data.map(item => {
					modelTableData.push({
						[LEARNING_CURVE_CONSTANTS.field.modelName]           : item.model_nm,
						[LEARNING_CURVE_CONSTANTS.field.modelNo]             : item.model_cd,
						[LEARNING_CURVE_CONSTANTS.field.lineCode]            : item.line_cd,
						[LEARNING_CURVE_CONSTANTS.field.stitching]           : item.stitching,
						[LEARNING_CURVE_CONSTANTS.field.shoemaking]          : item.shoemaking,
						[LEARNING_CURVE_CONSTANTS.field.total]               : parseInt(item.stitching)
						                                                       + parseInt(item.shoemaking),
						[LEARNING_CURVE_CONSTANTS.field.basicTargetQty]      : item.basic_target_qty,
						[LEARNING_CURVE_CONSTANTS.field.workYMD]             : item.work_ymd,
						[LEARNING_CURVE_CONSTANTS.field.modelSubmissionState]: LEARNING_CURVE_CONSTANTS.submissionState.initial
					});
				});
				this.setState((state, props) => ({
					modelTableData: modelTableData,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	loadProcessTable = () => {
		let {filterLine, filterModel} = this.state;
		let method                    = 'POST';
		let url                       = ASSEMBLY_API + LEARNING_CURVE_PROCESS;
		let params                    = {
			"factory"   : "",
			"line"      : filterLine.value,
			"process"   : "",
			"model"     : filterModel.value,
			"article_no": "",
			"from_date" : changeDateToUnix(new Date()),
			"to_date"   : changeDateToUnix(new Date(), "end")
		};
		console.log("params: ", params);
		console.log("url: ", url);

		callAxios(method, url, params).then(response => {
			try {
				console.log("response: ", response);
				let data              = response.data.data;
				let processTableData  = [];
				//{process_cd: "20103", process_nm: "Computer Stitching", model_no: "AUZ71",
				let {selectedProcess} = this.state;
				data.map((item, index) => {
					processTableData.push({
						[LEARNING_CURVE_CONSTANTS.field.processName]   : item.process_nm,
						[LEARNING_CURVE_CONSTANTS.field.processCode]   : item.process_cd,
						[LEARNING_CURVE_CONSTANTS.field.workingDays]   : item.working_days,
						[LEARNING_CURVE_CONSTANTS.field.modelNo]       : item.model_no,
						[LEARNING_CURVE_CONSTANTS.field.lineCode]      : filterLine.value,
						[LEARNING_CURVE_CONSTANTS.field.basicTargetQty]: item.basic_target_qty,
						[LEARNING_CURVE_CONSTANTS.field.actualQty]     : item.actual_qty,
					});
					if (index === data.length - 1) {    // Select Last Process by default to load chart
						selectedProcess = {
							[LEARNING_CURVE_CONSTANTS.field.processName]   : item.process_nm,
							[LEARNING_CURVE_CONSTANTS.field.processCode]   : item.process_cd,
							[LEARNING_CURVE_CONSTANTS.field.workingDays]   : item.working_days,
							[LEARNING_CURVE_CONSTANTS.field.modelNo]       : item.model_no,
							[LEARNING_CURVE_CONSTANTS.field.lineCode]      : filterLine.value,
							[LEARNING_CURVE_CONSTANTS.field.basicTargetQty]: item.basic_target_qty,
							[LEARNING_CURVE_CONSTANTS.field.actualQty]     : item.actual_qty,
						};
					}
				});
				this.loadLearningCurveChart(selectedProcess);
				this.setState((state, props) => ({
					processTableData: processTableData,
					selectedProcess : selectedProcess,
					formData        : {
						...state.formData,
						[LEARNING_CURVE_CONSTANTS.field.basicTargetQty]: selectedProcess[LEARNING_CURVE_CONSTANTS.field.basicTargetQty],
					},
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	onProcessRowClick = (data) => {
		let selectedRow = data;
		this.loadLearningCurveChart(selectedRow);
		this.setState((state, props) => ({
			formData       : {
				...state.formData,
				[LEARNING_CURVE_CONSTANTS.field.basicTargetQty]: selectedRow[LEARNING_CURVE_CONSTANTS.field.basicTargetQty],
			},
			selectedProcess: selectedRow,
		}));
	};

	onModelArticleClick = (data) => {

	};

	handleSubmit = (values) => {
		if (this.isOKClicked && Object.keys(this.state.selectedProcess).length !== 0) {
			/*
			 basic_target_qty: 1260
			 dateRadio: "1"
			 */
			let {filterLine, filterModel, selectedProcess} = this.state;
			let method                                     = 'POST';
			let url                                        = ASSEMBLY_API + LEARNING_CURVE_PROCESS_UPDATE;
			let params                                     = {
				"status"          : "UPDATE",
				"process_cd"      : selectedProcess.process_cd,
				"model"           : selectedProcess.model_no,
				"line"            : selectedProcess.line_cd,
				"basic_target_qty": +values[LEARNING_CURVE_CONSTANTS.field.basicTargetQty],
				// "actual_qty"      : selectedProcess.actual_qty,
				"work_ymd"        : filterModel.workYMD,
			};
			this.setState((state, props) => ({
				selectedProcess: {
					...this.state.selectedProcess,
					[LEARNING_CURVE_CONSTANTS.field.basicTargetQty]: values[LEARNING_CURVE_CONSTANTS.field.basicTargetQty]
				},
				submissionState: LEARNING_CURVE_CONSTANTS.submissionState.onGoing,
			}));
			callAxios(method, url, params).then(response => {
				this.loadProcessTable();
				this.loadModelTable();
				this.setState((state, props) => ({
					submissionState: LEARNING_CURVE_CONSTANTS.submissionState.done,
				}));
				setTimeout(() => {
					this.setState((state, props) => ({
						submissionState: LEARNING_CURVE_CONSTANTS.submissionState.initial,
					}));
				}, 1000);
			});
		}
	};

	changeIsOKClicked = (value) => {
		this.isOKClicked = value;
	};

	loadLearningCurveChart = (selectedProcess) => {
		let method = 'POST';
		let url    = ASSEMBLY_API + LEARNING_CURVE_CHART;
		let params = {
			"factory"   : "",
			"line"      : selectedProcess.line_cd,
			"process"   : selectedProcess.process_cd,
			"model"     : selectedProcess.model_no,
			"article_no": "",
			"from_date" : changeDateToUnix(new Date()),
			"to_date"   : changeDateToUnix(new Date(), "end")
		};

		callAxios(method, url, params).then(response => {
			try {
				let chartData = response.data.data;
				this.setState((state, props) => ({
					chartData: chartData,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	handleFilterFromDateChange = (newValue) => {
		this.setState((state, props) => ({
			filterFromDate: changeDateToUnix(newValue),
		}));
	};

	handleFilterToDateChange  = (newValue) => {
		this.setState((state, props) => ({
			filterToDate: changeDateToUnix(newValue, "end"),
		}));
	};
	handleFilterLineChange    = (newValue) => {
		this.setState((state, props) => ({
			filterLine : newValue,
			filterModel: ARRAY_MODELS[0]
		}));
	};
	handleFilterModelChange   = (newValue) => {
		this.setState((state, props) => ({
			filterModel: newValue,
		}));
	};
	handleFilterArticleChange = (newValue) => {
		this.setState((state, props) => ({
			filterArticle: changeDateToUnix(newValue),
		}));
	};

	render() {
		let {
			    processTableColumns, processTableData,
			    modelTableColumns, modelTableData,
			    chartInitialData, chartOptions, chartData,
			    formData, selectedProcess, submissionState
		    } = this.state;
		return (
			<Container className="dashboard">
				<h3>Dashboard/Learning Curve</h3>
				<hr/>
				<FilterRange handleFilterFromDateChange={this.handleFilterFromDateChange}
				             handleFilterToDateChange={this.handleFilterToDateChange}
				             handleFilterModelChange={this.handleFilterModelChange}
				             handleFilterLineChange={this.handleFilterLineChange}
				             handleFilterArticleChange={this.handleFilterArticleChange}
				             formData={formData}
				             onSubmit={this.handleSubmit}
				             changeIsOKClicked={this.changeIsOKClicked}
				             selectedProcess={selectedProcess}
				             submissionState={submissionState}
				             screenName="learningcurve"
				/>
				<hr/>
				<div className="form form--preview d-flex" style={{minheight: 600, marginTop: -35, paddingLeft: 20}}>

					<div style={{position: 'relative', width: '48%', minHeight: 600, backgroundColor: '#1E2229'}}>
						<Row>
							<Col md={5} lg={5} style={{minHeight: 300}}>
								<DataTable id="processTable" columns={processTableColumns} data={processTableData}
								           options={{
									           border: "none",
								           }}
								           onRowClick={this.onProcessRowClick}/>
							</Col>
							<Col md={7} lg={7} style={{minHeight: 300, marginTop: 50}}>
								<p style={{fontWeight: 'bold'}}>PROCESS CHART</p>
								<LearningCurveChart showLegend={true} chartInitialData={chartInitialData}
								                    chartOptions={chartOptions} chartData={chartData}/>
							</Col>
						</Row>
					</div>
					<div style={{position: 'relative', width: '0.01%'}}>
					</div>
					<div style={{position: 'relative', width: '48%', minHeight: 600, backgroundColor: '#1E2229'}}>
						<Row>
							<Col md={12} lg={12}>
								<DataTable id="learningCurve" columns={modelTableColumns} data={modelTableData}
								           options={{
									           border: "none",
								           }} onRowClick={this.onModelArticleClick}/>
							</Col>
						</Row>
					</div>
				</div>
			</Container>
		);
	}
}

export default withRouter(LearningCurve);
