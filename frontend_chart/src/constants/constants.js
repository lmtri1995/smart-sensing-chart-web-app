// Factory Shift time rule: 3 shifts per day
// Shift 1 => Starts at 6:00:00 AM today
// Shift 3 => Ends at 5:59:59 AM tomorrow
export const START_WORK_DAY_TIME = {hours: 6, minutes: 0, seconds: 0};
export const END_WORK_DAY_TIME = {hours: 5, minutes: 59, seconds: 59};
