import React, {Component} from 'react'
import MixedLineBarChart from "../../../../Charts/ChartJS/components/MixedLineBarChart";

export class StationComparison extends Component {
    render() {
        return (
            <div className="oee-main">
                <div className="container">
                    <div className="row">
                        <div className="col-12"><h4>Station Comparison</h4></div>
                        <div className="col-12 align-self-center"><MixedLineBarChart/></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default StationComparison
