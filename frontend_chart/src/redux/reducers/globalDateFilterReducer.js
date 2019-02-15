import {ANALYSIS_DATE_FILTER} from '../actions/globalDateFilterActions';
import moment from 'moment';

const initialState = {
    startDateAnalysis: new Date(
        moment()
            .subtract(6, "days")
            .startOf("day")
            .add(6, "hours")
            .toISOString()
    ),

    endDateAnalysis: new Date(
        moment()
            .startOf("day")
            .add({hours: 5, minutes: 59, seconds: 59})
            .toISOString()
    ),
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ANALYSIS_DATE_FILTER:
            return {
                ...state,
                startDateAnalysis: action.startDate,
                endDateAnalysis: action.endDate,
            };
        default:
            return state;
    }
}
