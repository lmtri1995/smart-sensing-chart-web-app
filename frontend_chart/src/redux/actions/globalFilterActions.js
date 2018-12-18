export const GLOBAL_FILTER = 'GLOBAL_FILTER';

export function changeGlobalFilter(startDate, endDate) {
    return {
        type: GLOBAL_FILTER,
        startDate: startDate,
        endDate: endDate,
    };
}
