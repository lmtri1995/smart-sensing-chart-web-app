export const FETCHING_DATA = 'FETCHING_DATA';
export const FETCHING_DATA_SUCCESS = 'FETCHING_DATA_SUCCESS';
export const FETCHING_DATA_FAILURE = 'FETCHING_DATA_FAILURE';

export const LOCAL_IP_TEMP_TREND = {
    IP_TEMP_TREND_ARRAY: 'IP_TEMP_TREND_ARRAY',
    OS_TEMP_TREND_ARRAY: 'OS_TEMP_TREND_ARRAY',
    IP_TEMP_STOCK_CAPACITY: 10000,  // Maximum rows can be saved in the local storage
    IP_TEMP_ITEM_TO_GET: 1000,  // Number of items that will be gotten to show on grid
    IP_TEMP_TIME_SPACE_GET_FROM_STOCK: 2000,    // Time space to get an amount of data from stock
    // to show on grid,
    // 1000 is equivalent to 1 second
    IP_TEMP_TIME_SPACE_PUSH_TO_STOCK: 3000,
};

export const ROLES = {
    ROLE_ADMIN: 'admin',
    ROLE_IP: 'admin',
    ROLE_OS: 'os',
    ROLE_AS: 'as',
};

// Factory Shift time rule: 3 shifts per day
// Shift 1 => Starts at 6:00:00 AM today
// Shift 3 => Ends at 5:59:59 AM tomorrow
export const START_WORK_DAY_TIME = {hours: 6, minutes: 0, seconds: 0};
export const END_WORK_DAY_TIME = {hours: 5, minutes: 59, seconds: 59};

// Data Export Type
export const ExportType = {
    EXCEL: 'Excel',
    PDF: 'PDF',
    PNG: 'PNG',
};

// ID for HTML elements to generate canvas of the elements thru html2canvas library
export const DashboardContainerID = 'dashboardContainerID';
