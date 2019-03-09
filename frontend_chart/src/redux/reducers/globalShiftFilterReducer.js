import {GLOBAL_SHIFT_FILTER} from "../actions/globalShiftFilterActions";

const initialState = {
    shiftNumber: 1,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GLOBAL_SHIFT_FILTER:
            return {
                ...state,
                shiftNumber: action.shiftNumber,
            };
        default:
            return state;
    }
}
