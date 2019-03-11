import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {reducer as reduxFormReducer} from 'redux-form';
import {
    downloadDataStoreReducer,
    globalDateFilterReducer,
    globalModelFilterReducer,
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
    globalDateFilter: globalDateFilterReducer,
    login: LoginReducer,
    downloadDataStore: downloadDataStoreReducer,
    globalModelFilter: globalModelFilterReducer,
    globalShiftFilter: globalShiftFilterReducer,
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer,
    composeEnhancer(applyMiddleware(thunk)),
);

export default store;
