import {GLOBAL_DATE_FILTER, RESET_GLOBAL_DATE_FILTER} from '../actions/globalDateFilterActions';
import {END_WORK_DAY_TIME, START_WORK_DAY_TIME} from "../../constants/constants";
import moment from 'moment';

const initialState = {
    startDate: new Date(
        moment().isBefore(moment().startOf("day").add(START_WORK_DAY_TIME))
            ? moment()
                .subtract(3, "days")
                .startOf("day")
                .add(START_WORK_DAY_TIME)
                .toISOString()
            : moment()
                .subtract(2, "days")
                .startOf("day")
                .add(START_WORK_DAY_TIME)
                .toISOString()
    ),

    endDate: new Date(
        moment().isBefore(moment().startOf("day").add(START_WORK_DAY_TIME))
            ? moment()
                .startOf("day")
                .add(END_WORK_DAY_TIME)
                .toISOString()
            : moment()
                .startOf("day")
                .add({days: 1, ...END_WORK_DAY_TIME})
                .toISOString()
    ),
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GLOBAL_DATE_FILTER:
            return {
                ...state,
                startDate: action.startDate,
                endDate: action.endDate,
            };
        case RESET_GLOBAL_DATE_FILTER:
            return {
                ...state,
                startDate: action.startDate,
                endDate: action.endDate,
            };
        default:
            return state;
    }
}
