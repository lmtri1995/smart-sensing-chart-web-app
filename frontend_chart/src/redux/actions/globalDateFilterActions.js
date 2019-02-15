import moment from "../reducers/globalDateFilterReducer";

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
            moment()
                .subtract(6, "days")
                .startOf("day")
                .add(6, "hours")
                .toISOString()
        ),

        endDate: new Date(
            moment()
                .startOf("day")
                .add({hours: 5, minutes: 59, seconds: 59})
                .toISOString()
        ),
    };
}
