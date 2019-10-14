import axios        from "axios";
import {SERVER_URL} from "../constants/urlConstants";

/*
    Used to connect and get data from API
        method: 'GET'/'POST'
        url: 'http://10.2.17.12:8888/api/asc/article'
        param = {
                "dropdownlist-name" : "line"
            }
*/
export default function callAxios(method, url, param){
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };
    return axios({
        headers: headers,
        method: method,
        url: SERVER_URL + url,
        data: param
    });
}


