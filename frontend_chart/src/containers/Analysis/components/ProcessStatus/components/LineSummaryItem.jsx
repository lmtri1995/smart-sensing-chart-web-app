import React, {Component} from 'react'

export default class LineSummaryItem extends Component {
    render() {
        let {stationId, avgTemp, stddevTemp, avgPreparing, stddevPreparing, avgCuringTime, stddevCurringTime} = this.props;
        return (
            <tr>
                <th scope="row">Station {stationId}</th>
                <td className="cellText">{avgTemp}</td>
                <td className="cellText">{stddevTemp}</td>
                <td className="cellText">{avgPreparing}</td>
                <td className="cellText">{stddevPreparing}</td>
                <td className="cellText">{avgCuringTime}</td>
                <td className="cellText">{stddevCurringTime}</td>
            </tr>
        );
    }
}
