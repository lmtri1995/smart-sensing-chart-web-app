export const CHANGE_ADMIN_TAB = 'CHANGE_ADMIN_TAB';

export function changeAdminTab(currentTab) {
    return {
        type: CHANGE_ADMIN_TAB,
        currentTab: currentTab,
    };
}
