import React, {Component}    from 'react';
import {Field, reduxForm}    from 'redux-form';
import PropTypes             from 'prop-types';
import {Button, Col,}        from 'reactstrap';
import renderCheckBoxField   from '../../../shared/components/form/CheckBox';
import renderSelectField     from '../../../shared/components/form/Select';
import validate              from './validate';
import {renderField}         from "../../../shared/components/form/InputField";
import {textAreaField}       from "../../../shared/components/form/TextAreaField";
import LoadingSpinner        from "../../../shared/components/loading_spinner/LoadingSpinner";
import MASTER_FORM_CONSTANTS from "../constants";

class MasterForm extends Component {
	static propTypes = {
		handleSubmit: PropTypes.func.isRequired,
		reset       : PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = {
			categoryCodeOptions: [{
				value: "",
				label: "---",
			}],
			parentCodeOptions  : [{
				value: "",
				label: "---",
			}],
			editMode           : false,
			formData           : {},
		};
		this.disableSubmitButton = true;
	}


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
		const {field}  = MASTER_FORM_CONSTANTS;
		this.props.change(field.masCd.name, formData[field.masCd.name] ? formData[field.masCd.name] : '');
		this.props.change(field.masCdNm.name, formData[field.masCdNm.name] ? formData[field.masCdNm.name] : '');

		this.props.change(field.catCdNm, formData[field.catCdNm] ? formData[field.catCdNm] : '---');
		this.props.change(field.catCd.name, formData[field.catCd.name] ? formData[field.catCd.name] : '');

		this.props.change(field.parentMasNm, formData[field.parentMasNm] ? formData[field.parentMasNm] : '---');
		this.props.change(field.parentMasCd, formData[field.parentMasCd] ? formData[field.parentMasCd] : '');

		this.props.change(
			field.processingSeq.name,
			formData[field.processingSeq.name] != undefined ? formData[field.processingSeq.name] : '0'
		);

		let definitionValue = formData[field.definitionValue] ? formData[field.definitionValue] : "000";
		let definitionArray = definitionValue.split('');
		this.props.change(field.temperature, definitionArray.length > 0 ? definitionArray[0] : '0');
		this.props.change(field.pressure, definitionArray.length > 1 ? definitionArray[1] : '0');
		this.props.change(field.timer, definitionArray.length > 2 ? definitionArray[2] : '0');

		this.props.change(field.virtualYn, formData[field.virtualYn]);
		this.props.change(field.activeYn, formData[field.activeYn]);
		this.props.change(field.sysCodeYn, formData[field.sysCodeYn]);
		this.props.change(field.enableSubmitText, formData[field.enableSubmitText]);

