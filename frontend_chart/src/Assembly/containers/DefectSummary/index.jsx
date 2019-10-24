import React, {Component}             from "react";
import {reduxForm}                    from "redux-form";
import {Container}                    from "reactstrap";
import FilterRange                    from "../../shared/components/filter_range/FilterRange";
import {changeDateToUnix}             from "../../shared/utils/Utilities";
import HourBar                        from "./components/HourBar";
import DefectDataTable                from "./components/DefectDataTable";
import FilterTypeBar                  from "./components/FilterTypeBar";
import {ASSEMBLY_API, DEFECT_SUMMARY} from "../../constants/urlConstants";
import callAxios                      from "../../services/api";
import {FILTER_TYPE}                  from "./constants";

class DefectSummary extends Component {
	constructor(props) {
		super(props);

		this.state = {
			filterFromDate: changeDateToUnix(new Date()),
			filterToDate  : changeDateToUnix(new Date(), "end"),
			filterLine    : '',
			filterModel   : '',
			filterArticle : '',
			defectData    : [],
			selectedHour  : 'All',
			filterType    : FILTER_TYPE.date,
		};
	}

	handleTypeFilterChange = (type) => {
		this.setState((state, props) => ({
			filterType: type,
		}));
	};

	handleHourFilterChange = (selectedHour) => {
		this.setState((state, props) => ({
			selectedHour: selectedHour,
		}));
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
		    || prevState.filterArticle !== this.state.filterArticle || prevState.selectedHour
		    !== this.state.selectedHour
		    || prevState.filterType !== this.state.filterType) {
			this.getDataTable();
		}
	}

	componentDidMount() {
		this.getDataTable();
	}

	getDataTable = () => {
		let {filterType, selectedHour, filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		if (filterLine != '' && filterModel != '' && filterArticle != '' && filterType != ''){
			let method                                                                                           = 'POST';
			let url                                                                                              = ASSEMBLY_API
			                                                                                                       + DEFECT_SUMMARY;

			let params = {
				"factory"   : "",
				"line"      : filterLine,
				"process"   : "",
				"model"     : filterModel,
				"article_no": filterArticle,
				"from_date" : filterFromDate,
				"to_date"   : filterToDate,
				"time"      : selectedHour,
				"data_type" : filterType
			};
			console.log("params 102: ", params);
			callAxios(method, url, params).then(response => {
				console.log("response 104: ", response);
				if (response && response.data && response.data.data) {
					this.setState((state, props) => ({
						defectData: response.data.data,
					}));
				}
			});
		}
	};


	render() {
		let {selectedHour, filterType, defectData} = this.state;
		return (
			<Container className="dashboard">
				<h3>Dashboard/Defect Summary</h3>

				<div style={{paddingTop: 30}}></div>
				<FilterRange handleFilterFromDateChange={this.handleFilterFromDateChange}
				             handleFilterToDateChange={this.handleFilterToDateChange}
				             handleFilterModelChange={this.handleFilterModelChange}
				             handleFilterLineChange={this.handleFilterLineChange}
				             handleFilterArticleChange={this.handleFilterArticleChange}
				             screenName="defectsummary"
				/>

				<div style={{paddingTop: 30}}></div>
				<FilterTypeBar filterType={filterType} handleTypeFilterChange={this.handleTypeFilterChange}/>

				<HourBar selectedHour={selectedHour} handleHourFilterChange={this.handleHourFilterChange}/>

				<div style={{paddingTop: 10}}></div>
				<DefectDataTable defectData={defectData} filterType={filterType}/>
			</Container>

		);
	}
}

export default reduxForm({
	form: "DefectSummary"
})(DefectSummary);
