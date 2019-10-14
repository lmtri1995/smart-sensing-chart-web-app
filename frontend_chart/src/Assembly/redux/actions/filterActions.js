export const CHANGE_FILTER_DATE    = 'CHANGE_FILTER_DATE';
export const CHANGE_FILTER_LINE    = 'CHANGE_FILTER_LINE';
export const CHANGE_FILTER_MODEL   = 'CHANGE_FILTER_MODEL';
export const CHANGE_FILTER_ARTICLE = 'CHANGE_FILTER_ARTICLE';

export function changeFilterDate(filterDate) {
	return {
		type      : CHANGE_FILTER_DATE,
		filterDate: filterDate
	};
}

export function changeFilterLine(filterLine) {
	return {
		type      : CHANGE_FILTER_LINE,
		filterLine: filterLine
	};
}

export function changeFilterModel(filterModel) {
	return {
		type       : CHANGE_FILTER_MODEL,
		filterModel: filterModel
	};
}

export function changeFilterArticle(filterArticle) {
	return {
		type         : CHANGE_FILTER_ARTICLE,
		filterArticle: filterArticle
	};
}
