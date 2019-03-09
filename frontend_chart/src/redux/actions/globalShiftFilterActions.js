export const GLOBAL_SHIFT_FILTER = 'GLOBAL_SHIFT_FILTER';

export function changeGlobalShiftFilter(shiftNumber) {
    return {
        type: GLOBAL_SHIFT_FILTER,
        shiftNumber: shiftNumber,
    };
}
