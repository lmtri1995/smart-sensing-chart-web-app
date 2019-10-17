import React, {Component}                          from "react";
import {withRouter}                                from "react-router-dom";
import {changeDateToUnix}                          from "../../shared/utils/Utilities";
import FilterRange                                 from "../../shared/components/filter_range/FilterRange";
import {Container, Row}                            from 'reactstrap';
import LeadDetailTable                             from './Components/LeadDetailTable';
import MixedLineBarChart                           from "../../shared/components/chart/MixedLineBarChart";
import {ASSEMBLY_API, PRODUCTION_LEAD_TIME_DETAIL} from "../../constants/urlConstants";
import callAxios                                   from "../../services/api";
import {DAY_WORKING_SECONDS}                       from "../../constants/propertyConstants";

class LeadTimeDetail extends Component {
	constructor(props) {
		super(props);

		let labels    = [
			"7:30",
			"8:30",
			"9:30",
			"10:30",
			"11:30",
			"12:30",
			"13:30",
		];
		let chartData = [
			{
				label           : "Line dataset",
				data            : [0, 0, 0, 0, 0, 0, 0],
				type            : 'line',
				borderColor     : "#EBEDF1",
				fill            : false,
				lineTension     : 0,
				pointRadius     : 0,
				pointHoverRadius: 0,
			},
			{
				label           : "Bar dataset",
				backgroundColor : "#2880E9",
				data            : [0, 0, 0, 0, 0, 0, 0],
				pointRadius     : 0,
				pointHoverRadius: 0,
			},
		];

		this.state = {
			leadDetailData  : [],
			leadDetailFooter: {totalQTyLastRow: [], totalLTLastRow: []},
			filterFromDate  : changeDateToUnix(new Date()),
			filterToDate    : changeDateToUnix(new Date(), "end"),
			filterLine      : '',
			filterModel     : '',
			filterArticle   : '',
			chartLabels     : labels,
			chartData       : chartData,
		};
	}

