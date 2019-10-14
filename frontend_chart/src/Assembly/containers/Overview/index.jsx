import React, {Component}              from 'react';
import FilterRange
                                       from "../../shared/components/filter_range/FilterRange";
import {Col, Container, Row} from 'reactstrap';
import {changeDateToUnix}       from "../../shared/utils/Utilities";
import ComputerStiching    from "./components/ComputerStiching";
import NormalStiching      from "./components/NormalStiching";
import PreStiching         from "./components/PreStiching";
import BackpackMolding     from "./components/BackpackMolding";
import ToeMolding          from "./components/ToeMolding";
import Strobel                             from "./components/Strobel";
import HeartChamber                        from "./components/HeartChamber";
import Cememting                           from "./components/Cememting";
import AttachSoleWithUpper                                             from "./components/AttachSoleWithUpper";
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
	PROCESS_MACHINE_DASHBOARD, DEFECT_CHART_STATUS
} from "../../constants/urlConstants";
import {ALARM_MASTER_PAGE_CONSTANTS} from "../MasterAlarm/constants";
import callAxios                     from "../../services/api";

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
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.filterArticle !== this.state.filterArticle || prevState.filterFromDate !== this.state.filterFromDate
		    || prevState.filterToDate !== this.state.filterToDate
		    || prevState.filterLine !== this.state.filterLine || prevState.filterModel !== this.state.filterModel
			|| prevState.filterArticle !== this.state.filterArticle){
		}
	}

	handleFilterFromDateChange    = (newValue) => {
		this.setState({
			...this.state,
			filterFromDate:changeDateToUnix(newValue, "start"),
		});
	}

	handleFilterToDateChange    = (newValue) => {
		this.setState({
			...this.state,
			filterToDate:changeDateToUnix(newValue, "end"),
		});
	}
	handleFilterModelChange   = (newValue) => {
		this.setState({
			...this.state,
			filterModel:newValue.value,
			filterArticle: ""
		});
	}
	handleFilterLineChange    = (newValue) => {
		this.setState({
			...this.state,
			filterLine:newValue.value,
			filterModel:"",
			filterArticle: ""
		});
	}
	handleFilterArticleChange = (newValue) => {
		this.setState({
			...this.state,
			filterArticle:newValue.value,
		});
	}


	getComputerStichingData = () => {
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_CHART_DASHBOARD;
		let params  = {
			"factory": "",
			"line": "",
			"process": "20103",
			"model":"",
			"article_no":"",
			"from_date": 1568107963,
			"to_date": 1568107963
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
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_CHART_DASHBOARD;
		let params  = {
			"factory": "",
			"line": "",
			"process": "20104",
			"model":"",
			"article_no":"",
			"from_date": 1568107963,
			"to_date": 1568107963
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

	getPreStichingData = () => {
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_CHART_DASHBOARD;
		let params  = {
			"factory": "",
			"line": "",
			"process": "20101",
			"model":"",
			"article_no":"",
			"from_date": 1568107963,
			"to_date": 1568107963
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
	}

	getStrobelData = () => {
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_CHART_DASHBOARD;
		let params  = {
			"factory": "",
			"line": "",
			"process": "20107",
			"model":"",
			"article_no":"",
			"from_date": 1562722712,
			"to_date": 1562722712
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
		let params = {
			"factory": "",
			"line": "",
			"process": "",
			"model":"",
			"article_no":"",
			"from_date": filterFromDate,
			"to_date": filterToDate
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
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_CHART_DASHBOARD;
		let params  = {
			"factory": "",
			"line": "",
			"process": "20105",
			"model":"",
			"article_no":"",
			"from_date": 1562722712,
			"to_date": 1562722712
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
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_TEMP_DASHBOARD;
		let params  = {
			"factory": "",
			"line": "",
			"process": "20105",
			"model":"",
			"article_no":"",
			"from_date": 1562722712,
			"to_date": 1562722712
		};

		callAxios(method, url, params).then(response => {
			try {
				let data = response.data.data;
				console.log("backpack molding: ", data);
				this.setState((state, props) => ({
					backPackMoldingData: data,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	getToeMoldingData = () => {
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_TEMP_DASHBOARD;
		let params  = {
			"factory": "",
			"line": "",
			"process": "20106",
			"model":"",
			"article_no":"",
			"from_date": 1562722712,
			"to_date": 1562722712
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
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_TEMP_DASHBOARD;
		let params  = {
			"factory": "",
			"line": "",
			"process": "20110",
			"model":"",
			"article_no":"",
			"from_date": 1562722712,
			"to_date": 1562722712
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
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_TEMP_DASHBOARD;
		let params  = {
			"factory": "",
			"line": "",
			"process": "20112",
			"model":"",
			"article_no":"",
			"from_date": 1562722712,
			"to_date": 1562722712
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
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_TEMP_DASHBOARD;
		let params  = {
			"factory": "",
			"line": "",
			"process": "20113",
			"model":"",
			"article_no":"",
			"from_date": 1562722712,
			"to_date": 1562722712
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
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_TEMP_DASHBOARD;
		let params  = {
			"factory": "",
			"line": "",
			"process": "20114",
			"model":"",
			"article_no":"",
			"from_date": 1562722712,
			"to_date": 1562722712
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
		let method  = 'POST';
		let url     = ASSEMBLY_API + LINE_PRODUCTIVITY;
		let params  = {
			"factory": "",
			"line": "",
			"process": "20105",
			"model":"",
			"article_no":"",
			"from_date": 1565233732,
			"to_date": 1565233732
		};

		callAxios(method, url, params).then(response => {
			try {
				let data = response.data.data;
				this.setState((state, props) => ({
					lineProductivityData: data,
				}));
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	}

	getMetalDetectData = () => {
		let method  = 'POST';
		let url     = ASSEMBLY_API + PROCESS_MACHINE_DASHBOARD;
		let params  = {
			"factory": "",
			"line": "",
			"process": "20116",
			"model":"",
			"article_no":"",
			"from_date": 1564453935,
			"to_date": 1564453935
		};

		callAxios(method, url, params).then(response => {
			try {
				let data = response.data.data;
				console.log("data 440: ", data);
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
		this.getPreStichingData();
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
			this.getPreStichingData();
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
		let {computerStichingData, normalStichingData, preStichingData, strobelData, qipDefectData, packingData, backPackMoldingData, toeMoldingData, heatChamberData, cementingData, attachSoleWithUpperData, chillerData, lineProductivityData, metalDetectData} = this.state;
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
							<PreStiching preStichingData={preStichingData} />
						</Row>
						<Row>
							<BackpackMolding backPackMoldingData={backPackMoldingData}/>
							<ToeMolding toeMoldingData={toeMoldingData} />
							<Strobel strobelData={strobelData}/>
						</Row>
						<Row>
							<HeartChamber heatChamberData={heatChamberData}/>
							<Cememting cementingData={cementingData}/>
							<AttachSoleWithUpper attachSoleWithUpperData={attachSoleWithUpperData}/>
						</Row>
					</Col>
					<Col md={3} lg={3} style={{marginBottom: 15, marginLeft: -16, color: '#FFFFFF'}}>
						<LineProductivity lineProductivityData={lineProductivityData}/>
					</Col>
				</Row>
				<Row>
					<Col md={9} lg={9}>
						<Row>
							<Chiller chillerData={chillerData}/>
							<MetalDetect metalDetectData={metalDetectData}/>
							<QIPDefect qipDefectData={qipDefectData} chartData={qipDefectData} />
						</Row>
					</Col>
					<Col md={3} lg={3} style={{marginBottom: 15, marginLeft: -16}}>
						<Packing packingData={packingData} />
					</Col>
				</Row>
			</Container>

		);
	}
}

export default Overview;

