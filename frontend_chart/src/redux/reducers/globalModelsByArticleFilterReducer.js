import {MODELS_BY_ARTICLE} from "../../constants/constants";
import {GLOBAL_MODELS_BY_ARTICLE_FILTER} from "../actions/globalModelsByArticleFilterActions";

const initialState = {
    selectedModelsByArticle: MODELS_BY_ARTICLE.entries().next().value,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GLOBAL_MODELS_BY_ARTICLE_FILTER:
            return {
                ...state,
                selectedModelsByArticle: action.selectedModelsByArticle,
            };
        default:
            return state;
    }
}
