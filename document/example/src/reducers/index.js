import { combineReducers } from 'redux'
import todos from './todos'
import appData from './dataReducer'
import update_chart from './updateRecuder'
import dataGrid from './GridLayoutReducer'
export default combineReducers({
  todos,
  appData,
  update_chart,
  dataGrid
})