import React, {Component} from 'react'
import DoughnutChart from "../../../../Charts/ChartJS/components/DoughnutChart";

export default class OOEChart extends Component {
    render() {
        return (
            <div className="oee-main">
                <div className="container">
                    <div className="row">
                        <div className="col-12"><h4>OEE</h4></div>
                        <div className="col-4 align-self-center"><DoughnutChart/></div>
                        <div className="col-4 align-self-center"><DoughnutChart/></div>
                        <div className="col-4 align-self-center"><DoughnutChart/></div>
                    </div>
                </div>
            </div>
        )
    }
}
