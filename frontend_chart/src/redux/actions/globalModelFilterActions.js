export const GLOBAL_MODEL_FILTER = 'GLOBAL_MODEL_FILTER';

export function changeGlobalModelFilter(selectedModels) {
    return {
        type: GLOBAL_MODEL_FILTER,
        selectedModels: selectedModels,
    };
}
