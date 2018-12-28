import {GLOBAL_FILTER} from '../actions/globalFilterActions';
import moment from 'moment';

const initialState = {
    startDate: new Date(
        moment()
            .subtract(6, "days")
            .startOf("day")
            .add(6, "hours")
            .toISOString()
    ),

    endDate: new Date(
        moment()
            .startOf("day")
            .add({hours: 5, minutes: 59, seconds: 59})
            .toISOString()
    )
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GLOBAL_FILTER:
            return {
                ...state,
                startDate: action.startDate,
                endDate: action.endDate,
            };
        default:
            return state;
    }
}
