import {STORE_PROCESS_STATUS_DATA} from '../actions/downloadDataStoreActions';

const initialState = {
    processStatusData: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case STORE_PROCESS_STATUS_DATA:
            return {
                ...state,
                processStatusData: action.processStatusData,
            };
        default:
            return state;
    }
}
