import React, {Component}                                           from 'react';
import FilterRange
                                                                    from "../../shared/components/filter_range/FilterRange";
import {connect}                                                    from "react-redux";
import {withRouter}                                                 from "react-router-dom";
import {Col, Container, Row}                                        from 'reactstrap';
import LeadTable                                                    from "./components/LeadTable";
import ProductivityTable                                            from "./components/ProductivityTable";
import WorkingHourTable                                             from "./components/WorkingHourTable";
import {ASSEMBLY_API, PRODUCTION_LEAD_TIME, WORKING_HOUR_LEAD_TIME} from "../../constants/urlConstants";
import callAxios                                                    from "../../services/api";
import {changeDateToUnix}                                           from "../../shared/utils/Utilities";

class LeadTime extends Component {
	constructor(props) {
		super(props);
		this.state = {
			leadData        : [],
			ccrProcess      : {
				min_process_crr      : '', prod_qty_day: 0, prod_time_pair: 0,
				line_balancing_stitch: 0, line_balancing_shoe_make: 0, line_balancing_all: 0
			},
			workingHourData : [],
			workingHourLabel: [],
			filterFromDate  : changeDateToUnix(new Date(), "start"),
			filterToDate    : changeDateToUnix(new Date(), "end"),
			filterLine      : '',
			filterModel     : '',
			filterArticle   : ''
		};
		/*leadData: [
		 { mas_cd_nm:'', pair_qty: 0, lead_time: 0, prod_qty_day: 0, prod_time_pair: 0, ccr_yn: 0, min_process_crr: ''},
		 ],*/
		//this.retrieveLeadTableData();
		//this.retrieveWorkingHourData();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.filterFromDate !== this.state.filterFromDate
		    || prevState.filterToDate !== this.state.filterToDate
		    || prevState.filterLine !== this.state.filterLine
		    || prevState.filterModel !== this.state.filterModel
		    || prevState.filterArticle !== this.state.filterArticle) {
			//filterArticle: ""
			// filterFromDate: 1563160349
			// filterLine: ""
			// filterModel: ""
			// filterToDate: 1563937949
			this.retrieveLeadTableData();
			this.retrieveWorkingHourData();
		}
	}

	retrieveLeadTableData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method                                                                 = 'POST';
		let url                                                                    = ASSEMBLY_API
		                                                                             + PRODUCTION_LEAD_TIME;
		let params                                                                 = {
			"factory"   : "",
			"line"      : filterLine,
			"model"     : filterModel,
			"article_no": filterArticle,
			"process"   : "",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};
		callAxios(method, url, params).then(response => {
			let leadData   = response.data.data;
			let ccrProcess = this.findCcrProcess(leadData);
			try {
				this.setState({
					...this.state,
					leadData  : leadData,
					ccrProcess: ccrProcess,
				});
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	handleWorkingData = (workingHourData) => {
		try {
			if (workingHourData) {
				let labels = [];
				let data   = [];
				workingHourData.map(item => {
					labels.push(item[0]);
					data.push(item[1]);
				});
				this.setState({
					...this.state,
					workingHourData : [{
						data           : data,
						backgroundColor: "#2880E9",
					}],
					workingHourLabel: labels
				});
			} else {
				this.setState({
					...this.state,
					workingHourData : [{
						data           : [0, 0, 0, 0, 0,
						                  0, 0, 0, 0, 0,
						                  0, 0, 0, 0, 0,
						                  0],
						backgroundColor: "#2880E9",
					}],
					workingHourLabel: ["Computer Stitching", "Normal Stitching", "Backpack Molding", "Toe Molding",
					                   "Strobel", "Lasting", "Heel Lasting", "Heat Chamber", "Negative Gage",
					                   "Cementing", "Attach Sole With Upper", "Chiller", "Delasting", "Metal Detect",
					                   "QIP Defect", "Packing"]
				});
			}
		} catch (e) {
			console.log("Error: ", e);
		}
	};

	retrieveWorkingHourData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method                                                                 = 'POST';
		let url                                                                    = ASSEMBLY_API
		                                                                             + WORKING_HOUR_LEAD_TIME;
		let params                                                                 = {
			"factory"   : "",
			"line"      : filterLine,
			"model"     : filterModel,
			"article_no": filterArticle,
			"process"   : "",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};
		callAxios(method, url, params).then(response => {
			try {
				let workingHourDataArray = response.data.data;
				//this.handleWorkingData(workingHourDataArray);
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	handleFilterFromDateChange = (newValue) => {
		this.setState({
			...this.state,
			filterFromDate: changeDateToUnix(newValue, "start"),
		});
	};

	handleFilterToDateChange  = (newValue) => {
		this.setState({
			...this.state,
			filterToDate: changeDateToUnix(newValue, "end"),
		});
	};
	handleFilterModelChange   = (newValue) => {
		this.setState({
			...this.state,
			filterModel  : newValue.value,
			filterArticle: ""
		});
	};
	handleFilterLineChange    = (newValue) => {
		this.setState({
			...this.state,
			filterLine   : newValue.value,
			filterModel  : "",
			filterArticle: ""
		});
	};
	handleFilterArticleChange = (newValue) => {
		this.setState({
			...this.state,
			filterArticle: newValue.value,
		});
	};

	findCcrProcess = (leadData) => {
		let ccrProcess = {
			min_process_crr      : '', prod_qty_day: 0, prod_time_pair: 0,
			line_balancing_stitch: 0, line_balancing_shoe_make: 0, line_balancing_all: 0
		};
		try {
			let exit = false, i = 0;
			do {
				if (leadData[i].min_process_crr != "") {
					exit       = true;
					ccrProcess = leadData[i];
				}
				i++;
			} while (i < leadData.length && !exit);
		} catch (e) {
			console.log("Error: ", e);
		}

		return ccrProcess;
	};

	handleLeadData = (leadData) => {
		/*
		 20102	201	Load-In Material
		 20103	201	Computer Stitching
		 20104	201	Normal Stitching
		 20105	201	Packpart Molding
		 20106	201	Toe Molding
		 20107	201	Strobel
		 20108	201	Lasting
		 20109	201	Heel Lasting
		 20110	201	Heat Chamber
		 20111	201	Negartive Gage
		 20112	201	Cementing
		 20113	201	Attach Sole with Upper
		 20114	201	Chiller
		 20115	201	DeLasting
		 20116	201	Metal Detector
		 20117	201	QIP Defect
		 20118	201	Packing
		 */
		let newLeadDataArray = [
			{
				"mas_cd_nm" : "Normal Stitching",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"number_of_day" : 0,
				"process_cd": "20104"
			},
			{
				"mas_cd_nm" : "Computer Stitching",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"number_of_day" : 0,
				"process_cd": "20103"
			},
			{
				"mas_cd_nm" : "Backpack Molding",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"number_of_day" : 0,
				"process_cd": "20105"
			},
			{
				"mas_cd_nm" : "Toe Molding",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"number_of_day" : 0,
				"process_cd": "20106"
			},
			{
				"mas_cd_nm" : "Strobel",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"number_of_day" : 0,
				"process_cd": "20107"
			},
			{
				"mas_cd_nm" : "Lasting",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"number_of_day" : 0,
				"process_cd": "20108"
			},
			{
				"mas_cd_nm" : "Heal Lasting",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"number_of_day" : 0,
				"process_cd": "20109"
			},
			{
				"mas_cd_nm" : "Heat Chamber",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"number_of_day" : 0,
				"process_cd": "20110"
			},
			{
				"mas_cd_nm" : "Negative Gage",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"number_of_day" : 0,
				"process_cd": "20111"
			},
			{
				"mas_cd_nm" : "Cementing",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"number_of_day" : 0,
				"process_cd": "20112"
			},
			{
				"mas_cd_nm" : "Attach Sole With Upper",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"number_of_day" : 0,
				"process_cd": "20113"
			},
			{
				"mas_cd_nm" : "Chiller",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"number_of_day" : 0,
				"process_cd": "20114"
			},
			{
				"mas_cd_nm" : "Delasting",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"number_of_day" : 0,
				"process_cd": "20115"
			},
			{
				"mas_cd_nm" : "Metal Detect",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"number_of_day" : 0,
				"process_cd": "20116"
			},
			{
				"mas_cd_nm" : "QIP Defect",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"number_of_day" : 0,
				"process_cd": "20117"
			},
			{
				"mas_cd_nm" : "Packing",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"number_of_day" : 0,
				"process_cd": "20118"
			}
		];
		for (let i = 0; i < newLeadDataArray.length; i++) {
			for (let j = 0; j < leadData.length; j++) {
				if (leadData[j].process_cd.toString() === newLeadDataArray[i].process_cd.toString()) {
					newLeadDataArray[i].pair_qty  = leadData[j].pair_qty;
					newLeadDataArray[i].lead_time = leadData[j].lead_time;
					newLeadDataArray[i].number_of_day = leadData[j].number_of_day;
				}
			}
		}
		return newLeadDataArray;
	};

	findPerformance = (leadData, ccrProcess) => {
		let maxStitching      = 0, sumStitching = 0;
		let maxShoeMaking    = 0, sumShoeMaking = 0;
		let maxLineBalancing = 0, sumLineBalancing = 0;
		let sumLeadTime         = 0;
		for (let i = 0; i < 2; i++) {
			sumStitching += leadData[i].pair_qty;
			if (maxStitching < leadData[i].pair_qty) {
				maxStitching = leadData[i].pair_qty;
			}
		}
		for (let i = 2; i < leadData.length; i++) {
			sumShoeMaking += leadData[i].pair_qty;
			if (maxShoeMaking < leadData[i].pair_qty) {
				maxShoeMaking = leadData[i].pair_qty;
			}
		}
		for (let i = 0; i < leadData.length; i++) {
			sumLineBalancing += leadData[i].pair_qty;
			sumLeadTime += leadData[i].lead_time;
			if (maxLineBalancing < leadData[i].pair_qty) {
				maxLineBalancing = leadData[i].pair_qty;
			}
		}
		maxStitching               = maxStitching > 0 ? maxStitching : 1;
		maxShoeMaking             = maxShoeMaking > 0 ? maxShoeMaking : 1;
		maxLineBalancing          = maxLineBalancing > 0 ? maxLineBalancing : 1;

		/*let computerStitchingValue  = leadData[1].pair_qty > 0?leadData[1].pair_qty:1;
		let backpackMoldingValue  = leadData[3].pair_qty?leadData[3].pair_qty:1;
		let line_balancing_stitch = 0, line_balancing_shoe_make = 0, line_balancing_all = 0;*/
		let line_balancing_all        = sumLineBalancing * 100 / (maxLineBalancing * 16);
		let line_balancing_shoe_make  = sumShoeMaking * 100 / (maxShoeMaking * 14);
		let line_balancing_stitch     = sumStitching * 100 / (maxStitching * 2);

		//count productivity pairs/day, mins/pair
		let packingQty = leadData[15].pair_qty;
		let numberOfWorkingDays = leadData[15].number_of_day > 0?leadData[15].number_of_day:1;
		let productivityPairPerDay = packingQty/numberOfWorkingDays;
		let productivityMinPerPair = sumLeadTime/60;


		ccrProcess                = {
			...ccrProcess,
			line_balancing_all      : line_balancing_all,
			line_balancing_shoe_make: line_balancing_shoe_make,
			line_balancing_stitch   : line_balancing_stitch,
			productivityPairPerDay  : productivityPairPerDay,
			productivityMinPerPair  : productivityMinPerPair
		};
		return ccrProcess;
	};

	findWorkingHour = (leadData) => {
		let workingHourData  = [];
		let workingHourLabel = [];
		for (let i = 0; i < leadData.length; i++) {
			//mas_cd_nm: "Pre. Stitching", pair_qty: 0, lead_time: 0, process_cd: "20101"
			workingHourData.push(leadData[i].lead_time);
			workingHourLabel.push(leadData[i].mas_cd_nm);
		}
		return {
			workingHourData : [{
				backgroundColor: "#2880E9",
				data           : workingHourData
			}],
			workingHourLabel: workingHourLabel
		};
	};

	componentDidMount(){
		this.retrieveLeadTableData();
		this.retrieveWorkingHourData();
	}

	render() {
		let {leadData, ccrProcess} = this.state;
		leadData                   = this.handleLeadData(leadData);
		//let ccrProcess = this.findCcrProcess(leadData);
		ccrProcess                 = this.findPerformance(leadData, ccrProcess);
		let workingHourItem        = this.findWorkingHour(leadData);

		return (
			<Container className="dashboard">
				<h3>Dashboard/Production Lead Time</h3>
				<hr/>
				<FilterRange handleFilterFromDateChange={this.handleFilterFromDateChange}
				             handleFilterToDateChange={this.handleFilterToDateChange}
				             handleFilterModelChange={this.handleFilterModelChange}
				             handleFilterLineChange={this.handleFilterLineChange}
				             handleFilterArticleChange={this.handleFilterArticleChange}
				             screenName="leadtime"
				/>
				<hr/>
				<Row>
					<Col md={6} lg={6}>
						<LeadTable leadData={leadData}/>
					</Col>
					<Col md={6} lg={6}>
						<div className="d-flex flex-column">
							<Col md={12} lg={12} style={{backgroundColor: '#1E2229'}}>
								<ProductivityTable ccrProcess={ccrProcess}/>
							</Col>
							<hr/>
							<Col md={12}    lg={12} style={{backgroundColor: '#232529'}}>
								<WorkingHourTable workingHourData={workingHourItem.workingHourData}
								                  workingHourLabel={workingHourItem.workingHourLabel}/>
							</Col>
						</div>
					</Col>
				</Row>
			</Container>

		);
	}
}

const mapStateToProps = (state) => ({
	filter: state.filter,
});

export default withRouter(connect(mapStateToProps)(LeadTime));

