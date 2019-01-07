import React, {PureComponent} from "react";

export default class DayCell extends PureComponent {
    render() {
        let {date} = this.props;

        return date.getDate() === (new Date()).getDate() ? (
            <div className="date-range-picker__day-cell">
                {('0' + date.getDate()).slice(-2)} {/*Add leading 0 to Single Number Day 1->9*/}
            </div>
        ) : (
            <div className="date-range-picker__day-cell">
                {('0' + date.getDate()).slice(-2)}
            </div>
        );
    }
}
