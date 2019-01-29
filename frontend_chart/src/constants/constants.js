import {LOGIN_URL, NUMBER_OF_STATION, SERVER_URL} from "./config";

export const FETCHING_DATA = 'FETCHING_DATA';
export const FETCHING_DATA_SUCCESS = 'FETCHING_DATA_SUCCESS';
export const FETCHING_DATA_FAILURE = 'FETCHING_DATA_FAILURE';

export const IP_TEMP_TREND_ARRAY = 'IP_TEMP_TREND_ARRAY';
export const IP_TEMP_STOCK_CAPACITY = 25000; //Maximum rows can be saved in the local storage
export const IP_TEMP_ITEM_TO_GET    = 1000; //Number of items that will be gotten to show on grid
export const IP_TEMP_TIME_SPACE_GET_FROM_STOCK    = 3000; //Time space to get an amount of data from
// stock to
// show on grid, 1000 is equivalent to 1s
export const IP_TEMP_TIME_SPACE_PUSH_TO_STOCK   = 4000;

export const LOCAL_IP_TEMP_TREND = {
    IP_TEMP_TREND_ARRAY,
    IP_TEMP_STOCK_CAPACITY,
    IP_TEMP_ITEM_TO_GET,
    IP_TEMP_TIME_SPACE_GET_FROM_STOCK,
    IP_TEMP_TIME_SPACE_PUSH_TO_STOCK,
}

