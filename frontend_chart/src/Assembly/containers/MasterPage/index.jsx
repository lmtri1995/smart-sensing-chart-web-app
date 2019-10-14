import React, {Component}                                           from 'react';
import {Card, CardBody, Col, Container, Row}                        from 'reactstrap';
import MasterForm                                                   from "./components/MasterForm";
import callAxios                                                    from "../../services/api";
import {ASSEMBLY_API, CATEGORY_ROUTE, MAS_CODE_ROUTE, PARENT_ROUTE} from "../../constants/urlConstants";
import DataTable                                                    from "./components/DataTable";
import {reduxForm}                                                  from "redux-form";
import MASTER_FORM_CONSTANTS                                        from "./constants";

class MasterPage extends Component {
	constructor(props) {
		super(props);
		let {initial} = MASTER_FORM_CONSTANTS.submissionState;
		this.state    = {
			categoryCodeOptions: [{
				value: "",
				label: "---",
			}],
			parentCodeOptions  : [{
				value: "",
				label: "---",
			}],
			formData           : {},
			editMode           : false,
			submissionState    : initial,    // -1: Failed, 0: Submit/Save, 1: Submitting/Saving, 2: Submitted/Saved
			connectionError    : '',
		};
	}

	handleSubmit = (values) => {
		let {failed, initial, onGoing, done} = MASTER_FORM_CONSTANTS.submissionState;
		this.setState({
			submissionState: onGoing,
		});

		event.preventDefault();

		const {field}        = MASTER_FORM_CONSTANTS;
		let definition_value = `${values[field.temperature]}${values[field.pressure]}${values[field.timer]}`;

		let method = 'POST';
		let url    = '/api/asc/mascode';
		let param  = {
			"status"          : this.state.editMode ? "UPDATE" : "INSERT",
			"mas_cd"          : values[field.masCd.name],
			"cate_cd"         : values[field.catCd.name],
			"mas_cd_nm"       : values[field.masCdNm.name],
			"parent_mas_cd"   : values[field.parentMasCd],
			"processing_seq"  : values[field.processingSeq.name],
			"definition_value": definition_value,
			"virtual_yn"      : values[field.virtualYn],
			"active_yn"       : values[field.activeYn],
			"sys_code_yn"     : values[field.sysCodeYn],
			"username"        : "truongho",
			"remark"          : values[field.description.name]
		};
		setTimeout(() => {
			callAxios(method, url, param).then(response => {
				if (response == undefined) {
					this.setState({
						submissionState: failed,
					});
				}
				let gotError  = false;
				let tableData = response.data.data.map(rowData => {
					if (rowData.outvalue) {    // Got Error/Duplicated Mas Code Found
						gotError = true;
					}
					return {
						[field.masCd.name]        : rowData.mas_cd,
						[field.masCdNm.name]      : rowData.mas_cd_nm,
						[field.catCdNm]           : rowData.cate_nm,
						[field.catCd.name]        : rowData.cate_cd,
						[field.parentMasNm]       : rowData.parent_cd_nm,
						[field.parentMasCd]       : rowData.parent_mas_cd,
						[field.processingSeq.name]: rowData.processing_seq,
						[field.definitionValue]   : rowData.definition_value,
						[field.virtualYn]         : rowData.virtual_yn,
						[field.activeYn]          : rowData.active_yn,
						[field.sysCodeYn]         : rowData.sys_code_yn,
						[field.description.name]  : rowData.remark,
					};
				});
				if (!this.state.editMode && gotError) { // Is in Insert Mode and Duplicated Mas Code found
					this.setState({
						formData       : {
							...this.state.formData,
							[field.masCd.name]                  : values[field.masCd.name],
							[field.masCdNm.name]                : values[field.masCdNm.name],
							[field.hiddenMasCdDuplicatedChecker]: true,
							[field.catCdNm]                     : values[field.catCdNm],
							[field.catCd.name]                  : values[field.catCd.name],
							[field.parentMasNm]                 : values[field.parentMasNm],
							[field.parentMasCd]                 : values[field.parentMasCd],
							[field.processingSeq.name]          : values[field.processingSeq.name],
							[field.definitionValue]             : definition_value,
							[field.virtualYn]                   : values[field.virtualYn],
							[field.activeYn]                    : values[field.activeYn],
							[field.sysCodeYn]                   : values[field.sysCodeYn],
							[field.description.name]            : values[field.description.name],
						},
						submissionState: failed,
					});
				} else {    // Is in Insert OR Edit Mode and got NO error
					this.setState({
						formData       : {},
						tableData      : tableData,
						submissionState: done,
					});
				}
				setTimeout(() => {
					this.setState({
						submissionState: initial,
					});
				}, 1000);
			}).catch(reason => {
				console.log("Error: ", reason);
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
		}, 1000);
	};

	loadCategoryCodeOptions = () => {
		let method = 'POST';
		let url    = ASSEMBLY_API + CATEGORY_ROUTE;
		let param  = {
			"dropdownlist-name": "cate"
		};

		callAxios(method, url, param).then(response => {
			this.setState({
				categoryCodeOptions: [{
					value: "",
					label: "---",
				}].concat(
					response.data.data.map(categoryCode => ({
						value: categoryCode.code.toString(),
						label: categoryCode.name.toString(),
					}))
				),
			});
		}).catch(reason => console.log("Error: ", reason));
	};

	loadParentCodeOptions = (currentChildFormData, catName, catCode) => {
		console.log("loadParentCodeOptions");
		const {field} = MASTER_FORM_CONSTANTS;

		let method = 'POST';
		let url    = ASSEMBLY_API + PARENT_ROUTE;
		let param  = {
			"dropdownlist-name": "parent",
			"code"             : catCode
		};
		console.log("0");
		console.log("param 165: ", param);
		let firstOption;
		if (!(field.catCd.catCdsRequireParentMasCd.includes(parseInt(catCode)))) {
			firstOption = [{
				value: "",
				label: "---",
			}];
		} else {
			firstOption = [];
		}
		console.log("174");
		callAxios(method, url, param).then(response => {
			console.log("176");
			console.log("response: ", response);
			this.setState({
				parentCodeOptions: firstOption.concat(
					response.data.data.map(parentCode => ({
						value: parentCode.code.toString(),
						label: parentCode.name.toString(),
					}))
				),
				formData         : {
					...currentChildFormData,
					[field.catCdNm]    : catName,
					[field.catCd.name] : catCode,
					[field.parentMasCd]: firstOption.length > 0 ? firstOption[0].value : response.data.data[0].code,
					[field.parentMasNm]: firstOption.length > 0 ? firstOption[0].label : response.data.data[0].name,
				},
			});
		}).catch(reason => console.log("Error: ", reason));
	};

	loadDataTable = () => {
		let method = 'POST';
		let url    = ASSEMBLY_API + MAS_CODE_ROUTE;

		callAxios(method, url, {}).then(response => {
			let responseArray = response.data.data;
			let tableData     = [];
			const {field}     = MASTER_FORM_CONSTANTS;
			for (let i = 0; i < responseArray.length; i++) {
				let item = {
					[field.masCd.name]        : responseArray[i].mas_cd,
					[field.masCdNm.name]      : responseArray[i].mas_cd_nm,
					[field.catCdNm]           : responseArray[i].cate_nm,
					[field.catCd.name]        : responseArray[i].cate_cd,
					[field.parentMasNm]       : responseArray[i].parent_cd_nm,
					[field.parentMasCd]       : responseArray[i].parent_mas_cd,
					[field.processingSeq.name]: responseArray[i].processing_seq,
					[field.definitionValue]   : responseArray[i].definition_value,
					[field.virtualYn]         : responseArray[i].virtual_yn,
					[field.activeYn]          : responseArray[i].active_yn,
					[field.sysCodeYn]         : responseArray[i].sys_code_yn,
					[field.description.name]  : responseArray[i].remark,
				};
				tableData.push(item);
			}
			this.setState({
				tableData: tableData,
			});
		}).catch(reason => console.log("Error: ", reason));
	};

	fillForm = (selectedRow) => {
		const {field} = MASTER_FORM_CONSTANTS;

		this.setState({
			formData       : {
				...selectedRow,
				[field.hiddenMasCdDuplicatedChecker]: false,
			},
			editMode       : true,
			submissionState: MASTER_FORM_CONSTANTS.submissionState.initial,
		});
	};

	onReset = () => {
		this.setState({
			formData: {},
			editMode: false,
		});
	};

	componentDidMount() {
		this.loadCategoryCodeOptions();
		this.loadDataTable();
	}

	render() {
		let {
			    parentCodeOptions, categoryCodeOptions,
			    tableData, formData,
			    editMode, submissionState, connectionError
		    } = this.state;
		return (
			<Container className="dashboard">
				<Card>
					<CardBody>
						<Row>
							<MasterForm parentCodeOptions={parentCodeOptions}
							            loadParentCodeOptions={this.loadParentCodeOptions}
							            categoryCodeOptions={categoryCodeOptions}
							            onSubmit={this.handleSubmit}
							            formData={formData}
							            onReset={this.onReset}
							            editMode={editMode}
							            submissionState={submissionState}
							            connectionError={connectionError}/>
						</Row>
					</CardBody>
				</Card>
				<h1 style={{height: 50}}/>
				<Row>
					<Col md={12} lg={12}>
						<DataTable tableData={tableData} fillForm={this.fillForm} onReset={this.onReset}/>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default reduxForm({
	form: MASTER_FORM_CONSTANTS.masterFormName,
})(MasterPage);

