import {combineReducers, createStore} from 'redux';
import {reducer as reduxFormReducer} from 'redux-form';
import {globalDateFilterReducer, sidebarReducer, themeReducer} from '../../redux/reducers/index';

const reducer = combineReducers({
    form: reduxFormReducer, // mounted under "form",
    theme: themeReducer,
    sidebar: sidebarReducer,
    globalDateFilter: globalDateFilterReducer,
});

const store = createStore(reducer);

export default store;
