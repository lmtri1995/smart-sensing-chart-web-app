import React, {PureComponent} from "react";
import moment from "moment";
import classNames from 'classnames';

export default class DayCell extends PureComponent {
    render() {
        let {numWeeks, date} = this.props;

        // (7 * numWeeks) - (7 - moment().isoWeekday()) - 1
        // For explanation,
        // -> See: src/containers/DateTime/component/CustomDateRangePicker.jsx
        const dayCellClassNames = classNames(
            'date-range-picker__day-cell',  // This only draws top & left border
            // Draw Day Cell borders
            {
                // If current date is in the latest week (last line in calendar: Monday -> Sunday)
                // -> Draw bottom border
                'date-range-picker__cell-bottom-border': moment(date.toISOString()).startOf("day")
                    .isSameOrAfter(moment().isoWeekday(1).startOf("day")),

                // If current date is Sunday
                // -> Draw right border
                'date-range-picker__cell-right-border': moment(date.toISOString())
                    .isSame(moment(date.toISOString()).isoWeekday(7)),
            },
            // Make Calendar corners rounded
            {
                // If current date is First Monday in calendar (Top Left Cell)
                // -> Rounded Top Left corner
                'date-range-picker__top-left-cell': moment(date.toISOString()).startOf("day")
                    .isSame(moment().subtract(
                        (7 * numWeeks) - (7 - moment().isoWeekday()) - 1,
                        "days"
                    ).startOf("day")),

                // If current date is First Sunday in calendar (Top Right Cell)
                // -> Rounded Top Right corner
                'date-range-picker__top-right-cell': moment(date.toISOString()).startOf("day")
                    .isSame(moment().subtract(
                        (7 * numWeeks) - (7 - moment().isoWeekday()) - 1,
                        "days"
                    ).isoWeekday(7).startOf("day")),

                // If current date is Last Monday in calendar (Bottom Left Cell)
                // -> Rounded Bottom Left corner
                'date-range-picker__bottom-left-cell': moment(date.toISOString()).startOf("day")
                    .isSame(moment().isoWeekday(1).startOf("day")),

                // If current date is Last Sunday in calendar (Bottom Right Cell)
                // -> Rounded Bottom Right corner
                'date-range-picker__bottom-right-cell': moment(date.toISOString()).startOf("day")
                    .isSame(moment().isoWeekday(7).startOf("day")),
            }
        );

        return date.getDate() === (new Date()).getDate() ? (
            <div className={dayCellClassNames}>
                {('0' + date.getDate()).slice(-2)} {/*Add leading 0 to Single Number Day 1->9*/}
            </div>
        ) : (
            <div className={dayCellClassNames}>
                {('0' + date.getDate()).slice(-2)}
            </div>
        );
    }
}
