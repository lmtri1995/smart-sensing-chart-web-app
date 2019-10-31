export const ALARM_MASTER_PAGE_CONSTANTS = {
	alarmMasterFormName: 'AlarmMasterForm',
	field              : {
		modelNm  : 'model_nm',
		modelCd  : 'model_cd',
		articleNm: 'article_nm',
		articleNo: 'article_no',
		processNm: 'process_nm',
		processCd: 'process_cd',

		tempStandard    : 'temp_standard',
		tempStandardFrom: 'temp_standard_from',
		tempStandardTo  : 'temp_standard_to',

		presStandard    : 'pres_standard',
		presStandardFrom: 'pres_standard_from',
		presStandardTo  : 'pres_standard_to',

		curStandard    : 'cur_standard',
		curStandardFrom: 'cur_standard_from',
		curStandardTo  : 'cur_standard_to',

		tempYellow     : 'temp_yellow',
		tempYellowFirst: 'temp_yellow_first',
		tempYellowLast : 'temp_yellow_last',

		presYellow     : 'pres_yellow',
		presYellowFirst: 'pres_yellow_first',
		presYellowLast : 'pres_yellow_last',

		curYellow     : 'cur_yellow',
		curYellowFirst: 'cur_yellow_first',
		curYellowLast : 'cur_yellow_last',

		tempRed     : 'temp_red',
		tempRedFirst: 'temp_red_first',
		tempRedLast : 'temp_red_last',

		presRed     : 'pres_red',
		presRedFirst: 'pres_red_first',
		presRedLast : 'pres_red_last',

		curRed     : 'cur_red',
		curRedFirst: 'cur_red_first',
		curRedLast : 'cur_red_last',

		remark         : 'remark',
		definitionValue: 'definition_value',

		emptyForm: 'empty_form',
	},
	submissionState    : {
		initial: -1,
		onGoing: 0,
		done   : 1,
	},
	submissionError    : {
		emptyForm: 'Please select a process and fill in the form before submission.',
	},

	enableSubmitText: 'enableSubmitText',
};

export const modelArticleTableColumns = [
	{
		title       : "MODEL",
		field       : ALARM_MASTER_PAGE_CONSTANTS.field.modelNm,
		width       : '49%',
		align       : "center",
		headerFilter: "input"
	},
	{title: "Model Code", field: ALARM_MASTER_PAGE_CONSTANTS.field.modelCd, visible: false},
	{
		title       : "ARTICLE",
		field       : ALARM_MASTER_PAGE_CONSTANTS.field.articleNm,
		width       : '50%',
		align       : "center",
		headerFilter: "input"
	},
	{title: "Article No", field: ALARM_MASTER_PAGE_CONSTANTS.field.articleNo, visible: false},
];

export const modelTableColumns = [
	{
		title       : "MODEL",
		field       : ALARM_MASTER_PAGE_CONSTANTS.field.modelNm,
		width       : '100%',
		align       : "center",
		headerFilter: "input"
	},
	{title: "Model Code", field: ALARM_MASTER_PAGE_CONSTANTS.field.modelCd, visible: false},
];

export const articleTableColumns = [
	{
		title       : "ARTICLE",
		field       : ALARM_MASTER_PAGE_CONSTANTS.field.articleNm,
		width       : '100%',
		align       : "center",
		headerFilter: "input"
	},
	{title: "Article No", field: ALARM_MASTER_PAGE_CONSTANTS.field.articleNo, visible: false},
];

export const processTableColumns = [
	{
		title       : "PROCESS",
		field       : ALARM_MASTER_PAGE_CONSTANTS.field.processNm,
		width       : '100%',
		align       : "center",
		headerFilter: "input"
	},
	{title: "Process No", field: ALARM_MASTER_PAGE_CONSTANTS.field.processCd, visible: false},
];

export const defaultModelArticleTableData = [
	{
		[ALARM_MASTER_PAGE_CONSTANTS.field.modelNm]  : "",
		[ALARM_MASTER_PAGE_CONSTANTS.field.modelCd]  : "",
		[ALARM_MASTER_PAGE_CONSTANTS.field.articleNm]: "",
		[ALARM_MASTER_PAGE_CONSTANTS.field.articleNo]: "",
	},
];

