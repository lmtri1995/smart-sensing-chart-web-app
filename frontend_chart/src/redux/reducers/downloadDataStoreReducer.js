import {
    STORE_DEFECT_RATE_DATA,
    STORE_DOWN_TIME_SHIFT_DATA,
    STORE_PROCESS_STATUS_DATA,
    STORE_PRODUCTION_RATE_DATA,
    STORE_SHIFT_STATUS_DATA,
    STORE_STATION_STATUS_DATA
} from '../actions/downloadDataStoreActions';

const initialState = {
    stationStatusData: null,
    shiftStatusData: null,
    processStatusData: null,
    downTimeShiftData: null,
    productionRateData: null,
    defectRateData: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case STORE_STATION_STATUS_DATA:
            return {
                ...state,
                stationStatusData: action.stationStatusData,
            };
        case STORE_SHIFT_STATUS_DATA:
            return {
                ...state,
                shiftStatusData: action.shiftStatusData,
            };
        case STORE_PROCESS_STATUS_DATA:
            return {
                ...state,
                processStatusData: action.processStatusData,
            };
        case STORE_DOWN_TIME_SHIFT_DATA:
            return {
                ...state,
                downTimeShiftData: action.downTimeShiftData,
            };
        case STORE_PRODUCTION_RATE_DATA:
            return {
                ...state,
                productionRateData: action.productionRateData,
            };
        case STORE_DEFECT_RATE_DATA:
            return {
                ...state,
                defectRateData: action.defectRateData,
            };
        default:
            return state;
    }
}