		this.props.change(field.description.name, formData[field.description.name]
		                                          ? formData[field.description.name]
		                                          : '');
	}

	showSubmitPasswordField = () => {
		let {formData} = this.state;
		const {field}  = MASTER_FORM_CONSTANTS;
		return  (this.disableSubmitButton) ? <Field
			name={field.enableSubmitText}
			component={renderField}
			props={{
				value   : formData[field.enableSubmitText] ? formData[field.enableSubmitText] : ''
			}}
			type="text"
			placeholder="Enter password to enable submit button"
			className="form__form-group-field-100"
			onChange={(event, newValue) => {
				if (newValue === MASTER_FORM_CONSTANTS.enableSubmitPassword){
					this.disableSubmitButton = false;
				}
				this.setState({
					formData: {
						...formData,
						[field.enableSubmitText]: newValue,
					}
				});
			}}
		/>: null;
	}

	render() {
		let {
			    handleSubmit, reset,
			    parentCodeOptions, loadParentCodeOptions, categoryCodeOptions,
			    onReset, submissionState, connectionError
		    }          = this.props;
		let {formData} = this.state;
		const {field}  = MASTER_FORM_CONSTANTS;

		console.log("disableSubmitButton: ", this.disableSubmitButton);
		console.log("formData[field.sysCodeYn]: ", formData[field.sysCodeYn]);
		console.log("this.disableSubmitButton || formData[field.sysCodeYn] === 1: ", this.disableSubmitButton || formData[field.sysCodeYn] === 1);

		let definitionValue = formData[field.definitionValue] ? formData[field.definitionValue] : "000";
		let definitionArray = definitionValue.split('');
		let temperature     = definitionArray.length > 0 ? definitionArray[0] : '0';
		let pressure        = definitionArray.length > 1 ? definitionArray[1] : '0';
		let timer           = definitionArray.length > 2 ? definitionArray[2] : '0';

		let enableSubmitPasswordField = this.showSubmitPasswordField();


		return (
			<Col md={12} lg={12}>
				<form className="form form--horizontal" onSubmit={handleSubmit}>
					<Col md={4} lg={4}>
						<div className="form__form-group marginLeft-15">
							<span className="form__form-group-label">Mas Code</span>
							<div className="form__form-group-field">
								<Field
									name={field.masCd.name}
									component={renderField}
									props={{
										disabled: this.state.editMode === true || formData[field.sysCodeYn] === 1,
										value   : formData[field.masCd.name] ? formData[field.masCd.name] : ''
									}}
									type="text"
									className="form__form-group-field-100"
									onChange={(event, newValue) => {
										this.props.change(
											field.hiddenMasCdDuplicatedChecker,
											false
										);
										this.setState({
											formData: {
												...formData,
												[field.masCd.name]: newValue,
											}
										});
									}}
								/>
							</div>
						</div>
					</Col>
					<Col md={8} lg={8}>
					</Col>
					<Col md={4} lg={4}>
						<div className="form__form-group marginLeft-15">
							<span className="form__form-group-label">General Name</span>
							<div className="form__form-group-field">
								<Field
									name={field.masCdNm.name}
									component={renderField}
									props={{
										disabled: formData[field.sysCodeYn] === 1,
										value   : formData[field.masCdNm.name] ? formData[field.masCdNm.name] : ''
									}}
									type="text"
									className="form__form-group-field-100"
									onChange={(event, newValue) => this.setState({
										formData: {
											...formData,
											[field.masCdNm.name]: newValue,
										}
									})}
								/>
							</div>
						</div>
					</Col>
					<Col md={8} lg={8}>
					</Col>
					<Col md={4} lg={4}>
						<div className="form__form-group marginLeft-15">
							<span className="form__form-group-label">Category</span>
							<div className="form__form-group-field">
								<Field
									name={field.catCdNm}
									component={renderSelectField}
									options={categoryCodeOptions}
									props={{
										disabled: formData[field.sysCodeYn] === 1,
										selected: {
											value: formData[field.catCd.name] ? formData[field.catCd.name] : '',
											label: formData[field.catCdNm] ? formData[field.catCdNm] : '---',
										},
									}}
									placeholder={formData[field.catCdNm] ? formData[field.catCdNm] : '---'}
									className="form__form-group-field-100"
									onChange={selectedOption => {
										console.log("171: ::::::::::::::::", selectedOption);
										loadParentCodeOptions(formData, selectedOption.label, selectedOption.value);
									}}
								/>
							</div>
						</div>
					</Col>
					<Col md={3} lg={3}>
						<Field
							name={field.catCd.name}
							component={renderField}
							props={{
								disabled: true,
								value   : formData[field.catCd.name] ? formData[field.catCd.name] : ''
							}}
							className="marginLeft-15"
							type="text"
						/>
					</Col>
					<Col md={2} lg={2}></Col>
					<Col md={3} lg={3}>
						<div className="form__form-group-field">
							<Field
								name={field.virtualYn}
								component={renderCheckBoxField}
								label="Virtual(Y/N)"
								props={{
									disabled: formData[field.sysCodeYn] === 1,
								}}
								checked={formData[field.virtualYn] === 1}
								onChange={(event, newValue) => {
									this.setState({
										formData: {
											...formData,
											[field.virtualYn]: newValue ? 1 : 0,
										},
									});
								}}
							/>
						</div>
					</Col>
					<Col md={4} lg={4}>
						<div className="form__form-group marginLeft-15">
							<span className="form__form-group-label">Parent Code</span>
							<div className="form__form-group-field">
								<Field
									name={field.parentMasNm}
									component={renderSelectField}
									options={parentCodeOptions}
									props={{
										disabled: formData[field.sysCodeYn] === 1,
										selected: {
											value: formData[field.parentMasCd] ? formData[field.parentMasCd] : '',
											label: formData[field.parentMasNm] ? formData[field.parentMasNm] : '---',
										},
									}}
									placeholder={formData[field.parentMasNm] ? formData[field.parentMasNm] : '---'}
									onChange={selectedOption => this.setState({
										formData: {
											...formData,
											[field.parentMasNm]: selectedOption.label,
											[field.parentMasCd]: selectedOption.value,
										}
									})}
									className="form__form-group-field-100"
								/>
							</div>
						</div>
					</Col>
					<Col md={3} lg={3}>
						<Field
							name={field.parentMasCd}
							component={renderField}
							props={{
								disabled: true,
								value   : formData[field.parentMasCd] ? formData[field.parentMasCd] : ''
							}}
							className="marginLeft-15"
							type="text"
						/>
					</Col>
					<Col md={2} lg={2}></Col>
					<Col md={3} lg={3}>
						<div className="form__form-group-field">
							<Field
								name={field.activeYn}
								component={renderCheckBoxField}
								label="Active(Y/N)"
								props={{
									disabled: formData[field.sysCodeYn] === 1,
								}}
								checked={formData[field.activeYn] === 1}
								onChange={(event, newValue) => {
									this.setState({
										formData: {
											...formData,
											[field.activeYn]: newValue ? 1 : 0,
										},
									});
								}}
							/>
						</div>
					</Col>
					<Col md={4} lg={4}>
						<div className="form__form-group marginLeft-15">
							<span className="form__form-group-label">Process Sequence</span>
							<div className="form__form-group-field">
								<Field
									name={field.processingSeq.name}
									component="input"
									type="text"
									component={renderField}
									props={{
										disabled: formData[field.sysCodeYn] === 1,
										value   : formData[field.processingSeq.name] != undefined
										          ? formData[field.processingSeq.name]
										          : '0'
									}}
									className="round_corner form__form-group-field-100"
									onChange={(event, newValue) => {
										if (/^0+[0-9]*$/.test(newValue)) {
											newValue = +newValue;
										}
										this.setState({
											formData: {
												...formData,
												[field.processingSeq.name]: newValue,
											}
										});
									}}
								/>
							</div>
						</div>
					</Col>
					<Col md={3} lg={3} style={{marginLeft: -15}}>
						<div style={{display: 'flex', flexDirection: "row", justifyContent: "space-between"}}>
							<div style={{display: 'flex',}}>
								<Field
									name={field.temperature}
									component={renderField}
									props={{
										disabled: formData[field.sysCodeYn] === 1
										          || field.masCd
										                  .processFixedNoOfSensors
										                  .includes(parseInt(formData[field.masCd.name])),
										style   : {width: 35, marginRight: 5},
										value   : temperature,
									}}
									onChange={(event, newValue) => {
										let definitionValueRange = MASTER_FORM_CONSTANTS.definitionValueRange;
										let value                = +newValue;
										if (value > definitionValueRange[definitionValueRange.length - 1]) {
											value = definitionValueRange[definitionValueRange.length - 1];
										} else if ( // Is a character OR less than 'definitionValueRange[0]'
											isNaN(value) || !(value in definitionValueRange)
											|| value < definitionValueRange[0]
										) {
											value = definitionValueRange[0];
										}
										this.props.change(field.temperature, value);
										this.setState({
											formData: {
												...formData,
												[field.definitionValue]: `${value}${pressure}${timer}`,
											},
										});
									}}
								/>
								<span className="form__form-group-label" style={{width: 80}}>Temperature</span>
							</div>
							<div style={{display: 'flex',}}>
								<Field
									name={field.pressure}
									component={renderField}
									props={{
										disabled: formData[field.sysCodeYn] === 1
										          || field.masCd
										                  .processFixedNoOfSensors
										                  .includes(parseInt(formData[field.masCd.name])),
										style   : {width: 35, marginRight: 5},
										value   : pressure,
									}}
									onChange={(event, newValue) => {
										let definitionValueRange = MASTER_FORM_CONSTANTS.definitionValueRange;
										let value                = +newValue;
										if (value > definitionValueRange[definitionValueRange.length - 1]) {
											value = definitionValueRange[definitionValueRange.length - 1];
										} else if ( // Is a character OR less than 'definitionValueRange[0]'
											isNaN(value) || !(value in definitionValueRange)
											|| value < definitionValueRange[0]
										) {
											value = definitionValueRange[0];
										}
										this.props.change(field.pressure, value);
										this.setState({
											formData: {
												...formData,
												[field.definitionValue]: `${temperature}${value}${timer}`,
											},
										});
									}}
								/>
								<span className="form__form-group-label" style={{width: 55}}>Pressure</span>
							</div>
							<div style={{display: 'flex',}}>
								<Field
									name={field.timer}
									component={renderField}
									props={{
										disabled: formData[field.sysCodeYn] === 1
										          || field.masCd
										                  .processFixedNoOfSensors
										                  .includes(parseInt(formData[field.masCd.name])),
										style   : {width: 35, marginRight: 5},
										value   : timer,
									}}
									onChange={(event, newValue) => {
										let definitionValueRange = MASTER_FORM_CONSTANTS.definitionValueRange;
										let value                = +newValue;
										if (value > definitionValueRange[definitionValueRange.length - 1]) {
											value = definitionValueRange[definitionValueRange.length - 1];
										} else if ( // Is a character OR less than 'definitionValueRange[0]'
											isNaN(value) || !(value in definitionValueRange)
											|| value < definitionValueRange[0]
										) {
											value = definitionValueRange[0];
										}
										this.props.change(field.timer, value);
										this.setState({
											formData: {
												...formData,
												[field.definitionValue]: `${temperature}${pressure}${value}`,
											},
										});
									}}
								/>
								<span className="form__form-group-label" style={{width: 75}}>Curing Time</span>
							</div>
						</div>
					</Col>
					<Col md={2} lg={2}>
					</Col>
					<Col md={3} lg={3} style={{
						marginLeft: 15
					}}>
						<div className="form__form-group-field">
							<Field
								name={field.sysCodeYn}
								component={renderCheckBoxField}
								label="Sys Code(Y/N)"
								props={{
									disabled: true,
								}}
								checked={formData[field.sysCodeYn] === 1}
								onChange={(event, newValue) => {
									this.setState({
										formData: {
											...formData,
											[field.sysCodeYn]: newValue ? 1 : 0,
										},
									});
								}}
							/>
						</div>
					</Col>
					<Col md={4} lg={4}>
						<div className="form__form-group marginLeft-15">
							<span className="form__form-group-label">Description</span>
							<div className="form__form-group-field">
								<Field
									name={field.description.name}
									wrap={true}
									component={textAreaField}
									style={{width: 360, height: 100}}
									placeholder="Description here"
									props={{
										disabled: formData[field.sysCodeYn] === 1,
										value   : formData[field.description.name]
										          ? formData[field.description.name]
										          : ''
									}}
									onChange={(event, newValue) => {
										if (newValue.length > field.description.maxLength) {
											newValue = newValue.slice(0, -1);
										}
										this.setState({
											formData: {
												...formData,
												[field.description.name]: newValue,
											}
										});
									}}
								/>
							</div>
						</div>
					</Col>
					<Col md={8} lg={8}>
					</Col>
					<Col  md={4} lg={4}>
						<div className="form__form-group-field" style={{marginLeft: 105}}>
							{
								enableSubmitPasswordField
							}
						</div>
					</Col>
					<Col  md={4} lg={4}>
						<div className="form__form-group-field justify-content-center">
							<Button color="primary" type="submit" disabled={this.disableSubmitButton || formData[field.sysCodeYn] === 1}>
								{
									(() => {
										let {failed, initial, onGoing, done} = MASTER_FORM_CONSTANTS.submissionState;
										if (this.state.editMode) {
											switch (submissionState) {
												case failed:
													return 'Failed';
												case initial:
													this.props.change(
														field.hiddenMasCdDuplicatedChecker,
														formData[field.hiddenMasCdDuplicatedChecker]
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
														field.hiddenMasCdDuplicatedChecker,
														formData[field.hiddenMasCdDuplicatedChecker]
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
					</Col>
					<Col md={4} lg={4}></Col>


					<div className="form__form-group-field justify-content-center text-light">
						{connectionError}
					</div>
				</form>
			</Col>
		);
	}
}

export default reduxForm({
	form: MASTER_FORM_CONSTANTS.masterFormName,
	validate,
})(MasterForm);
