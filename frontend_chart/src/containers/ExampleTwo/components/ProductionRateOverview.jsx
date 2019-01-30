import React, {Component} from "react";
import RamdomAnimatedDoughnut from "../../Charts/ChartJS/components/RamdomAnimatedDoughnut";
export class ProductionRateOverview extends Component {
  render() {
    return (
        <div className="report-main">
            <div className="col-12"><h4>Production Rate Overview</h4></div>
            <div className="col-12 report-item">
                <RamdomAnimatedDoughnut />
            </div>
        </div>
    )
  }
}

export default ProductionRateOverview

