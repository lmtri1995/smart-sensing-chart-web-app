import {GLOBAL_SHIFT_FILTER} from "../actions/globalShiftFilterActions";

const initialState = {
    shiftNumber: 0, // Shift index of SHIFT_DESCRIPTIONS in constants file -> 0: Shift 1, 1: Shift 2, 2: Shift 3
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
