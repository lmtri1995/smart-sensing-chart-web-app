import React, {Component} from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {DateRange} from 'react-date-range';

export default class DateRangePicker extends Component {
    constructor(props, context) {
        super(props, context);

        console.log("startDate", props.startDate);
        console.log("endDate", props.endDate);
        this.state = {
            selection: {
                startDate: props.startDate || new Date(),
                endDate: props.endDate || null,
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

        // Date Range Component's onChange callback returns Javascript 'Date' type.
        // Redux Store also stores 'Date' type.
        // => No need conversion between 'Date' type and 'moment' type before dispatching to
        // Redux Store.
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
