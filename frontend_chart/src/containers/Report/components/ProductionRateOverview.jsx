import React, {Component} from "react";
import DoughnutChart from "../../Charts/ChartJS/components/DoughnutChart";

export default class ProductionRateOverview extends Component {
    render() {
        return (
            <div className="report-main">
                <div className="col-12"><h4>Production Rate Overview</h4></div>
                <div className="col-12 report-item">
                    <DoughnutChart/>
                </div>
            </div>
        )
    }
}

