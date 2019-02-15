export const ANALYSIS_DATE_FILTER = 'ANALYSIS_DATE_FILTER';

export function changeAnalysisDateFilter(startDate, endDate) {
    return {
        type: ANALYSIS_DATE_FILTER,
        startDate: startDate,
        endDate: endDate,
    };
}