export const defaultModelTableData = [
	/*{
		[ALARM_MASTER_PAGE_CONSTANTS.field.modelNm]  : "",
		[ALARM_MASTER_PAGE_CONSTANTS.field.modelCd]  : "",
	},*/
];

export const defaultArticleTableData = [
	/*{
		[ALARM_MASTER_PAGE_CONSTANTS.field.articleNm]: "",
		[ALARM_MASTER_PAGE_CONSTANTS.field.articleNo]: "",
	},*/
];

export const defaultProcessTableData = [
	/*{
		[ALARM_MASTER_PAGE_CONSTANTS.field.processNm]: "",
		[ALARM_MASTER_PAGE_CONSTANTS.field.processCd]: "",
	},*/
];

let formatStandard = (cell) => {
	cell.getElement().style.color = "#03CF65";
};

let formatYellow = (cell) => {
	cell.getElement().style.color = "#FFD44F";
};

let formatRed = (cell) => {
	cell.getElement().style.color = "#F84E4E";
};

export const alarmSensorTableColumns = [
	{
		title       : "MODEL",
		field       : ALARM_MASTER_PAGE_CONSTANTS.field.modelNm,
		width       : '10%',
		align       : "center",
		headerFilter: "input"
	},
	{title: "MODEL CODE", field: ALARM_MASTER_PAGE_CONSTANTS.field.modelCd, visible: false},
	{
		title       : "ARTICLE",
		field       : ALARM_MASTER_PAGE_CONSTANTS.field.articleNm,
		width       : '9%',
		align       : "center",
		headerFilter: "input"
	},
	{title: "ARTICLE NO", field: ALARM_MASTER_PAGE_CONSTANTS.field.articleNo, visible: false},
	{
		title       : "PROCESS",
		field       : ALARM_MASTER_PAGE_CONSTANTS.field.processNm,
		width       : '10%',
		align       : "center",
		headerFilter: "input"
	},
	{title: "PROCESS CODE", field: ALARM_MASTER_PAGE_CONSTANTS.field.processCd, visible: false},

	{
		title  : "TEMPERATURE",
		columns: [
			{
				title          : "<span style='color:#03CF65; font-size: large'>&nbsp; &nbsp; &nbsp; ●</span>",
				field          : ALARM_MASTER_PAGE_CONSTANTS.field.tempStandard,
				width          : '8%',
				align          : "center",
				formatterParams: formatStandard
			},
			{
				title          : "<span style='color:#FFD44F; font-size: large'>&nbsp; &nbsp; &nbsp; ●</span>",
				field          : ALARM_MASTER_PAGE_CONSTANTS.field.tempYellow,
				width          : '8%',
				align          : "center",
				formatterParams: formatYellow
			},
			{
				title          : "<span style='color:#F84E4E; font-size: large'>&nbsp; &nbsp; &nbsp; ●</span>",
				field          : ALARM_MASTER_PAGE_CONSTANTS.field.tempRed,
				width          : '8%',
				align          : "center",
				formatterParams: formatRed
			},
		],
	},
	{
		title  : "PRESSURE",
		columns: [
			{
				title          : "<span style='color:#03CF65; font-size: large'>&nbsp; &nbsp; &nbsp; ●</span>",
				field          : ALARM_MASTER_PAGE_CONSTANTS.field.presStandard,
				width          : '8%',
				align          : "center",
				formatterParams: formatStandard
			},
			{
				title          : "<span style='color:#FFD44F; font-size: large'>&nbsp; &nbsp; &nbsp; ●</span>",
				field          : ALARM_MASTER_PAGE_CONSTANTS.field.presYellow,
				width          : '8%',
				align          : "center",
				formatterParams: formatYellow
			},
			{
				title          : "<span style='color:#F84E4E; font-size: large'>&nbsp; &nbsp; &nbsp; ●</span>",
				field          : ALARM_MASTER_PAGE_CONSTANTS.field.presRed,
				width          : '8%',
				align          : "center",
				formatterParams: formatRed
			},
		],
	},
	{
		title  : "CURING TIME",
		columns: [
			{
				title          : "<span style='color:#03CF65; font-size: large'>&nbsp; &nbsp; &nbsp; ●</span>",
				field          : ALARM_MASTER_PAGE_CONSTANTS.field.curStandard,
				width          : '8%',
				align          : "center",
				formatterParams: formatStandard
			},
			{
				title          : "<span style='color:#FFD44F; font-size: large'>&nbsp; &nbsp; &nbsp; ●</span>",
				field          : ALARM_MASTER_PAGE_CONSTANTS.field.curYellow,
				width          : '8%',
				align          : "center",
				formatterParams: formatYellow
			},
			{
				title          : "<span style='color:#F84E4E; font-size: large'>&nbsp; &nbsp; &nbsp; ●</span>",
				field          : ALARM_MASTER_PAGE_CONSTANTS.field.curRed,
				width          : '8%',
				align          : "center",
				formatterParams: formatRed
			},
		],
	},
	{
		columns: [
			{field: ALARM_MASTER_PAGE_CONSTANTS.field.tempStandardFrom, visible: false},
			{field: ALARM_MASTER_PAGE_CONSTANTS.field.tempStandardTo, visible: false},
			{field: ALARM_MASTER_PAGE_CONSTANTS.field.tempYellowFirst, visible: false},
			{field: ALARM_MASTER_PAGE_CONSTANTS.field.tempYellowLast, visible: false},
			{field: ALARM_MASTER_PAGE_CONSTANTS.field.tempRedFirst, visible: false},
			{field: ALARM_MASTER_PAGE_CONSTANTS.field.tempRedLast, visible: false},

			{field: ALARM_MASTER_PAGE_CONSTANTS.field.presStandardFrom, visible: false},
			{field: ALARM_MASTER_PAGE_CONSTANTS.field.presStandardTo, visible: false},
			{field: ALARM_MASTER_PAGE_CONSTANTS.field.presYellowFirst, visible: false},
			{field: ALARM_MASTER_PAGE_CONSTANTS.field.presYellowLast, visible: false},
			{field: ALARM_MASTER_PAGE_CONSTANTS.field.presRedFirst, visible: false},
			{field: ALARM_MASTER_PAGE_CONSTANTS.field.presRedLast, visible: false},

			{field: ALARM_MASTER_PAGE_CONSTANTS.field.curStandardFrom, visible: false},
			{field: ALARM_MASTER_PAGE_CONSTANTS.field.curStandardTo, visible: false},
			{field: ALARM_MASTER_PAGE_CONSTANTS.field.curYellowFirst, visible: false},
			{field: ALARM_MASTER_PAGE_CONSTANTS.field.curYellowLast, visible: false},
			{field: ALARM_MASTER_PAGE_CONSTANTS.field.curRedFirst, visible: false},
			{field: ALARM_MASTER_PAGE_CONSTANTS.field.curRedLast, visible: false},

			{field: ALARM_MASTER_PAGE_CONSTANTS.field.definitionValue, visible: false},
		],
	}
];

