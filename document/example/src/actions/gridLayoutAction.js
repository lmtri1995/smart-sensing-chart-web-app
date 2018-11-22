import { FETCHING_CHART_DATA, FETCHING_CHART_DATA_SUCCESS, FETCHING_CHART_DATA_FAILURE } from '../constants/constants'
import {gridLayout}from '../api'
export function getData_chart() {
  return {
    type: FETCHING_CHART_DATA
  }
}

export function getDataSuccess_chart(data) {
  return {
    type: FETCHING_CHART_DATA_SUCCESS,
    data,
  }
}

export function getDataFailure_chart(data) {
  return {
    type: FETCHING_CHART_DATA_FAILURE,
    data
  }
}

export function saveGridLayoutToStore() { return (dispatch) => {
  dispatch(getData_chart())
  gridLayout()
    .then((data) => {
      dispatch(getDataSuccess_chart(data))
    })
    .catch((err) => console.log('err:', err))
}}
