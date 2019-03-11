import {MODEL_NAMES} from "../../constants/constants";
import {GLOBAL_MODEL_FILTER} from "../actions/globalModelFilterActions";

const initialState = {
    selectedModels: MODEL_NAMES,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GLOBAL_MODEL_FILTER:
            return {
                ...state,
                selectedModels: action.selectedModels,
            };
        default:
            return state;
    }
}
