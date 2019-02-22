import axios from "axios";
import {SERVER_URL} from "../constants/config";

export default function callAPI(endpoint, method = 'GET', param) {
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };
    return axios({
        headers: headers,
        method: method,
        url: `${SERVER_URL}/${endpoint}`,
        data: param

    })
        .catch(err => {
            console.log(err)
        });
}
