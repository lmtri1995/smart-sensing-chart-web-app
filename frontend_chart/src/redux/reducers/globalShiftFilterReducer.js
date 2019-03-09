import {GLOBAL_SHIFT_FILTER} from "../actions/globalShiftFilterActions";
import {SHIFT_DESCRIPTIONS} from "../../constants/constants";

const initialState = {
    selectedShifts: new Map([
        [SHIFT_DESCRIPTIONS[0], true],
        [SHIFT_DESCRIPTIONS[1], true],
        [SHIFT_DESCRIPTIONS[2], true],
    ]),
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GLOBAL_SHIFT_FILTER:
            return {
                ...state,
                selectedShifts: action.selectedShifts,
            };
        default:
            return state;
    }
}
