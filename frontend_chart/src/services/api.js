import axios from "axios";
import * as Config from "../constants/APIconfig";
export default function callAPI(endpoint,meThod = 'GET',body,headers = null){
    return axios({
        headers: headers,
        method:meThod,
        url:`${Config.API_URL}/${endpoint}`,
        data:body

    })
    .catch(err => {
        console.log(err)
    });
}