export const REPORT_DATE_FILTER = 'REPORT_DATE_FILTER';
export const ANALYSIS_DATE_FILTER = 'ANALYSIS_DATE_FILTER';

export function changeReportDateFilter(startDate, endDate) {
    return {
        type: REPORT_DATE_FILTER,
        startDate: startDate,
        endDate: endDate,
    };
}

export function changeAnalysisDateFilter(startDate, endDate) {
    return {
        type: ANALYSIS_DATE_FILTER,
        startDate: startDate,
        endDate: endDate,
    };
}
