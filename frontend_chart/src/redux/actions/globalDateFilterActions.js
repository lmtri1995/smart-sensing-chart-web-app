import moment from "../reducers/globalDateFilterReducer";
import {END_WORK_DAY_TIME, START_WORK_DAY_TIME} from "../../constants/constants";

export const GLOBAL_DATE_FILTER = 'GLOBAL_DATE_FILTER';
export const RESET_GLOBAL_DATE_FILTER = 'RESET_GLOBAL_DATE_FILTER';

export function changeGlobalDateFilter(startDate, endDate) {
    return {
        type: GLOBAL_DATE_FILTER,
        startDate: startDate,
        endDate: endDate,
    };
}

export function resetGlobalDateFilter() {
    return {
        type: RESET_GLOBAL_DATE_FILTER,
        startDate: new Date(
            moment().isBefore(moment().startOf("day").add(START_WORK_DAY_TIME))
                ? moment()
                    .subtract(7, "days")
                    .startOf("day")
                    .add(START_WORK_DAY_TIME)
                    .toISOString()
                : moment()
                    .subtract(6, "days")
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
}
