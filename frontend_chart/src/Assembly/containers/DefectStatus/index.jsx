import React, {Component}                                       from "react";
import {reduxForm}                                              from "redux-form";
import {Col, Container, Row}                                    from "reactstrap";
import FilterRange                                              from "../../shared/components/filter_range/FilterRange";
import ChartArea                                                from "./components/ChartArea";
import DefectDataTable                                          from "./components/DefectDataTable";
import {changeDateToUnix}                                       from "../../shared/utils/Utilities";
import {ASSEMBLY_API, DEFECT_CHART_STATUS, DEFECT_WORKING_HOUR} from "../../constants/urlConstants";
import callAxios                                                from "../../services/api";
import DataExporter                                             from "../../shared/components/data_table/DataExporter";

class DefectStatus extends Component {
	constructor(props) {
		super(props);

		this.state = {
			filterFromDate        : changeDateToUnix(new Date()),
			filterToDate          : changeDateToUnix(new Date(), "end"),
			filterLine            : '',
			filterModel           : '',
			filterArticle         : '',
			chartData             : [],
			defectDataArray       : [],
			defectWorkingHourArray: [],
		};
	}

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
			filterLine: newValue.value,
		}));
	};
	handleFilterModelChange   = (newValue) => {
		this.setState((state, props) => ({
			filterModel: newValue.value,
		}));
	};
	handleFilterArticleChange = (newValue) => {
		this.setState((state, props) => ({
			filterArticle: newValue.value,
		}));
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.filterArticle !== this.state.filterArticle || prevState.filterFromDate
		    !== this.state.filterFromDate
		    || prevState.filterToDate !== this.state.filterToDate
		    || prevState.filterLine !== this.state.filterLine || prevState.filterModel !== this.state.filterModel
		    || prevState.filterArticle !== this.state.filterArticle) {
			this.getChartData();
			this.getDefectTableData();
		}
	}

	componentDidMount() {
		this.getChartData();
		this.getDefectTableData();
	}

	getChartData() {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method                                                                 = 'POST';
		let url                                                                    = ASSEMBLY_API + DEFECT_CHART_STATUS;
		let params                                                                 = {
			"factory"   : "",
			"line"      : "",
			"process"   : "",
			"model"     : "",
			"article_no": "",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};
		callAxios(method, url, params).then(response => {
			try {
				let defectDataArray = response.data.data;
				this.setState((state, props) => ({
					defectDataArray: defectDataArray,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	getDefectTableData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method                                                                 = 'POST';
		let url                                                                    = ASSEMBLY_API + DEFECT_WORKING_HOUR;
		let params                                                                 = {
			"factory"   : "",
			"line"      : "",
			"process"   : "",
			"model"     : "",
			"article_no": "",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};
		callAxios(method, url, params).then(response => {
			try {
				let defectWorkingHourArray = response.data.data;
				this.setState((state, props) => ({
					defectWorkingHourArray: defectWorkingHourArray,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	render() {
		let {defectDataArray, defectWorkingHourArray} = this.state;
		return (
			<Container className="dashboard">
				<h3>Dashboard/Defect Status</h3>
				<hr/>
				<FilterRange handleFilterFromDateChange={this.handleFilterFromDateChange}
				             handleFilterToDateChange={this.handleFilterToDateChange}
				             handleFilterModelChange={this.handleFilterModelChange}
				             handleFilterLineChange={this.handleFilterLineChange}
				             handleFilterArticleChange={this.handleFilterArticleChange}
				             screenName="defectstatus"
				/>
				<hr/>
				<Row>
					<Col md={5} lg={5}>
					</Col>
					<Col md={5} lg={5}>
						<span style={{color: '#BEBEBE'}}>Total Working Hour: 92 Hours</span>
					</Col>
					<Col md={2} lg={2}>
						<div style={{marginLeft: 100}}>
							<DataExporter/>
						</div>

					</Col>
				</Row>
				<Row>
					<Col md={12} lg={12}>
						<ChartArea type="temp" chartData={defectDataArray} showLegend={true}/>
					</Col>
				</Row>
				<hr/>
				<Row>
					<Col md={12} lg={12}>
						<DefectDataTable defectWorkingHourArray={defectWorkingHourArray}/>
					</Col>
				</Row>
			</Container>

		);
	}
}

export default reduxForm({
	form: "DefectStatus"
})(DefectStatus);
