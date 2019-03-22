import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {reducer as reduxFormReducer} from 'redux-form';
import {
    adminTabReducer,
    downloadDataStoreReducer,
    globalDateFilterReducer,
    globalArticleFilterReducer,
    globalModelFilterReducer,
    globalModelsByArticleFilterReducer,
    globalShiftFilterReducer,
    LoginReducer,
    sidebarReducer,
    themeReducer,
} from '../../redux/reducers/index';
import thunk from "redux-thunk";

const reducer = combineReducers({
    form: reduxFormReducer, // mounted under "form",
    theme: themeReducer,
    sidebar: sidebarReducer,
    login: LoginReducer,
    adminTab: adminTabReducer,
    globalDateFilter: globalDateFilterReducer,
    downloadDataStore: downloadDataStoreReducer,
    globalArticleFilter: globalArticleFilterReducer,
    globalModelFilter: globalModelFilterReducer,
    globalShiftFilter: globalShiftFilterReducer,
    globalModelsByArticleFilterReducer: globalModelsByArticleFilterReducer,
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer,
    composeEnhancer(applyMiddleware(thunk)),
);

export default store;