export const defaultAlarmSensorTableData = [
	{
		[ALARM_MASTER_PAGE_CONSTANTS.field.modelCd]  : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.modelNm]  : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.articleNo]: '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.articleNm]: '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.processCd]: '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.processNm]: '0',

		[ALARM_MASTER_PAGE_CONSTANTS.field.tempStandard]: '0 \u279c 0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.tempYellow]  : '0 \u279c 0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.tempRed]     : '0 \u279c 0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.presStandard]: '0 \u279c 0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.presYellow]  : '0 \u279c 0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.presRed]     : '0 \u279c 0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.curStandard] : '0 \u279c 0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.curYellow]   : '0 \u279c 0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.curRed]      : '0 \u279c 0',

		[ALARM_MASTER_PAGE_CONSTANTS.field.tempStandardFrom]: '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.tempStandardTo]  : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.tempYellowFirst] : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.tempYellowLast]  : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.tempRedFirst]    : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.tempRedLast]     : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.presStandardFrom]: '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.presStandardTo]  : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.presYellowFirst] : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.presYellowLast]  : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.presRedFirst]    : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.presRedLast]     : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.curStandardFrom] : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.curStandardTo]   : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.curYellowFirst]  : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.curYellowLast]   : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.curRedFirst]     : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.curRedLast]      : '0',
		[ALARM_MASTER_PAGE_CONSTANTS.field.definitionValue] : '0',
	}
];
