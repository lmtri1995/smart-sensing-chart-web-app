import {
    FETCHING_DATA,
    FETCHING_DATA_FAILURE,
    FETCHING_DATA_SUCCESS
} from '../../constants/constants';
import API from '../../services/api';
import Singleton from "../../services/Socket";

export function getData() {
    return {
        type: FETCHING_DATA
    }
}

export function getDataSuccess(data) {
    return {
        type: FETCHING_DATA_SUCCESS,
        data,
    }
}

export function getDataFailure() {
    return {
        type: FETCHING_DATA_FAILURE
    }
}

export function fetchData(user, responseData) {
    return (dispatch) => {
        dispatch(getData())
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        API('api/author/login', 'POST', user, headers)
            .then((data) => {
                var value = data.data
                responseData(value)
                if (value.success === true) {
                    localStorage.setItem('logindata', JSON.stringify(value));
                    var instance1 = Singleton.getInstance(value.token);
                }

                dispatch(getDataSuccess(data.data))
            })
            .catch((err) => console.log('err:', err))
    }
}