	handleTableArray = (leadDetailData) => {
		//Add 2 columns: totalQty, totalLT at the end of each row
		let totalQty        = [];
		let totalLT         = [];
		//Add last row for footer
		let totalQTyLastRow = [];
		let totalLTLastRow  = [];
		totalQTyLastRow[0]  = 0;
		totalQTyLastRow[1]  = 0;
		totalQTyLastRow[2]  = 0;
		totalQTyLastRow[3]  = 0;
		totalQTyLastRow[4]  = 0;
		totalQTyLastRow[5]  = 0;
		totalQTyLastRow[6]  = 0;
		totalQTyLastRow[7]  = 0;
		totalQTyLastRow[8]  = 0;
		totalQTyLastRow[9]  = 0;
		totalQTyLastRow[10] = 0;
		totalQTyLastRow[11] = 0;
		totalQTyLastRow[12] = 0;
		totalQTyLastRow[13] = 0;
		totalQTyLastRow[14] = 0;
		totalQTyLastRow[15] = 0;

		totalLTLastRow[0]  = 0;
		totalLTLastRow[1]  = 0;
		totalLTLastRow[2]  = 0;
		totalLTLastRow[3]  = 0;
		totalLTLastRow[4]  = 0;
		totalLTLastRow[5]  = 0;
		totalLTLastRow[6]  = 0;
		totalLTLastRow[7]  = 0;
		totalLTLastRow[8]  = 0;
		totalLTLastRow[9]  = 0;
		totalLTLastRow[10] = 0;
		totalLTLastRow[11] = 0;
		totalLTLastRow[12] = 0;
		totalLTLastRow[13] = 0;
		totalLTLastRow[14] = 0;
		totalLTLastRow[15] = 0;
		totalLTLastRow[16] = 0;

		console.log("100: ", leadDetailData);
		if (leadDetailData.length > 0){
			console.log("102");
			for (let i = 0; i < leadDetailData.length; i++) {
				console.log("102");
				let data          = leadDetailData[i];
				console.log("data 104: ", data);
				totalQty[i]       = data.Qty_0730 + data.Qty_0830 + data.Qty_0930 + data.Qty_1030 + data.Qty_1130 +
				                    data.Qty_1130 + data.Qty_1230 + data.Qty_1330 + data.Qty_1430 + data.Qty_1530 +
				                    data.Qty_1630 + data.Qty_1730 + data.Qty_1830 + data.Qty_1930 + data.Qty_2030 +
				                    data.Qty_2130 + data.Qty_2230;
				totalLT[i]        = DAY_WORKING_SECONDS / totalQty[i];
				leadDetailData[i] = {
					...leadDetailData[i],
					totalQty: totalQty[i],
					totalLT : totalLT[i].toFixed(2)
				};
				this.setState({
					leadDetailData: leadDetailData
				});

				totalLTLastRow[0] += leadDetailData[i].LT_0730;
				totalLTLastRow[1] += leadDetailData[i].LT_0830;
				totalLTLastRow[2] += leadDetailData[i].LT_0930;
				totalLTLastRow[3] += leadDetailData[i].LT_1030;
				totalLTLastRow[4] += leadDetailData[i].LT_1130;
				totalLTLastRow[5] += leadDetailData[i].LT_1230;
				totalLTLastRow[6] += leadDetailData[i].LT_1330;
				totalLTLastRow[7] += leadDetailData[i].LT_1430;
				totalLTLastRow[8] += leadDetailData[i].LT_1530;
				totalLTLastRow[9] += leadDetailData[i].LT_1630;
				totalLTLastRow[10] += leadDetailData[i].LT_1730;
				totalLTLastRow[11] += leadDetailData[i].LT_1830;
				totalLTLastRow[12] += leadDetailData[i].LT_1930;
				totalLTLastRow[13] += leadDetailData[i].LT_2030;
				totalLTLastRow[14] += leadDetailData[i].LT_2130;
				totalLTLastRow[15] += leadDetailData[i].LT_2230;
				totalLTLastRow[16] += totalLT[i];
			}
		} else {
			console.log("140");
			this.setState((state, props) => ({
				leadDetailData: [],
			}));
		}

		//Add the footer row into the array
		//Insert lastrow
		if (leadDetailData.length > 0){
			totalQTyLastRow[0]  = leadDetailData[leadDetailData.length - 1].Qty_0730;
			totalQTyLastRow[1]  = leadDetailData[leadDetailData.length - 1].Qty_0830;
			totalQTyLastRow[2]  = leadDetailData[leadDetailData.length - 1].Qty_0930;
			totalQTyLastRow[3]  = leadDetailData[leadDetailData.length - 1].Qty_1030;
			totalQTyLastRow[4]  = leadDetailData[leadDetailData.length - 1].Qty_1130;
			totalQTyLastRow[5]  = leadDetailData[leadDetailData.length - 1].Qty_1230;
			totalQTyLastRow[6]  = leadDetailData[leadDetailData.length - 1].Qty_1330;
			totalQTyLastRow[7]  = leadDetailData[leadDetailData.length - 1].Qty_1430;
			totalQTyLastRow[8]  = leadDetailData[leadDetailData.length - 1].Qty_1530;
			totalQTyLastRow[9]  = leadDetailData[leadDetailData.length - 1].Qty_1630;
			totalQTyLastRow[10] = leadDetailData[leadDetailData.length - 1].Qty_1730;
			totalQTyLastRow[11] = leadDetailData[leadDetailData.length - 1].Qty_1830;
			totalQTyLastRow[12] = leadDetailData[leadDetailData.length - 1].Qty_1930;
			totalQTyLastRow[13] = leadDetailData[leadDetailData.length - 1].Qty_2030;
			totalQTyLastRow[14] = leadDetailData[leadDetailData.length - 1].Qty_2130;
			totalQTyLastRow[15] = leadDetailData[leadDetailData.length - 1].Qty_2230;
			totalQTyLastRow[16] = leadDetailData[leadDetailData.length - 1].totalQty;
		}

		//Does not countpre.stiching stage
		if (leadDetailData.length > 0 && leadDetailData[0].line_cd.toString() === "20101".toString()){
			totalLTLastRow[0]  = ((parseFloat(totalLTLastRow[0]) - leadDetailData[0].LT_0730) / 60).toFixed(2);
			totalLTLastRow[1]  = ((parseFloat(totalLTLastRow[1]) - leadDetailData[0].LT_0830) / 60).toFixed(2);
			totalLTLastRow[2]  = ((parseFloat(totalLTLastRow[2]) - leadDetailData[0].LT_0930) / 60).toFixed(2);
			totalLTLastRow[3]  = ((parseFloat(totalLTLastRow[3]) - leadDetailData[0].LT_1030) / 60).toFixed(2);
			totalLTLastRow[4]  = ((parseFloat(totalLTLastRow[4]) - leadDetailData[0].LT_1130) / 60).toFixed(2);
			totalLTLastRow[5]  = ((parseFloat(totalLTLastRow[5]) - leadDetailData[0].LT_1230) / 60).toFixed(2);
			totalLTLastRow[6]  = ((parseFloat(totalLTLastRow[6]) - leadDetailData[0].LT_1330) / 60).toFixed(2);
			totalLTLastRow[7]  = ((parseFloat(totalLTLastRow[7]) - leadDetailData[0].LT_1430) / 60).toFixed(2);
			totalLTLastRow[8]  = ((parseFloat(totalLTLastRow[8]) - leadDetailData[0].LT_1530) / 60).toFixed(2);
			totalLTLastRow[9]  = ((parseFloat(totalLTLastRow[9]) - leadDetailData[0].LT_1630) / 60).toFixed(2);
			totalLTLastRow[10] = ((parseFloat(totalLTLastRow[10]) - leadDetailData[0].LT_1730) / 60).toFixed(2);
			totalLTLastRow[11] = ((parseFloat(totalLTLastRow[11]) - leadDetailData[0].LT_1830) / 60).toFixed(2);
			totalLTLastRow[12] = ((parseFloat(totalLTLastRow[12]) - leadDetailData[0].LT_1930) / 60).toFixed(2);
			totalLTLastRow[13] = ((parseFloat(totalLTLastRow[13]) - leadDetailData[0].LT_2030) / 60).toFixed(2);
			totalLTLastRow[14] = ((parseFloat(totalLTLastRow[14]) - leadDetailData[0].LT_2130) / 60).toFixed(2);
			totalLTLastRow[15] = ((parseFloat(totalLTLastRow[15]) - leadDetailData[0].LT_2230) / 60).toFixed(2);
			totalLTLastRow[16] = ((totalLTLastRow[16] - leadDetailData[0].totalLT) / 60).toFixed(2);
		} else {
			totalLTLastRow[0]  = (parseFloat(totalLTLastRow[0]) / 60).toFixed(2);
			totalLTLastRow[1]  = (parseFloat(totalLTLastRow[1]) / 60).toFixed(2);
			totalLTLastRow[2]  = (parseFloat(totalLTLastRow[2]) / 60).toFixed(2);
			totalLTLastRow[3]  = (parseFloat(totalLTLastRow[3]) / 60).toFixed(2);
			totalLTLastRow[4]  = (parseFloat(totalLTLastRow[4]) / 60).toFixed(2);
			totalLTLastRow[5]  = (parseFloat(totalLTLastRow[5]) / 60).toFixed(2);
			totalLTLastRow[6]  = (parseFloat(totalLTLastRow[6]) / 60).toFixed(2);
			totalLTLastRow[7]  = (parseFloat(totalLTLastRow[7]) / 60).toFixed(2);
			totalLTLastRow[8]  = (parseFloat(totalLTLastRow[8]) / 60).toFixed(2);
			totalLTLastRow[9]  = (parseFloat(totalLTLastRow[9]) / 60).toFixed(2);
			totalLTLastRow[10] = (parseFloat(totalLTLastRow[10]) / 60).toFixed(2);
			totalLTLastRow[11] = (parseFloat(totalLTLastRow[11]) / 60).toFixed(2);
			totalLTLastRow[12] = (parseFloat(totalLTLastRow[12]) / 60).toFixed(2);
			totalLTLastRow[13] = (parseFloat(totalLTLastRow[13]) / 60).toFixed(2);
			totalLTLastRow[14] = (parseFloat(totalLTLastRow[14]) / 60).toFixed(2);
			totalLTLastRow[15] = (parseFloat(totalLTLastRow[15]) / 60).toFixed(2);
			totalLTLastRow[16] = (parseFloat(totalLTLastRow[16]) / 60).toFixed(2);
		}

		this.setState({
			...this.state,
			leadDetailFooter: {totalQTyLastRow: totalQTyLastRow, totalLTLastRow: totalLTLastRow}
		});

		//Fill lead detail chart
		let chartLabels = [
			"7:30",
			"8:30",
			"9:30",
			"10:30",
			"11:30",
			"12:30",
			"13:30",
			"14:30",
			"15:30",
			"16:30",
			"17:30",
			"18:30",
			"19:30",
			"20:30",
			"21:30",
			"22:30",
		];
		let chartData   = [
			{
				label      : "Lead Time",
				data       : totalLTLastRow.slice(0, totalLTLastRow.length - 1),
				type       : 'line',
				borderColor: "#0CD0EB",
				fill       : false,
				lineTension: 0,
			},
			{
				label          : "Quality",
				backgroundColor: "#2880E9",
				data           : totalQTyLastRow.slice(0, totalQTyLastRow.length - 1),
			},
		];
		this.setState({
			chartLabels: chartLabels,
			chartData  : chartData
		});
	};

