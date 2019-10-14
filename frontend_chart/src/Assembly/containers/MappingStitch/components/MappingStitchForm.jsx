import React, {Component}                                          from "react";
import {Field, reduxForm}                                          from "redux-form";
import validate                                                    from "../components/validate";
import {Button, Col}                                               from "reactstrap";
import {renderField}                                               from "../../../shared/components/form/InputField";
import MAPPING_STITCH_CONSTANTS                                    from "../constants";
import renderCheckBoxField                                         from "../../../shared/components/form/CheckBox";
import renderSelectField                                           from "../../../shared/components/form/Select";
import {textAreaField}                                             from "../../../shared/components/form/TextAreaField";
import {ASSEMBLY_API, FILTER_LINE, FILTER_FACTORY, FILTER_PROCESS} from "../../../constants/urlConstants";
import callAxios                                                   from "../../../services/api";
import {ARRAY_FACTORIES, ARRAY_LINES}                              from "../../../constants/propertyConstants";
import moment                                                      from "moment";
import MASTER_FORM_CONSTANTS                                       from "../../MasterPage/constants";
import LoadingSpinner
                                                                   from "../../../shared/components/loading_spinner/LoadingSpinner";

class MappingStitchForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			formData           : {},
		}
	}

	componentDidMount() {
		this.fillFactoryCombobox();
		this.fillLineCombobox();
		this.fillPosittionCombobox();
		this.fillProcessCombobox();
	}

	fillFactoryCombobox = () => {
		let method = 'POST';
		let url    = ASSEMBLY_API + FILTER_FACTORY;
		let params = {
			"dropdownlist-name": "factory"
		};

		callAxios(method, url, params).then(response => {
			try {
				let dataArray  = response.data.data;
				let factoryCodeOptions = [...ARRAY_FACTORIES];
				dataArray.forEach(element => {
					factoryCodeOptions.push(
						{value: element.code, label: element.name}
					);
				});

				this.setState({
					...this.state,
					factoryCodeOptions: factoryCodeOptions.length > 0 ? factoryCodeOptions : ARRAY_FACTORIES,
				});
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	fillLineCombobox = () => {
		let method = 'POST';
		let url    = ASSEMBLY_API + FILTER_LINE;
		let params = {
			"dropdownlist-name": "line"
		};

		callAxios(method, url, params).then(response => {
			try {
				let dataArray  = response.data.data;
				let lineCodeOptions = [...ARRAY_LINES];
				dataArray.forEach(element => {
					lineCodeOptions.push(
						{value: element.code, label: element.name}
					);
				});

				this.setState({
					...this.state,
					lineCodeOptions: lineCodeOptions.length > 0 ? lineCodeOptions : ARRAY_LINES,
				});
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.formData !== prevProps.formData || this.props.editMode !== prevProps.editMode) {
			this.setState({
				formData: this.props.formData,
				editMode: this.props.editMode,
			});
			if (Object.keys(this.props.formData).length === 0 && this.props.formData.constructor === Object) {
				this.props.reset();  // Prevent error showing after form submission (clear all fields)
			}
		}

		let {formData} = this.state;
		const {field}  = MAPPING_STITCH_CONSTANTS;
		this.props.change(field.entryDate, formData[field.entryDate] ? moment.unix(formData[field.entryDate]).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY'));
		this.props.change(field.macAddress, formData[field.macAddress] ? formData[field.macAddress] : '');
		this.props.change(field.factoryCode, formData[field.factoryCode] ? formData[field.factoryCode] : '');
		this.props.change(field.factoryName, formData[field.factoryName] ? formData[field.factoryName] : '---');
		this.props.change(field.lineCode, formData[field.lineCode] ? formData[field.lineCode] : '');
		this.props.change(field.lineName, formData[field.lineName] ? formData[field.lineName] : '---');
		this.props.change(field.processCode, formData[field.processCode] ? formData[field.processCode] : '');
		this.props.change(field.processName, formData[field.processName] ? formData[field.processName] : '---');
		this.props.change(field.posittionCode, formData[field.posittionCode] ? formData[field.posittionCode] : '');
		this.props.change(field.posittionName, formData[field.posittionName] ? formData[field.posittionName] : '---');
		this.props.change(field.description, formData[field.description] ? formData[field.description] : '');
		this.props.change(field.active, formData[field.active] ? formData[field.active] : "");
		this.props.change(field.hiddenMacAddressDuplicatedChecker, formData[field.hiddenMacAddressDuplicatedChecker] ? formData[field.hiddenMacAddressDuplicatedChecker] : false);
		//this.props.change(field.masCdNm.name, formData[field.masCdNm.name] ? formData[field.masCdNm.name] : '');
	}

	fillProcessCombobox = () => {
		let method = 'POST';
		let url    = ASSEMBLY_API + FILTER_PROCESS;
		let params = {
			"dropdownlist-name": "process",
			"code": "20101,20103,20104,20107"
		};

		callAxios(method, url, params).then(response => {
			try {
				let dataArray  = response.data.data;
				let processCodeOptions = [...ARRAY_FACTORIES];
				dataArray.forEach(element => {
					processCodeOptions.push(
						{value: element.code, label: element.name}
					);
				});

				this.setState({
					...this.state,
					processCodeOptions: processCodeOptions.length > 0 ? processCodeOptions : ARRAY_FACTORIES,
				});
			} catch (e) {
				console.log("Error: ", e);
			}
		});
	};

	fillPosittionCombobox = (processCode) => {
		let posittionCodeOptions = [
								{value: '', label:'---'},
								{value: '1', label:'Start'},
								{value: '9', label:'End'},
								];
		if (processCode === "20107"){
			posittionCodeOptions = [
				{value: '', label:'---'},
				{value: '1', label:'Start'},
			];
		}
		this.setState({
			...this.state,
			posittionCodeOptions: posittionCodeOptions
		});
	};

	render(){
		let { handleSubmit, reset, onReset, editMode, submissionState}    = this.props;
		const {field} = MAPPING_STITCH_CONSTANTS;
		let {formData, lineCodeOptions, posittionCodeOptions, factoryCodeOptions, processCodeOptions} = this.state;
		return (
			<Col md={12} lg={12}>
				<form className="form form--horizontal" onSubmit={handleSubmit}>
					<div className="d-flex flex-row" style={{width: '100%'}}>
						<div className="d-flex flex-column" style={{width: '30%', padding: 60, backgroundColor: '#1A1F27'}}>
							<div className="form__form-group marginLeft-15">
								<span className="form__form-group-label">Entry Date</span>
								<div className="form__form-group-field">
									<Field
										name={field.entryDate}
										component={renderField}
										type="text"
										className="form__form-group-field-100"
										props={{
											disabled: true,
											value   : formData[field.entryDate] ? moment.unix(formData[field.entryDate]).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY')
										}}
										onChange={(event, newValue) => {
											this.setState({
												formData: {
													...formData,
													[field.entryDate]: newValue,
												}
											});
										}}
									/>
								</div>
							</div>
							<div className="form__form-group marginLeft-15" style={{paddingTop: 16}}>
								<span className="form__form-group-label">Sensor Mac Address</span>
								<div className="form__form-group-field">
									<Field
										name={field.macAddress}
										component={renderField}
										type="text"
										className="form__form-group-field-100"
										props={{
											disabled: editMode === true,
											value   : formData[field.macAddress] ? formData[field.macAddress] : ''
										}}
										onChange={(event, newValue) => {
											this.props.change(
												field.hiddenMacAddressDuplicatedChecker,
												false
											);
											this.setState({
												formData: {
													...formData,
													[field.macAddress]: newValue,
												}
											});
										}}
									/>
								</div>
							</div>
							<div className="form__form-group-field" style={{marginTop: 20, marginLeft: 230}}>
								<Field
									name={field.active}
									component={renderCheckBoxField}
									label="Active(Y/N)"
									checked = {formData[field.active] === true || formData[field.active] === 1}
									props={{
										value           : formData[field.active] ? formData[field.active] : '',
										/*value           : (() => {
											console.log("219 219 219");
											console.log("219 219 219");
											console.log("219 219 219");
											if (formData[field.active] == null){
												return true;
											} else {
												return formData[field.active] ? formData[field.active] : '';
											}
										})*/
									}}
									onChange={(event, newValue) => {
										this.setState({
											formData: {
												...formData,
												[field.active]: newValue ? newValue : '',
											},
										});
									}}
								/>
							</div>
						</div>
						<div className="d-flex flex-column" style={{width: '70%', padding: 50, backgroundColor: '#1E2229'}}>
							<div className="d-flex flex-row">
								<div className="form__form-group marginLeft-15" style={{width:'35%'}}>
									<span className="form__form-group-label">Factory</span>
									<div className="form__form-group-field">
										<Field
											name={field.factoryCode}
											component={renderSelectField}
											options={factoryCodeOptions}
											className="form__form-group-field-100"
											props={{
												selected: {
													value: formData[field.factoryCode] ? formData[field.factoryCode] : '',
													label: formData[field.factoryName] ? formData[field.factoryName] : '---',
												},
											}}
											onChange={(event, newValue) => {
												this.props.change(
													field.factoryName,
													newValue.label
												);
												this.setState({
													formData: {
														...formData,
														[field.factoryName]: newValue.label,
														[field.factoryCode]: newValue.value,
													}
												});
											}}
										/>
									</div>
								</div>
								<div style={{width:'10%'}}></div>
								<div className="d-flex flex-row" style={{width:'55%'}}>
									<div className="d-flex flex-row" style={{width:'60%'}}>
										<span className="form__form-group-label">Line No.</span>
										<div className="form__form-group-field">
											<Field
												name={field.lineName}
												component={renderSelectField}
												options={lineCodeOptions}
												className="form__form-group-field-100"
												props={{
													selected: {
														value: formData[field.lineCode] ? formData[field.lineCode] : '',
														label: formData[field.lineName] ? formData[field.lineName] : '---',
													},
												}}
												onChange={(event, newValue) => {
													this.setState({
														formData: {
															...formData,
															[field.lineCode]: newValue.value,
															[field.lineName]: newValue.label,
														}
													});
												}}
											/>
										</div>
									</div>
									<div className="form__form-group"  style={{width:'40%', marginLeft: 30, marginTop: 18}}>
										<Field
											name={field.lineCode}
											component={renderField}
											className="marginLeft-15"
											type="text"
											props={{
												disabled: true,
												value   : formData[field.lineCode] ? formData[field.lineCode] : ''
											}}
											onChange={(event, newValue) => {
												this.setState({
													formData: {
														...formData,
														[field.lineCode]: newValue,
													}
												});
											}}
										/>
									</div>
								</div>
							</div>

							<div className="d-flex flex-row">
								<div className="form__form-group marginLeft-15" style={{width:'35%'}}>
									<span className="form__form-group-label">Process</span>
									<div className="form__form-group-field">
										<Field
											name={field.processCode}
											component={renderSelectField}
											options={processCodeOptions}
											props={{
												disabled: formData[field.sysCodeYn] === 1,
												selected: {
													value: formData[field.processCode] ? formData[field.processCode] : '',
													label: formData[field.processName] ? formData[field.processName] : '---',
												},
											}}
											onChange={(event, newValue) => {
												/*this.props.change(
													field.lineName,
													newValue.label
												);*/
												this.fillPosittionCombobox(newValue.value);
												this.setState({
													formData: {
														...formData,
														[field.processName]: newValue.label,
														[field.processCode]: newValue.value,
														[field.posittionCode]: '',
														[field.posittionName]: '',
													}
												});
											}}
											className="form__form-group-field-100"
										/>
									</div>
								</div>
								<div style={{width:'10%'}}></div>
								<div className="d-flex flex-row" style={{width: '55%'}}>
									<div className="d-flex flex-row" style={{width:'60%'}}>
										<span className="form__form-group-label">Posittion No.</span>
										<div className="form__form-group-field">
											<Field
												name={field.posittionName}
												component={renderSelectField}
												options={posittionCodeOptions}
												className="form__form-group-field-100"
												props={{
													disabled: formData[field.sysCodeYn] === 1,
													selected: {
														value: formData[field.posittionCode] ? formData[field.posittionCode] : '',
														label: formData[field.posittionName] ? formData[field.posittionName] : '---',
													},
												}}
												onChange={(event, newValue) => {
													this.setState({
														formData: {
															...formData,
															[field.posittionName]: newValue.label,
															[field.posittionCode]: newValue.value,
														}
													});
												}}
											/>
										</div>
									</div>
									<div className="form__form-group"  style={{width:'40%', marginLeft: 30, marginTop: 18}}>
										<Field
											name={field.posittionCode}
											component={renderField}
											className="marginLeft-15"
											type="text"
											props={{
												disabled: true,
												value   : formData[field.posittionCode] ? formData[field.posittionCode] : ''
											}}
											onChange={(event, newValue) => {
												this.setState({
													formData: {
														...formData,
														[field.posittionCode]: newValue,
													}
												});
											}}
										/>
									</div>
								</div>
							</div>



							<div className="form__form-group marginLeft-15">
								<div className="form__form-group-field">
									<Field
										name={field.description}
										component={textAreaField}
										placeholder="Description here"
										props={{
											value   : formData[field.description] ? formData[field.description] : ''
										}}
										style={{width:827}}
										onChange={(event, newValue) => {
											this.setState({
												formData: {
													...formData,
													[field.description]: newValue,
												}
											});
										}}
									/>
								</div>
							</div>
							<div className="form__form-group-field justify-content-center">
								<Button color="primary" type="submit">
									{
										(() => {
											let {failed, initial, onGoing, done} = MASTER_FORM_CONSTANTS.submissionState;
											if (this.state.editMode) {
												switch (submissionState) {
													case failed:
														return 'Failed';
													case initial:
														this.props.change(
															field.hiddenMacAddressDuplicatedChecker,
															formData[field.hiddenMacAddressDuplicatedChecker]
														);
														return 'Save';
													case onGoing:
														return 'Saving';
													case done:
														return 'Saved';
													default:
														return 'Save';
												}
											} else {
												switch (submissionState) {
													case failed:
														this.props.change(
															field.hiddenMacAddressDuplicatedChecker,
															formData[field.hiddenMacAddressDuplicatedChecker]
														);
														return 'Failed';
													case initial:
														return 'Submit';
													case onGoing:
														return 'Submitting';
													case done:
														return 'Submitted';
													default:
														return 'Submit';
												}
											}
										})()
									}
									{
										submissionState === MASTER_FORM_CONSTANTS.submissionState.onGoing
										? <LoadingSpinner/>
										: ''
									}
								</Button>
								<Button type="button" onClick={() => {
									reset();
									this.setState({
										formData: {},
										editMode: false,
									});
									onReset();
								}}>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				</form>
			</Col>
		);
	}
}
export default reduxForm({
	form: MAPPING_STITCH_CONSTANTS.mappingStitchFormName,
	validate,
})(MappingStitchForm);
