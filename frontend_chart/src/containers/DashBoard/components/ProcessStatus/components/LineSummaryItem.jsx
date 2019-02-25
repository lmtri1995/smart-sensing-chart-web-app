import React, {Component} from 'react'

export default class LineSummaryItem extends Component {
    render() {
        let {stationId, avgTemp, stddevTemp, avgPreparing, stddevPreparing, avgCuringTime, stddevCurringTime} = this.props;
        return (
            <tr>
                <th scope="row">Station {stationId}</th>
                <td>{avgTemp}</td>
                <td>{stddevTemp}</td>
                <td>{avgPreparing}</td>
                <td>{stddevPreparing}</td>
                <td>{avgCuringTime}</td>
                <td>{stddevCurringTime}</td>
            </tr>
        );
    }
}
