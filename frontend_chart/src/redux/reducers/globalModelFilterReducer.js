import {MODEL_NAMES} from "../../constants/constants";
import {GLOBAL_MODEL_FILTER} from "../actions/globalModelFilterActions";

const initialState = {
    selectedModel: MODEL_NAMES.entries().next().value,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GLOBAL_MODEL_FILTER:
            return {
                ...state,
                selectedModel: action.selectedModel,
            };
        default:
            return state;
    }
}
