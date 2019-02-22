import React, { Component } from 'react'
import RandomAnimatedBarsLong from "../../Charts/ChartJS/components/RandomAnimatedBarsLong";

export default class ProductionRate extends Component {
  render() {
    return (
            <div className="report-main">
                <div className="col-12"><h4>Production Rate</h4></div>
                <div className="col-12 report-item">
                    <RandomAnimatedBarsLong />
                </div>
            </div>
    )
  }
}
