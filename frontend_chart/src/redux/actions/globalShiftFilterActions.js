export const GLOBAL_SHIFT_FILTER = 'GLOBAL_SHIFT_FILTER';

export function changeGlobalShiftFilter(selectedShifts) {
    return {
        type: GLOBAL_SHIFT_FILTER,
        selectedShifts: selectedShifts,
    };
}
