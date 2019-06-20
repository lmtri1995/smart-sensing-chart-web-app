import {GLOBAL_SHIFT_FILTER} from "../actions/globalShiftFilterActions";
import {SHIFT_OPTIONS} from "../../constants/constants";

const initialState = {
    selectedShift: SHIFT_OPTIONS[0],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GLOBAL_SHIFT_FILTER:
            return {
                ...state,
                selectedShift: action.selectedShift,
            };
        default:
            return state;
    }
}
