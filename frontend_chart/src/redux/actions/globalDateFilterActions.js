export const GLOBAL_DATE_FILTER = 'GLOBAL_DATE_FILTER';

export function changeGlobalDateFilter(startDate, endDate) {
    return {
        type: GLOBAL_DATE_FILTER,
        startDate: startDate,
        endDate: endDate,
    };
}
