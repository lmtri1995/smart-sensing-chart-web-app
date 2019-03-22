export const GLOBAL_MODELS_BY_ARTICLE_FILTER = 'GLOBAL_MODEL_FILTER';

export function changeGlobalModelsByArticleFilter(selectedModelsByArticle) {
    return {
        type: GLOBAL_MODELS_BY_ARTICLE_FILTER,
        selectedModelsByArticle: selectedModelsByArticle,
    };
}