	loadLeadDetailTable = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method                                                                 = 'POST';
		let url                                                                    = ASSEMBLY_API
		                                                                             + PRODUCTION_LEAD_TIME_DETAIL;
		let params                                                                 = {
			"factory"   : "",
			"line"      : filterLine,
			"model"     : filterModel,
			"article_no": filterArticle,
			"process"   : "",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};
		console.log("params: ", params);
		callAxios(method, url, params).then(response => {
			try {
				let leadDetailData = response.data.data;
				console.log("leadDetailData: ", leadDetailData);
				/*this.setState((state, props) => ({
				 test: "123"
				 }));*/
				this.handleTableArray(leadDetailData);

			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	handleFilterFromDateChange = (newValue) => {
		this.setState({
			...this.state,
			filterFromDate: changeDateToUnix(newValue),
		});
	};

	handleFilterToDateChange  = (newValue) => {
		this.setState({
			...this.state,
			filterToDate: changeDateToUnix(newValue, "end"),
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
			filterModel: newValue.value,
		});
	};
	handleFilterArticleChange = (newValue) => {
		this.setState({
			...this.state,
			filterArticle: newValue.value,
		});
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.filterFromDate !== this.state.filterFromDate
		    || prevState.filterToDate !== this.state.filterToDate
		    || prevState.filterLine !== this.state.filterLine
		    || prevState.filterModel !== this.state.filterModel
		    || prevState.filterArticle !== this.state.filterArticle) {
				this.loadLeadDetailTable();
		}
	}

	componentDidMount() {
		this.loadLeadDetailTable();
	}

	render() {
		let {chartData, chartLabels, leadDetailData, leadDetailFooter} = this.state;
		console.log("leadDetailData 328: ", leadDetailData);
		return (
			<Container className="dashboard">
				<h3>Dashboard/Production Lead Time Detail</h3>
				<hr/>
				<FilterRange handleFilterFromDateChange={this.handleFilterFromDateChange}
				             handleFilterToDateChange={this.handleFilterToDateChange}
				             handleFilterModelChange={this.handleFilterModelChange}
				             handleFilterLineChange={this.handleFilterLineChange}
				             handleFilterArticleChange={this.handleFilterArticleChange}
				             screenName="leadtimedetail"
				/>
				<hr/>
				<Row>
					<div className="col-2">
					</div>
					<div className="col-8">
						<MixedLineBarChart style={{width: 1000, height: 300}} data={chartData} labels={chartLabels}
						                   showLegend={true}/>
					</div>
					<div className="col-2">
					</div>
				</Row>
				<hr/>
				<Row>
					<LeadDetailTable leadDetailData={leadDetailData} leadDetailFooter={leadDetailFooter}
					                 fillLeadDetailChart={this.fillLeadDetailChart}/>
				</Row>
			</Container>
		);
	}
}


export default withRouter(LeadTimeDetail);
