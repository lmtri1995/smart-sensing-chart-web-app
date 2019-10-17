import React, {Component}                   from 'react';
import {withRouter}                         from "react-router-dom";
import {Col, Container}                     from "reactstrap";
import FilterRange                          from "../../shared/components/filter_range/FilterRange";
import {changeDateToUnix}                   from "../../shared/utils/Utilities";
import {ASSEMBLY_API, MACHINE_ALARM_STATUS} from "../../constants/urlConstants";
import callAxios                            from "../../services/api";
import MachineAlarmStatusTable              from "./components/MachineAlarmStatusTable";

class MachineAlarmStatus extends Component {
	constructor(props) {
		super(props);
		this.state = {
			machineAlarmData: [],
			filterFromDate  : changeDateToUnix(new Date()),
			filterToDate    : changeDateToUnix(new Date(), "end"),
			filterLine      : '',
			filterModel     : '',
			filterArticle   : ''
		};
		this.loadMachineAlarmTable();
	}

	loadMachineAlarmTable = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method                                                                 = 'POST';
		let url                                                                    = ASSEMBLY_API
		                                                                             + MACHINE_ALARM_STATUS;
		let params                                                                 = {
			"factory"   : "",
			"line"      : filterLine,
			"model"     : filterModel,
			"article_no": filterArticle,
			"process"   : "",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};
		/*let params                                                                 = {
			"factory"   : "",
			"line"      : "",
			"model"     : "",
			"article_no": "",
			"process"   : "",
			"from_date" : 0,
			"to_date"   : 0
		};*/

		console.log("params: ", params);
		callAxios(method, url, params).then(response => {
			try {
				console.log("response: ", response);
				let machineAlarmData = response.data.data;
				this.setState((state, props) => ({
					machineAlarmData: machineAlarmData,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.filterArticle !== this.state.filterArticle || prevState.filterFromDate
		    !== this.state.filterFromDate
		    || prevState.filterToDate !== this.state.filterToDate
		    || prevState.filterLine !== this.state.filterLine || prevState.filterModel !== this.state.filterModel
		    || prevState.filterArticle !== this.state.filterArticle) {
			//filterArticle: ""
			// filterFromDate: 1563160349
			// filterLine: ""
			// filterModel: ""
			// filterToDate: 1563937949
			this.loadMachineAlarmTable();
		}
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

	render() {
		let {machineAlarmData} = this.state;
		return (
			<Container className="dashboard">
				<h3>DASHBOARD / MACHINE ALARM STATUS</h3>
				<hr/>
				<FilterRange handleFilterFromDateChange={this.handleFilterFromDateChange}
				             handleFilterToDateChange={this.handleFilterToDateChange}
				             handleFilterModelChange={this.handleFilterModelChange}
				             handleFilterLineChange={this.handleFilterLineChange}
				             handleFilterArticleChange={this.handleFilterArticleChange}
				             screenName="machinealarmstatus"
				/>
				<hr/>
				<Col md={12} lg={12}>
					<MachineAlarmStatusTable data={machineAlarmData}/>
				</Col>
			</Container>
		);
	}
}

export default withRouter(MachineAlarmStatus);
