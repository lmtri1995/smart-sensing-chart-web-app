import React, {PureComponent} from "react";
import moment from "moment";
import classNames from 'classnames';
import PropTypes from "prop-types";

export default class DayCell extends PureComponent {
    static propTypes = {
        onRangeChange: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.toggleClick = this.toggleClick.bind(this);
    }

    toggleClick() {
        this.props.onRangeChange(this.props.date);
    }

    render() {
        let {
            disabled, numWeeks, date,
            startDate, endDate
        } = this.props;

        // (7 * numWeeks) - (7 - moment().isoWeekday()) - 1
        // For explanation,
        // -> See: src/containers/DateTime/component/CustomDateRangePicker.jsx
        const dayCellClassNames = classNames(
            // This only draws top & left border
            disabled ? 'date-range-picker__day-cell' : 'date-range-picker__day-cell-hover',
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
            },
            // Day Cell Disabling
            {
                'date-range-picker__day-cell-disabled': disabled,
            },
            // Selected Range
            {
                'date-range-picker__day-cell-selected': moment(date.toISOString()).startOf("day")
                        .isSame(moment(startDate.toISOString()).startOf("day"))
                    || moment(date.toISOString()).startOf("day")
                        .isSame(moment(endDate.toISOString()).startOf("day")),

                'date-range-picker__day-cell-in-between-selected-range': (moment(date.toISOString()).startOf("day")
                        .isAfter(moment(startDate.toISOString()).endOf("day"))
                    && moment(date.toISOString()).endOf("day")
                        .isBefore(moment(endDate.toISOString()).startOf("day"))),
            },
        );

        return disabled ? (
            <div className={dayCellClassNames}>
                {('0' + date.getDate()).slice(-2)} {/*Add leading 0 to Single Number Day 1->9*/}
            </div>
        ) : (
            <div className={dayCellClassNames} onClick={this.toggleClick}>
                {('0' + date.getDate()).slice(-2)}
            </div>
        );
    }
}
