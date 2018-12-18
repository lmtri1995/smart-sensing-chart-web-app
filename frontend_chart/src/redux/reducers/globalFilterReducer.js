import {GLOBAL_FILTER} from '../actions/globalFilterActions';
import moment from 'moment';

const initialState = {
    startDate: moment().subtract(12, "hours"),
    endDate: moment()
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
