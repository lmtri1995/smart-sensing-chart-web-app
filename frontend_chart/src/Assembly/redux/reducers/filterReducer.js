import {
	CHANGE_FILTER_ARTICLE,
	CHANGE_FILTER_DATE,
	CHANGE_FILTER_LINE,
	CHANGE_FILTER_MODEL
} from '../actions/filterActions';

const initialState = {
	filterDate   : new Date(),
	filterModel  : '',
	filterLine   : '',
	filterArticle: '',
};

export default function (state = initialState, action) {
	switch (action.type) {
		case CHANGE_FILTER_DATE:
			return {...state, filterDate: action.filterDate};
		case CHANGE_FILTER_MODEL:
			return {...state, filterModel: action.filterModel};
		case CHANGE_FILTER_LINE:
			return {...state, filterLine: action.filterLine};
		case CHANGE_FILTER_ARTICLE:
			return {...state, filterArticle: action.filterArticle};
		default:
			return state;
	}
}
