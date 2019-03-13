export const STORE_STATION_STATUS_DATA = 'STORE_STATION_STATUS_DATA';
export const STORE_SHIFT_STATUS_DATA = 'STORE_SHIFT_STATUS_DATA';
export const STORE_PROCESS_STATUS_DATA = 'STORE_PROCESS_STATUS_DATA';
export const STORE_DOWN_TIME_SHIFT_DATA = 'STORE_DOWN_TIME_SHIFT_DATA';

export function storeStationStatusData(stationStatusData) {
    return {
        type: STORE_STATION_STATUS_DATA,
        stationStatusData: stationStatusData,
    };
}

export function storeShiftStatusData(shiftStatusData) {
    return {
        type: STORE_SHIFT_STATUS_DATA,
        shiftStatusData: shiftStatusData,
    };
}

export function storeProcessStatusData(processStatusData) {
    return {
        type: STORE_PROCESS_STATUS_DATA,
        processStatusData: processStatusData,
    };
}

export function storeDownTimeShiftData(downTimeShiftData) {
    return {
        type: STORE_DOWN_TIME_SHIFT_DATA,
        downTimeShiftData: downTimeShiftData,
    };
}
