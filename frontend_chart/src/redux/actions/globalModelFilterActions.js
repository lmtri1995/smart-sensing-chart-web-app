export const GLOBAL_MODEL_FILTER = 'GLOBAL_MODEL_FILTER';

export function changeGlobalModelFilter(selectedModel) {
    return {
        type: GLOBAL_MODEL_FILTER,
        selectedModel: selectedModel,
    };
}
