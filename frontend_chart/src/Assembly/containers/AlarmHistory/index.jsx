import React, {Component}            from 'react';
import {withRouter}                  from "react-router-dom";
import {Col, Container}                                from "reactstrap";
import FilterRange                                     from "../../shared/components/filter_range/FilterRange";
import {changeDateToUnix}                              from "../../shared/utils/Utilities";
import {ASSEMBLY_API, ALARM_HISTORY}                   from "../../constants/urlConstants";
import callAxios                                       from "../../services/api";
import AlarmHistoryTable                               from "./components/AlarmHistoryTable";
import DataExporter                                    from "../../shared/components/data_table/DataExporter";
import {storeAlarmHistoryData, storeDefectSummaryData} from "../../redux/actions/excelDataActions";
import connect                                         from "react-redux/es/connect/connect";
import {ARROW_ICON}                                    from "../../constants/propertyConstants";

class AlarmHistory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alarmHistoryData: [],
			filterFromDate  : changeDateToUnix(new Date()),
			filterToDate    : changeDateToUnix(new Date(), "end"),
			filterLine      : '',
			filterModel     : '',
			filterArticle   : ''
		};
		//this.loadMachineAlarmTable();
	}

	handleExcelData = (alarmData) => {
		let result = [];
		result[0] = ['PROCESS', 'DATE', 'TIME', 'SENSOR_TYPE', 'SENSOR_NUMBER', 'STANDARD', 'VALUE', 'ALARM', 'MODEL', 'ARTICLE'];
		for (let i = 0; i < alarmData.length; i++){
			let alarmItem = alarmData[i];
			let standard = alarmItem.standard_from.toString().concat(ARROW_ICON, alarmItem.standard_to);
			result[i+1] = [alarmItem.process_nm, alarmItem.alarm_date, alarmItem.alarm_time, alarmItem.sensor_type, alarmItem.sensor_no, standard, alarmItem.value, alarmItem.alarm, alarmItem.model_nm, alarmItem.article_nm];
		}
		return result;
	}

	loadMachineAlarmData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method                                                                 = 'POST';
		let url                                                                    = ASSEMBLY_API + ALARM_HISTORY;
		let params                                                                 = {
			"factory"   : "",
			"line"      : "",
			"process"   : "",
			"model"     : "",
			"article_no": "",
			"from_date" : "0",
			"to_date"   : "0"
		};
		callAxios(method, url, params).then(response => {
			try {
				let alarmData = response.data.data;
				let excelData = this.handleExcelData(alarmData);
				this.props.dispatch(storeAlarmHistoryData(excelData));
				this.setState({
					...this.state,
					alarmHistoryData: alarmData,
				});
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	componentDidMount() {
		this.loadMachineAlarmData();
	}

	handleFilterFromDateChange = (newValue) => {
		this.setState({
			...this.state,
			filterFromDate: changeDateToUnix(newValue),
		});

	};

	handleFilterToDateChange  = (newValue) => {
		this.setState({
			...this.state,
			filterToDate: changeDateToUnix(newValue),
		});
	};
	handleFilterLineChange    = (newValue) => {
		this.setState({
			...this.state,
			filterLine: newValue.value,
		});
	};
	handleFilterModelChange   = (newValue) => {
		this.setState({
			...this.state,
			filterModel: newValue,
		});
	};
	handleFilterArticleChange = (newValue) => {
		this.setState({
			...this.state,
			filterArticle: newValue.value,
		});
	};

	render() {
		let {alarmHistoryData} = this.state;
		return (
			<Container className="dashboard">
				<h3>DASHBOARD / ALARM HISTORY</h3>
				<hr/>
				<FilterRange handleFilterFromDateChange={this.handleFilterFromDateChange}
				             handleFilterToDateChange={this.handleFilterToDateChange}
				             handleFilterModelChange={this.handleFilterModelChange}
				             handleFilterLineChange={this.handleFilterLineChange}
				             handleFilterArticleChange={this.handleFilterArticleChange}
				             screenName="alarmhistory"
				/>
				<hr/>
				<div className="d-flex flex-row" style={{paddingBottom: 20}}>
					<Col md={11} lg={11}></Col>
					<Col md={1} lg={1}>
						<div key='excel' className="filter-div-excel">
				            <DataExporter/>
				        </div>
					</Col>
				</div>

				<Col md={12} lg={12}>
					<AlarmHistoryTable alarmHistoryData={alarmHistoryData}/>
				</Col>
			</Container>
		);
	}
}

export default withRouter(connect()(AlarmHistory));
