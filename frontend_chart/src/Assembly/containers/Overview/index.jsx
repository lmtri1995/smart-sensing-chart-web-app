import React, {Component}            from 'react';
import FilterRange
                                     from "../../shared/components/filter_range/FilterRange";
import {Col, Container, Row}         from 'reactstrap';
import {
	changeDateToUnix,
	findLeadTimePerformance,
	handleLeadTimeData,
	findLeadTimeCcrProcess
}                                    from "../../shared/utils/Utilities";
import ComputerStiching              from "./components/ComputerStiching";
import NormalStiching                from "./components/NormalStiching";
import PreStiching                   from "./components/PreStiching";
import BackpackMolding               from "./components/BackpackMolding";
import ToeMolding                    from "./components/ToeMolding";
import Strobel                       from "./components/Strobel";
import HeartChamber                  from "./components/HeartChamber";
import Cememting                     from "./components/Cememting";
import AttachSoleWithUpper           from "./components/AttachSoleWithUpper";
import Chiller                       from "./components/Chiller";
import MetalDetect                   from "./components/MetalDetect";
import QIPDefect                     from "./components/QIPDefect";
import Packing                       from "./components/Packing";
import LineProductivity              from "./components/LineProductivity";
import {
	PROCESS_CHART_DASHBOARD,
	ASSEMBLY_API,
	PROCESS_TEMP_DASHBOARD,
	LINE_PRODUCTIVITY,
	PROCESS_MACHINE_DASHBOARD, DEFECT_CHART_STATUS, PRODUCTION_LEAD_TIME
}                                    from "../../constants/urlConstants";
import {ALARM_MASTER_PAGE_CONSTANTS} from "../MasterAlarm/constants";
import callAxios                     from "../../services/api";
import ProductivityTable             from "../LeadTime/components/ProductivityTable";

