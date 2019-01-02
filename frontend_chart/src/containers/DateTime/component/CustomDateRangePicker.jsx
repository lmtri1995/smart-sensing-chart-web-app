import React, {Component} from 'react';
import DayCell from "./DayCell";
import moment from "moment";

export default class CustomDateRangePicker extends Component {
    render() {
        let {numWeeks} = this.props;

        // Using moment() for date operation on 1 line
        // But propagate Javascript Date to children (DayCell)
        // -> Wrap moment() inside Javascript Date
        return (
            <div className="date-range-picker__container">
                <div className="date-range-picker__weekday-cell">Mon</div>
                <div className="date-range-picker__weekday-cell">Tue</div>
                <div className="date-range-picker__weekday-cell">Wed</div>
                <div className="date-range-picker__weekday-cell">Thu</div>
                <div className="date-range-picker__weekday-cell">Fri</div>
                <div className="date-range-picker__weekday-cell">Sat</div>
                <div className="date-range-picker__weekday-cell">Sun</div>

                {/*Always show 3 weeks in calendar => 7 days * numWeeks = 21 days*/}
                {/*isoWeekday: 1: Monday -> 7: Sunday*/}
                {/*21 - (7 - currentISOWeekday) - 1: loop from last 2 Mondays until Yesterday*/}
                {
                    [...Array((7 * numWeeks) - (7 - moment().isoWeekday()) - 1).keys()].reverse()
                        .map(value => value + 1) // Make 0...10 index keys become 1...11 index keys.
                        .map(value =>
                            <DayCell numWeeks={numWeeks}
                                     date={new Date(moment().subtract(value, "days").toISOString())}/>
                        )
                }

                {/*Today*/}
                <DayCell numWeeks={numWeeks} date={new Date()}/>

                {/*Remaining Next Days until Sunday*/}
                {
                    [...Array(7 - moment().isoWeekday()).keys()]
                        .map(value => value + 1)
                        .map(value =>
                            <DayCell numWeeks={numWeeks}
                                     date={new Date(moment().add(value, "days").toISOString())}/>
                        )
                }
            </div>
        );
    }
}
