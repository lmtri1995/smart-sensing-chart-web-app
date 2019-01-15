import React, {Component} from 'react';
import LineSummaryItem from './components/LineSummaryItem';
import GeneralSummaryItem from './components/GeneralSummaryItem';

export default class ProcessStatus extends Component {
    render() {
        return (
            <table className="table table-bordered table-dark">
                <thead>
                <tr>
                    <th scope="col" rowSpan="2">Processing Status</th>
                    <th scope="col" colSpan="2">Temperature</th>
                    <th scope="col" colSpan="2">Preparing (s)</th>
                    <th scope="col" colSpan="2">Curing Time (s)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>0</th>
                    <th>AVG</th>
                    <th>STDEV</th>
                    <th>AVG</th>
                    <th>STDEV</th>
                    <th>AVG</th>
                    <th>STDEV</th>
                </tr>
                <LineSummaryItem/>
                <LineSummaryItem/>
                <LineSummaryItem/>
                <LineSummaryItem/>
                <LineSummaryItem/>
                <LineSummaryItem/>
                <LineSummaryItem/>
                <LineSummaryItem/>
                <tr>
                    <th scope="col" rowSpan="2">Processing Status</th>
                    <th scope="col" colSpan="2">Temperature</th>
                    <th scope="col" colSpan="2">Preparing (s)</th>
                    <th scope="col" colSpan="2">Curing Time (s)</th>
                </tr>
                <tr>
                    <th>AVG</th>
                    <th>STDEV</th>
                    <th>AVG</th>
                    <th>STDEV</th>
                    <th>AVG</th>
                    <th>STDEV</th>
                </tr>
                <GeneralSummaryItem/>
                <GeneralSummaryItem/>
                <GeneralSummaryItem/>
                <GeneralSummaryItem/>
                </tbody>
            </table>
        )
    }
}
