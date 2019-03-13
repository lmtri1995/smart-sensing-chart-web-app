export const GLOBAL_SHIFT_FILTER = 'GLOBAL_SHIFT_FILTER';

export function changeGlobalShiftFilter(selectedShift) {
    return {
        type: GLOBAL_SHIFT_FILTER,
        selectedShift: selectedShift,
    };
}
