import { FETCHING_DATA, FETCHING_DATA_SUCCESS, FETCHING_DATA_FAILURE } from '../../constants/constants'
import API from '../../services/api'
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

export function fetchData(user,responseData) { return (dispatch) => {
  dispatch(getData())
  let headers= {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  API('api/author/login','POST',user,headers)
    .then((data) => {
      var value  = data.data
      console.log(value)
      responseData(value)
      if(value.success === true)
        localStorage.setItem('logindata',JSON.stringify(value))
      dispatch(getDataSuccess(data.data))
    })
    .catch((err) => console.log('err:', err))
}}