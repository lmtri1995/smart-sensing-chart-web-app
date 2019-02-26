import React, {Component} from 'react'
import LineChart from "./TemperatureTrendLine";

export default class TemperatureTrendItem extends Component {
    render() {
        let {stationId} = this.props;
        return (
            <div className="col">
                <h4>STATION {stationId}: USL/ Value/ LSL</h4>
                <LineChart stationId={stationId}/>
            </div>
        );
    }
}
