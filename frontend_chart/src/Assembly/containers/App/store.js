import {combineReducers, createStore} from 'redux';
import {reducer as reduxFormReducer}  from 'redux-form';
import {
	customizerReducer,
	excelDataReducer,
	filterReducer,
	sidebarReducer,
	themeReducer
}                                     from '../../redux/reducers/index';

const reducer = combineReducers({
	form      : reduxFormReducer, // mounted under "form",
	theme     : themeReducer,
	sidebar   : sidebarReducer,
	customizer: customizerReducer,
	filter    : filterReducer,
	excelData : excelDataReducer,
});

const store = createStore(reducer);

export default store;
