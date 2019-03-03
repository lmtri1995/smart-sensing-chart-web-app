export const STORE_PROCESS_STATUS_DATA = 'STORE_PROCESS_STATUS_DATA';

export function storeProcessStatusData(processStatusData) {
    return {
        type: STORE_PROCESS_STATUS_DATA,
        processStatusData: processStatusData,
    };
}
