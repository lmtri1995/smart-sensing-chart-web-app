import React, {Component} from 'react';
import DayCell from "./DayCell";
import moment from "moment";
import PropTypes from "prop-types";
import {END_WORK_DAY_TIME, START_WORK_DAY_TIME} from "../../../constants/constants";

export default class DateRangePicker extends Component {
    static propTypes = {
        changeGlobalDateFilter: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        let startDate = new Date(
            moment(props.startDate.toISOString())
                .startOf("day")
                .add(START_WORK_DAY_TIME)
                .toISOString()
        );
        let endDate = new Date(
            moment(props.endDate.toISOString())
                .subtract(1, "days")
                .toISOString()
        );

        this.state = {
            startDate: startDate || new Date(),
            endDate: endDate || new Date(),
            numClicks: 0,
        }
    }

    handleRangeChange(selectedDate) {
        let selectedMoment = moment(selectedDate.toISOString() || (new Date()).toISOString());
        let startMoment = moment(this.state.startDate.toISOString());

        let startDate, endDate;
        switch (this.state.numClicks) {
            case 0:
                startDate = selectedDate || new Date();
                endDate = selectedDate || new Date();
                this.setState({
                    ...this.state,
                    startDate: startDate,
                    endDate: endDate,
                    numClicks: ++this.state.numClicks,
                });
                break;
            case 1:
                startDate = selectedMoment.isSameOrAfter(startMoment) ? this.state.startDate : selectedDate;
                endDate = selectedMoment.isSameOrAfter(startMoment) ? selectedDate : this.state.startDate;
                this.setState({
                    ...this.state,
                    startDate: startDate,
                    endDate: endDate,
                    numClicks: ++this.state.numClicks,
                });
                break;
            case 2:
                startDate = selectedDate || new Date();
                endDate = selectedDate || new Date();
                this.setState({
                    ...this.state,
                    startDate: startDate,
                    endDate: endDate,
                    numClicks: 1,
                });
                break;
        }

        // Change Start & End Date before dispatch to Redux Store as per the rule of a shift time of the factory
        // 1 work day: starts at 6:00:00 AM => ends at 5:59:59 AM of the following day
        // Start Date always is 6:00:00 AM of User Selected Date.
        startDate = new Date(
            moment(startDate.toISOString())
                .startOf("day")
                .add(START_WORK_DAY_TIME)
                .toISOString()
        );
        // End Date always is 5:59:59 AM of the Following Day of User Selected Date.
        endDate = new Date(
            moment(endDate.toISOString())
                .startOf("day")
                .add({days: 1, ...END_WORK_DAY_TIME})
                .toISOString()
        );
        this.props.changeGlobalDateFilter(startDate, endDate);
    }

    render() {
        let {numWeeks} = this.props;

        // Using moment() for date operation on 1 line
        // But propagate Javascript Date to children (DayCell)
        // -> Wrap moment() inside Javascript Date
        return (
            <div>
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
                                <DayCell key={value}
                                         disabled={
                                             moment().isBefore(moment().startOf("day").add(START_WORK_DAY_TIME))
                                                 ? value > 10
                                                 : value >= 10
                                         }
                                         numWeeks={numWeeks}
                                         date={new Date(moment().subtract(value, "days").toISOString())}
                                         onRangeChange={this.handleRangeChange.bind(this)}
                                         startDate={this.state.startDate}
                                         endDate={this.state.endDate}
                                         numClicks={this.state.numClicks}/>
                            )
                    }

                    {/*Today*/}
                    {/*If current time is before 6:00:00 AM => disabled*/}
                    {/*Else, current time is same or after 6:00:00 AM => enabled*/}
                    <DayCell disabled={moment().isBefore(moment().startOf("day").add(START_WORK_DAY_TIME))}
                             numWeeks={numWeeks}
                             date={new Date()}
                             onRangeChange={this.handleRangeChange.bind(this)}
                             startDate={this.state.startDate}
                             endDate={this.state.endDate}
                             numClicks={this.state.numClicks}/>

                    {/*Remaining Next Days until Sunday*/}
                    {
                        [...Array(7 - moment().isoWeekday()).keys()]
                            .map(value => value + 1)
                            .map(value =>
                                <DayCell key={value}
                                         disabled={true}
                                         numWeeks={numWeeks}
                                         date={new Date(moment().add(value, "days").toISOString())}
                                         onRangeChange={this.handleRangeChange.bind(this)}
                                         startDate={this.state.startDate}
                                         endDate={this.state.endDate}
                                         numClicks={this.state.numClicks}/>
                            )
                    }
                </div>
                <div className="container date-range-picker-config">
                    <div className="row">
                        <div className="col">
                            <p>Time range selected</p>
                            <p>06:00:00--07:00:00</p>
                            <h4><span>2019/02/19</span>--<span>2019/02/20</span></h4>
                            <div className="float-right">
                                <button type="button" className="btn btn-secondary">Cancel</button>
                                <button type="button" className="btn btn-primary">Set</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
