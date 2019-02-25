import React, {Component} from 'react';
import DayCell from "./DayCell";
import moment from "moment";
import PropTypes from "prop-types";

export default class DateRangePicker extends Component {
    static propTypes = {
        changeGlobalDateFilter: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            startDate: props.startDate || new Date(),
            endDate: props.endDate || new Date(),
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
                                <DayCell disabled={value >= 10}
                                         numWeeks={numWeeks}
                                         date={new Date(moment().subtract(value, "days").toISOString())}
                                         onRangeChange={this.handleRangeChange.bind(this)}
                                         startDate={this.state.startDate}
                                         endDate={this.state.endDate}
                                         numClicks={this.state.numClicks}/>
                            )
                    }

                    {/*Today*/}
                    <DayCell disabled={false}
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
                                <DayCell disabled={true}
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
