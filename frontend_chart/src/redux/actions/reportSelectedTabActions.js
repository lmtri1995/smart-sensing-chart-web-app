export const REPORT_SELECTED_TAB = 'REPORT_SELECTED_TAB';

export function changeReportSelectedTab(selectedTab) {
    return {
        type: REPORT_SELECTED_TAB,
        selectedTab: selectedTab,
    };
}