class Overview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			filterFromDate:changeDateToUnix(new Date(), "start"),
			filterToDate:changeDateToUnix(new Date(), "end"),
			filterLine:'',
			filterModel:'',
			filterArticle:'',
			computerStichingData:[],
			normalStichingData:[],
			preStichingData:[],
			strobelData:[],
			qipDefectData:[],
			packingData:[],
			backpackMoldingData:[],
			toeMoldingData:[],
			heatChamberData:[],
			cementingData:[],
			attachSoleWithUpperData:[],
			chillerData:[],
			lineProductivityData:[],
			metalDetectData: [],
			ccrProcess      : {
				min_process_crr      : '', prod_qty_day: 0, prod_time_pair: 0,
				line_balancing_stitch: 0, line_balancing_shoe_make: 0, line_balancing_all: 0,
				productivityPairPerDay  : 0,
				productivityMinPerPair  : 0,
				pph: 0, rft: 0, eff: 0,
			},//for lead time productivity
		};
	}

	handleFilterFromDateChange    = (newValue) => {
		this.setState((state, props) => ({
			filterFromDate:changeDateToUnix(newValue, "start"),
		}));
	}

	handleFilterToDateChange    = (newValue) => {
		this.setState((state, props) => ({
			filterToDate:changeDateToUnix(newValue, "end"),
		}));
	}
	handleFilterModelChange   = (newValue) => {
		this.setState((state, props) => ({
			filterModel:newValue.value,
			filterArticle: ""
		}));
	}
	handleFilterLineChange    = (newValue) => {
		this.setState((state, props) => ({
			filterLine:newValue.value,
			filterModel:"",
			filterArticle: ""
		}));
	}
	handleFilterArticleChange = (newValue) => {
		this.setState((state, props) => ({
			filterArticle:newValue.value,
		}));
	}


	getComputerStichingData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_CHART_DASHBOARD;
		let params                                                                 = {
			"factory"   : "",
			"line"      : filterLine,
			"model"     : filterModel,
			"article_no": filterArticle,
			"process"   : "20103",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};

		callAxios(method, url, params).then(response => {
			try {
				let data = response.data.data;
				this.setState((state, props) => ({
					computerStichingData: data,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	getNormalStichingData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;

		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_CHART_DASHBOARD;
		let params                                                                 = {
			"factory"   : "",
			"line"      : filterLine,
			"model"     : filterModel,
			"article_no": filterArticle,
			"process"   : "20104",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};
		callAxios(method, url, params).then(response => {
			try {
				let data = response.data.data;
				this.setState((state, props) => ({
					normalStichingData: data,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	/*getPreStichingData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_CHART_DASHBOARD;
		let params                                                                 = {
			"factory"   : "",
			"line"      : filterLine,
			"model"     : filterModel,
			"article_no": filterArticle,
			"process"   : "20101",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};

		callAxios(method, url, params).then(response => {
			try {
				let data = response.data.data;
				this.setState((state, props) => ({
					preStichingData: data,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}*/

	getStrobelData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_CHART_DASHBOARD;
		let params                                                                 = {
			"factory"   : "",
			"line"      : filterLine,
			"model"     : filterModel,
			"article_no": filterArticle,
			"process"   : "20107",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};

		callAxios(method, url, params).then(response => {
			try {
				let data = response.data.data;
				this.setState((state, props) => ({
					strobelData: data,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	getQipDefectData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method  = 'POST';
		let url     = ASSEMBLY_API + DEFECT_CHART_STATUS;
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
				let data = response.data.data;
				this.setState((state, props) => ({
					qipDefectData: data,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	getPackingData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_CHART_DASHBOARD;
		let params                                                                 = {
			"factory"   : "",
			"line"      : filterLine,
			"model"     : filterModel,
			"article_no": filterArticle,
			"process"   : "20118",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};

		callAxios(method, url, params).then(response => {
			try {
				let data = response.data.data;
				this.setState((state, props) => ({
					packingData: data,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	getBackPackMoldingData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_TEMP_DASHBOARD;
		let params                                                                 = {
			"factory"   : "",
			"line"      : filterLine,
			"model"     : filterModel,
			"article_no": filterArticle,
			"process"   : "20105",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};

		callAxios(method, url, params).then(response => {
			try {
				let data = response.data.data;
				this.setState((state, props) => ({
					backPackMoldingData: data,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	getToeMoldingData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_TEMP_DASHBOARD;
		let params                                                                 = {
			"factory"   : "",
			"line"      : filterLine,
			"model"     : filterModel,
			"article_no": filterArticle,
			"process"   : "20106",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};

		callAxios(method, url, params).then(response => {
			try {
				let data = response.data.data;
				this.setState((state, props) => ({
					toeMoldingData: data,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	getHeatChamberData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_TEMP_DASHBOARD;
		let params                                                                 = {
			"factory"   : "",
			"line"      : filterLine,
			"model"     : filterModel,
			"article_no": filterArticle,
			"process"   : "20110",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};

		callAxios(method, url, params).then(response => {
			try {
				let data = response.data.data;
				this.setState((state, props) => ({
					heatChamberData: data,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	getCementingData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_TEMP_DASHBOARD;
		let params                                                                 = {
			"factory"   : "",
			"line"      : filterLine,
			"model"     : filterModel,
			"article_no": filterArticle,
			"process"   : "20112",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};

		callAxios(method, url, params).then(response => {
			try {
				let data = response.data.data;
				this.setState((state, props) => ({
					cementingData: data,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	getAttachSoleWithUpperData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_TEMP_DASHBOARD;

		let params                                                                 = {
			"factory"   : "",
			"line"      : filterLine,
			"model"     : filterModel,
			"article_no": filterArticle,
			"process"   : "20113",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};

		callAxios(method, url, params).then(response => {
			try {
				let data = response.data.data;
				this.setState((state, props) => ({
					attachSoleWithUpperData: data,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	getChillerData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_TEMP_DASHBOARD;
		let params                                                                 = {
			"factory"   : "",
			"line"      : filterLine,
			"model"     : filterModel,
			"article_no": filterArticle,
			"process"   : "20114",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};

		callAxios(method, url, params).then(response => {
			try {
				let data = response.data.data;
				this.setState((state, props) => ({
					chillerData: data,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	getLineProductivityData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method                                                                 = 'POST';
		let url                                                                    = ASSEMBLY_API
		                                                                             + LINE_PRODUCTIVITY;
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
			let ccrProcess = findLeadTimeCcrProcess(leadData);
			leadData       = handleLeadTimeData(leadData);
			ccrProcess     = findLeadTimePerformance(leadData, ccrProcess);
			//let workingHourItem        = findLeadTimeWorkingHour(leadData);
			try {
				this.setState({
					...this.state,
					//leadData  : leadData,
					ccrProcess: ccrProcess,
					//workingHourItem: workingHourItem
				});
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	getMetalDetectData = () => {
		let {filterFromDate, filterToDate, filterLine, filterModel, filterArticle} = this.state;
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_MACHINE_DASHBOARD;
		let params                                                                 = {
			"factory"   : "",
			"line"      : filterLine,
			"model"     : filterModel,
			"article_no": filterArticle,
			"process"   : "20116",
			"from_date" : filterFromDate,
			"to_date"   : filterToDate
		};

		callAxios(method, url, params).then(response => {
			try {
				let data = response.data.data;
				let metaDetectData = data[0];
				this.setState((state, props) => ({
					metalDetectData: metaDetectData,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	componentDidMount(){
		this.getComputerStichingData();
		this.getNormalStichingData();
		//this.getPreStichingData();
		this.getStrobelData();
		this.getQipDefectData();
		this.getPackingData();
		this.getBackPackMoldingData();
		this.getToeMoldingData();
		this.getHeatChamberData();
		this.getCementingData();
		this.getAttachSoleWithUpperData();
		this.getChillerData();
		this.getLineProductivityData();
		this.getMetalDetectData();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.filterArticle !== this.state.filterArticle || prevState.filterFromDate !== this.state.filterFromDate
		    || prevState.filterToDate !== this.state.filterToDate
		    || prevState.filterLine !== this.state.filterLine || prevState.filterModel !== this.state.filterModel
		    || prevState.filterArticle !== this.state.filterArticle){
			this.getComputerStichingData();
			this.getNormalStichingData();
			//this.getPreStichingData();
			this.getStrobelData();
			this.getQipDefectData();
			this.getPackingData();
			this.getBackPackMoldingData();
			this.getToeMoldingData();
			this.getHeatChamberData();
			this.getCementingData();
			this.getAttachSoleWithUpperData();
			this.getChillerData();
			this.getLineProductivityData();
			this.getMetalDetectData();
		}
	}

	render() {
		let {computerStichingData, normalStichingData, strobelData, qipDefectData, packingData, backPackMoldingData, toeMoldingData, heatChamberData, cementingData, attachSoleWithUpperData, chillerData, ccrProcess, metalDetectData} = this.state;
		return (
			<Container className="dashboard">
				<h3>Dashboard/Overview</h3>
				<hr/>
				<FilterRange handleFilterFromDateChange={this.handleFilterFromDateChange}
				             handleFilterToDateChange={this.handleFilterToDateChange}
				             handleFilterModelChange={this.handleFilterModelChange}
				             handleFilterLineChange={this.handleFilterLineChange}
				             handleFilterArticleChange={this.handleFilterArticleChange}
				             screenName="overview"
				/>
				<hr/>
				<Row>
					<Col md={9} lg={9}>
						<Row>
							<NormalStiching normalStichingData={normalStichingData}/>
							<ComputerStiching computerStichingData={computerStichingData}/>
							{/*<PreStiching preStichingData={preStichingData} />*/}
							<BackpackMolding backPackMoldingData={backPackMoldingData}/>
						</Row>
						<Row>
							<ToeMolding toeMoldingData={toeMoldingData} />
							<Strobel strobelData={strobelData}/>
							<HeartChamber heatChamberData={heatChamberData}/>
						</Row>
						<Row>
							<Cememting cementingData={cementingData}/>
							<AttachSoleWithUpper attachSoleWithUpperData={attachSoleWithUpperData}/>
							<Chiller chillerData={chillerData}/>
						</Row>
					</Col>
					<Col md={3} lg={3} style={{marginBottom: 15, marginLeft: -16, color: '#FFFFFF'}}>
						<LineProductivity  ccrProcess={ccrProcess} />
					</Col>
				</Row>
				<Row>
					<Col md={9} lg={9}>
						<Row>
							<MetalDetect metalDetectData={metalDetectData}/>
							<QIPDefect qipDefectData={qipDefectData} chartData={qipDefectData} />
							<Packing packingData={packingData} />
						</Row>
					</Col>
					<Col md={3} lg={3} style={{marginBottom: 15, marginLeft: -16}}>

					</Col>
				</Row>
			</Container>

		);
	}
}

export default Overview;

