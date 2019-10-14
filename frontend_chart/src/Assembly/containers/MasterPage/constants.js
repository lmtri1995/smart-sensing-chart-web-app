const MASTER_FORM_CONSTANTS = {
	masterFormName      : 'MasterForm',
	field               : {
		masCd                       : {
			name                   : 'masCd',
			maxLength              : 20,
			processFixedNoOfSensors: [20105, 20106, 20107, 20108, 20109, 20110, 20111],
		},
		hiddenMasCdDuplicatedChecker: 'hiddenMasCdDuplicatedChecker',
		masCdNm                     : {
			name     : 'masCdName',
			maxLength: 50,
		},

		catCdNm: 'cateCdName',
		catCd  : {
			name                    : 'cateCd',
			catCdsRequireParentMasCd: [102, 302],
		},

		parentMasNm: 'parentMasName',
		parentMasCd: 'parentMasCd',

		virtualYn: 'virtualYn',
		activeYn : 'activeYn',
		sysCodeYn: 'sysCodeYn',

		processingSeq: {
			name     : 'processingSeq',
			maxLength: 6,
		},

		definitionValue: 'definitionValue',
		temperature    : 'temperature',
		pressure       : 'pressure',
		timer          : 'curingTime',

		description: {
			name     : 'remark',
			maxLength: 400,
		},
	},
	definitionValueRange: [0, 1, 2, 3, 4, 5, 6, 7, 8],
	submissionState     : {
		failed : -1,
		initial: 0,
		onGoing: 1,
		done   : 2,
	}
};

export default MASTER_FORM_CONSTANTS;
