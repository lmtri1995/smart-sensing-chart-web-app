let hostname = window.location.hostname;
let SERVER_URL_VAR = 'http://10.2.17.12:8888';
/*if (hostname.includes("smart-r")){
	SERVER_URL_VAR = 'http://smart-r.hsvina.com:8888';//factory server
}*/
export const SERVER_URL = SERVER_URL_VAR;

export const ASSEMBLY_API = '/api/asc/';
export const CATEGORY_ROUTE = 'cate';
export const PARENT_ROUTE = 'parent';
export const MAS_CODE_ROUTE = 'mascodelist';
export const ALARM_MODEL_ARTICLE = 'masalarmlist';
export const ALARM_ARTICLE = 'masalarmarticlelist';
export const ALARM_LIST_PROCESS = 'masprocesslist';
export const ALARM_SENSOR = 'masalarmsensorlist';
export const MAPPING_STITCH = 'mappingmachinearduinolist';
export const MAPPING_STITCH_IU = 'mappingmachinearduino';
export const FILTER_FACTORY = 'factory';
export const FILTER_LINE = 'line';
export const FILTER_MODEL = 'model';
export const FILTER_ARTICLE = 'article';
export const FILTER_PROCESS = 'process';
export const PRODUCTION_LEAD_TIME = 'search/production-lead-time';
export const WORKING_HOUR_LEAD_TIME = 'search/working-hour';
export const PRODUCTION_LEAD_TIME_DETAIL = 'search/process_working-hour';
export const ALARM_HISTORY = 'search/alarm-history';
export const MACHINE_ALARM_STATUS = 'search/machine-alarm-status';
export const SENSING_VALUE = 'search/process_machine-alarm-status';
export const SENSING_TEMP = 'search/sensing-temp';
export const SENSING_PRESS = 'search/sensing-press';
export const SENSING_TIME = 'search/sensing-time';
export const LEARNING_CURVE_PROCESS = 'search/learning-curve-status';
export const LEARNING_CURVE_MODEL = 'search/model-learning-curve-status';
export const LEARNING_CURVE_CHART = 'search/chart-learning-curve-status';
export const LEARNING_CURVE_PROCESS_UPDATE = 'maslearningcurve';
export const DEFECT_CHART_STATUS = 'search/defect-chart-status';
export const DEFECT_WORKING_HOUR = 'search/defect-working-hour';
export const DEFECT_SUMMARY      = 'search/defect-summary-table';
export const PROCESS_CHART_DASHBOARD = 'search/process_chart_dashboard';
export const PROCESS_TEMP_DASHBOARD = 'search/process_temp_dashboard';
export const LINE_PRODUCTIVITY = 'search/process_line_productivity_dashboard';
export const PROCESS_MACHINE_DASHBOARD = 'search/process_machine_dashboard';





