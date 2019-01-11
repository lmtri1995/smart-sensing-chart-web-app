import React, { Component } from 'react'
import LineChart from "../../../../Charts/ChartJS/components/RandomeAnimatedLinesLong";

export default class TemperatureTrendItem extends Component {
    render(){
        return (
            <div className="col">
                <h4>USL/ Value/ LSL</h4>
                <LineChart/>
            </div>
        );
    }
}
