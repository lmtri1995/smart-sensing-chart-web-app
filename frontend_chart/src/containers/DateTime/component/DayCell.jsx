import React, {PureComponent} from "react";
import moment from "moment";
import classNames from 'classnames';

export default class DayCell extends PureComponent {
    render() {
        let {date} = this.props;

        const dayCellClassNames = classNames(
            'date-range-picker__day-cell',  // This only draws top & left border
            {
                // If current date is in the latest week (last line in calendar: Monday -> Sunday)
                // -> Draw bottom border
                'date-range-picker__cell-bottom-border': moment(date.toISOString()).startOf("day")
                    .isSameOrAfter(moment().isoWeekday(1).startOf("day")),

                // If current date is Sunday
                // -> Draw right border
                'date-range-picker__cell-right-border': moment(date.toISOString())
                    .isSame(moment(date.toISOString()).isoWeekday(7)),
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
