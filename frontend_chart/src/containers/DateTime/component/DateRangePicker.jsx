import React, {Component} from 'react';
import moment from "moment";
import PropTypes from "prop-types";
import {END_WORK_DAY_TIME, START_WORK_DAY_TIME} from "../../../constants/constants";
import {DateRange} from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

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
            selection: {
                startDate: startDate || new Date(),
                endDate: endDate || new Date(),
                key: 'selection',
            },
            lastSelectedStartDate: startDate || new Date(),
            lastSelectedEndDate: endDate || new Date(),
        };
    }

    /*
     * dateRanges = {
     *      startDate: ...,
     *      endDate: ...,
     *      key: 'selection',
     * }
     */
    handleRangeChange(dateRanges) {
        this.setState({
            ...dateRanges,
        });
    }

    cancel = () => {
        this.setState({
            selection: {
                ...this.state.selection,
                startDate: this.state.lastSelectedStartDate,
                endDate: this.state.lastSelectedEndDate,
            },
        });
        this.props.toggleMenu();
    };

    setDate = () => {
        this.setState({
            lastSelectedStartDate: this.state.selection.startDate,
            lastSelectedEndDate: this.state.selection.endDate,
        });

        // Change Start & End Date before dispatch to Redux Store as per the rule of a shift time of the factory
        // 1 work day: starts at 6:00:00 AM => ends at 5:59:59 AM of the following day
        // Start Date always is 6:00:00 AM of User Selected Date.
        let startDate = new Date(
            moment(this.state.selection.startDate.toISOString())
                .startOf("day")
                .add(START_WORK_DAY_TIME)
                .toISOString()
        );
        // End Date always is 5:59:59 AM of the Following Day of User Selected Date.
        let endDate = new Date(
            moment(this.state.selection.endDate.toISOString())
                .startOf("day")
                .add({days: 1, ...END_WORK_DAY_TIME})
                .toISOString()
        );

        this.props.changeGlobalDateFilter(startDate, endDate);

        this.props.toggleMenu();
    };

    render() {
        return (
            <div>
                <DateRange
                    onChange={this.handleRangeChange.bind(this)}
                    showSelectionPreview={false}
                    moveRangeOnFirstSelection={false}
                    ranges={[this.state.selection]}
                    className={'PreviewArea'}
                    maxDate={new Date()}
                    showDateDisplay={true}
                />
                <div className="container date-range-picker-config">
                    <div className="col">
                        <div className="row">Time range selected</div>
                        <div className="row">06:00:00--05:59:59</div>
                        <div className="row">
                            <h4>
                                <span>{moment(this.state.selection.startDate.toISOString()).format('DD/MM/YYYY')}</span>
                                --
                                <span>{moment(this.state.selection.endDate.toISOString()).format('DD/MM/YYYY')}</span>
                            </h4>
                        </div>
                        <div className="row float-right">
                            <button type="button" className="btn btn-secondary" onClick={this.cancel}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={this.setDate}>Set</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
