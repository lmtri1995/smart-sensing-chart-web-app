import { FETCHING_CHART_DATA, FETCHING_CHART_DATA_SUCCESS, FETCHING_CHART_DATA_FAILURE } from '../constants/constants'
const initialState = {
  data: [
    {i: "0", x: 0, y: 0, w: 3, h: 10,type:"Doughnut"},
    {i: "1", x: 0, y: 1, w: 3, h: 10,type:"Line"},
    {i: "2", x: 0, y: 2, w: 3, h: 10,type:"Bar"}
  ] ,
  dataFetched: false,
  isFetching: false,
  error: false
}

export default function gridLayout (state = initialState, action) {
    console.log(action.type)
  switch (action.type) {
    case FETCHING_CHART_DATA:
      return {
        ...state,
        data: state.data,
        isFetching: true
      }
    case FETCHING_CHART_DATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.data
      }
    case FETCHING_CHART_DATA_FAILURE:
    console.log('da co du lieu')
      return {
        ...state,
        data:[...state.data,action.data],
        isFetching: false,
        error: true
      }
    default:
      return state
  }
}