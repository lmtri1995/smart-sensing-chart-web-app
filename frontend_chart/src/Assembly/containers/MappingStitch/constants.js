const MAPPING_STITCH_CONSTANTS = {
	mappingStitchFormName: 'MappingStitchForm',
	field              : {
		entryDate  : 'entry_date',
		factoryCode: 'factory_cd',
		factoryName: 'factory_nm',
		processCode: 'process_cd',
		processName: 'process_nm',
		macAddress: 'mac_address',
		lineCode: 'line_cd',
		lineName: 'line_nm',
		posittionName: 'position_nm',
		posittionCode: 'position_no',
		active: 'active_yn',
		description: 'description',
		emptyForm: 'empty_form',
		hiddenMacAddressDuplicatedChecker: 'hiddenMacAddressDuplicatedChecker',
		enableSubmitText: 'enableSubmitText',
	},
	submissionState    : {
		failed : -1,
		initial: 0,
		onGoing: 1,
		done   : 2,
	},
	submissionError    : {
		emptyForm: 'Please select a process and fill in the form before submission.',
	},
};
export default MAPPING_STITCH_CONSTANTS;
