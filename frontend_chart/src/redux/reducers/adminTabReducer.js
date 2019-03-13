import {ADMIN_TAB_INDEX} from "../../constants/constants";
import {CHANGE_ADMIN_TAB} from "../actions/adminTabActions";

const initialState = {
    currentTab: ADMIN_TAB_INDEX[0],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case CHANGE_ADMIN_TAB:
            return {
                ...state,
                currentTab: action.currentTab,
            };
        default:
            return state;
    }
}
