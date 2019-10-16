import React, {Component}                                from "react";
import {Col, Container, Row}                             from "reactstrap";
import MappingStitchForm                                 from "./components/MappingStitchForm";
import DataTable                                         from "./components/DataTable";
import {ASSEMBLY_API, MAPPING_STITCH, MAPPING_STITCH_IU} from "../../constants/urlConstants";
import callAxios                                         from "../../services/api";
import MAPPING_STITCH_CONSTANTS                          from "./constants";
import {changeDateToUnix, changeStringToDate}                                from "../../shared/utils/Utilities";
import moment                                            from "moment";

class MappingStitch extends Component {
	constructor(props) {
		super(props);
		let {initial}     = MAPPING_STITCH_CONSTANTS.submissionState;
		this.mainTableRef = React.createRef();
		this.state        = {
			tableData      : [],
			formData       : {},
			editMode       : false,
			submissionState: initial,    // -1: Failed, 0: Submit/Save, 1: Submitting/Saving, 2: Submitted/Saved
			connectionError: '',
		}
	}

	componentDidMount() {
		this.getStitchList();
	}

	fillForm = (selectedRow) => {
		const {field} = MAPPING_STITCH_CONSTANTS;

		this.setState({
			formData       : {
				...selectedRow,
				[field.hiddenMacAddressDuplicatedChecker]: false,
			},
			editMode       : true,
			submissionState: MAPPING_STITCH_CONSTANTS.submissionState.initial,
		});
	};

	onReset = () => {
		this.deselectRow();
		this.setState({
			formData: {},
			editMode: false,
		});
	};

	handleSubmit = (values) => {
		console.log("50: ", values);
		let {failed, initial, onGoing, done} = MAPPING_STITCH_CONSTANTS.submissionState;
		this.setState({
			submissionState: onGoing,
		});
		event.preventDefault();
		const {field} = MAPPING_STITCH_CONSTANTS;

		let method = 'POST';
		let url    = ASSEMBLY_API + MAPPING_STITCH_IU;
		let param  = {
			"status"             : this.state.editMode ? "UPDATE" : "INSERT",
			[field.macAddress]   : values[field.macAddress],
			"mapping_seq"        : "0",
			[field.factoryCode]  : values[field.factoryCode],
			[field.lineCode]     : values[field.lineCode],
			[field.processCode]  : values[field.processCode],
			[field.posittionCode]: values[field.posittionCode],
			[field.active]       : values[field.active] ? "1" : "0",
			[field.description]  : values[field.description],
			[field.entryDate]    : changeDateToUnix(changeStringToDate(values[field.entryDate])),
			"rtn_value"          : ""
		};
		console.log("param 72: ", param);
		callAxios(method, url, param).then(response => {
			this.setState({
				formData       : {},
				//tableData      : tableData,
				submissionState: done,
			});
			let gotError  = false;
			let tableData = response.data.data.map(rowData => {
				if (rowData.outvalue) {    // Got Error/Duplicated Mas Code Found
					gotError = true;
				}
				return {
					[field.macAddress]   : rowData[field.macAddress],
					"mapping_seq"        : "0",
					[field.factoryCode]  : rowData[field.factoryCode],
					[field.lineCode]     : rowData[field.lineCode],
					[field.processCode]  : rowData[field.processCode],
					[field.posittionCode]: rowData[field.posittionCode],
					[field.active]       : rowData[field.active] ? "1" : "0",
					[field.description]  : rowData[field.description],
					[field.entryDate]    : changeDateToUnix(rowData[field.entryDate]),
					"rtn_value"          : ""
				};
			});
			if (!this.state.editMode && gotError) { // Is in Insert Mode and Duplicated Mas Code found
				this.setState({
					formData       : {
						...this.state.formData,
						"status"                                 : this.state.editMode ? "UPDATE" : "INSERT",
						[field.macAddress]                       : values[field.macAddress],
						"mapping_seq"                            : "0",
						[field.factoryCode]                      : values[field.factoryCode],
						[field.factoryName]                      : values[field.factoryName],
						[field.lineCode]                         : values[field.lineCode],
						[field.lineName]                         : values[field.lineName],
						[field.processCode]                      : values[field.processCode],
						[field.processName]                      : values[field.processName],
						[field.posittionCode]                    : values[field.posittionCode],
						[field.posittionName]                    : values[field.posittionName],
						[field.active]                           : values[field.active] ? "1" : "0",
						[field.description]                      : values[field.description],
						[field.entryDate]                        : changeDateToUnix(values[field.entryDate]),
						[field.hiddenMacAddressDuplicatedChecker]: true,
						"rtn_value"                              : ""
					},
					submissionState: failed,
				});
			} else {    // Is in Insert OR Edit Mode and got NO error
				console.log("insert successfully");
				this.setState({
					formData       : {},
					tableData      : tableData,
					submissionState: done,
				});
				console.log("reset and retrieve list");
				this.getStitchList();
				this.onReset();
			}
			setTimeout(() => {
				this.setState({
					submissionState: initial,
				});
			}, 1000);
		}).catch(error => {
			console.log("Error: ", error);
			this.setState({
				submissionState: failed,
				connectionError: 'Cannot connect to Server',
			});
			setTimeout(() => {
				this.setState({
					submissionState: initial,
					connectionError: '',
				});
			}, 2000);
		});
	}

	deselectRow = () => {
		let mainTable = this.mainTableRef;
		mainTable.current.table.deselectRow();
	}

	getStitchList = () => {
		let method = 'POST';
		let url    = ASSEMBLY_API + MAPPING_STITCH;

		callAxios(method, url, {}).then(response => {
			let tableData = response.data.data;
			this.setState({
				...this.state,
				tableData: tableData,
			});
		}).catch(reason => console.log("Error: ", reason));

	}

	render() {
		let {
			    tableData, formData, editMode, submissionState
		    } = this.state;
		return (
			<Container className="dashboard">
				<h3>Table board/Mapping Stitch Sensor And Process</h3>
				<hr/>
				<Row>
					<MappingStitchForm
						formData={formData}
						onReset={this.onReset}
						editMode={editMode}
						onSubmit={this.handleSubmit}
						submissionState={submissionState}
					/>
				</Row>
				<Row style={{marginTop: 50}}>
					<Col md={12} lg={12}>
						<DataTable id="mainTable"
						           options={{
							           height         : "40em",
							           columnVertAlign: "bottom"
						           }}
						           tableData={tableData}
						           formData={formData}
						           fillForm={this.fillForm}
						           onReset={this.onReset}
						           ref={this.mainTableRef}
						/>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default MappingStitch;
