import React, {Component} from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {DateRange} from 'react-date-range';
import moment from 'moment';

export default class DateRangePicker extends Component {
    constructor(props, context) {
        super(props, context);

        console.log("startDate", props.startDate);
        console.log("endDate", props.endDate);
        this.state = {
            selection: {
                startDate: new Date(props.startDate.toISOString()) || new Date(),
                endDate: new Date(props.endDate.toISOString()) || null,
                key: 'selection',
            },
        };
        console.log("state", this.state);
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

        // Convert Javascript 'Date' type to 'moment' type before dispatching to redux store
        // via this.props.changeGlobalFilter() function
        //
        // Redux Store only stores and works with 'moment' type
        dateRanges = {
            ...dateRanges.selection,
            startDate: moment(dateRanges.selection.startDate.toISOString()),
            endDate: moment(dateRanges.selection.endDate.toISOString()),
        };

        this.props.changeGlobalFilter(dateRanges.startDate, dateRanges.endDate);
    }

    render() {
        return (
            <DateRange
                onChange={this.handleRangeChange.bind(this)}
                moveRangeOnFirstSelection={false}
                ranges={[this.state.selection]}
                className={'PreviewArea'}
                maxDate={new Date()}
                showDateDisplay={true}
            />
        );
    }
}
