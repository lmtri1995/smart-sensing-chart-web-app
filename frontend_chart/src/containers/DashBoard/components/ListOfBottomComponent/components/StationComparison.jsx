import React, { Component } from 'react'
import RandomAnimatedBarsLong from "../../../../Charts/ChartJS/components/RandomAnimatedBarsLong";
export class StationComparison extends Component {
  render() {
    return (
        <div className="oee-main">
        <div className="container">
        <div className="row">
            <div className="col-12"><h4>Station Comparison</h4></div>
            <div className="col-12 align-self-center"><RandomAnimatedBarsLong /></div>
        </div>
        </div>
  </div>
    )
  }
}

export default StationComparison
