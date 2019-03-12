import {GLOBAL_SHIFT_FILTER} from "../actions/globalShiftFilterActions";
import {SHIFT_DESCRIPTIONS} from "../../constants/constants";

const initialState = {
    selectedShift: SHIFT_DESCRIPTIONS[0],
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
