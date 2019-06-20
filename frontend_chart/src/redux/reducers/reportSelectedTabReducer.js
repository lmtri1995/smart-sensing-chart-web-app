import {REPORT_SELECTED_TAB} from "../actions/reportSelectedTabActions";
import {REPORT_TABS} from "../../constants/constants";

const initialState = {
    selectedTab: REPORT_TABS[0],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case REPORT_SELECTED_TAB:
            return {
                ...state,
                selectedTab: action.selectedTab,
            };
        default:
            return state;
    }
}
