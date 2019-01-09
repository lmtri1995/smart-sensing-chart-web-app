import axios from "axios";
import {LOGIN_URL} from "../constants/config";
export default function callAPI(endpoint,meThod = 'GET',body,headers = null){
    return axios({
        headers: headers,
        method:meThod,
        url:`${LOGIN_URL}/${endpoint}`,
        data:body

    })
    .catch(err => {
        console.log(err)
    });
}
