import React, {Component} from "react";
import DoughnutChart from "../../Charts/ChartJS/components/DoughnutChart";

export default class ProductionRateOverview extends Component {
    render() {
        let {productionRate} = this.props;
        let chartLabels = [];
        let averageProductionRatesByShift = [], average = 0, averageProductionRateText = '';
        if (productionRate) {
            productionRate.map((element, index) => {
                if (index < productionRate.length - 1) {
                    chartLabels.push(element.label);

                    average = element.data.reduce(    // sum all production rates of current shift
                        (accumulator, currentValue) => accumulator + currentValue,
                        0
                    ) / element.data.length;
                    // Round to 2 decimal places
                    average = average % 1 === 0 ? average : Math.round(average * 100) / 100;

                    averageProductionRatesByShift.push(average);
                }
            });
            let averageProductionRate =
                averageProductionRatesByShift.reduce((acc, curVal) => acc + curVal, 0) / averageProductionRatesByShift.length;
            averageProductionRateText = averageProductionRate % 1 !== 0
                ? averageProductionRate.toFixed(2)
                : averageProductionRate.toString();
        }

        let chartData = [{
            data: averageProductionRatesByShift,
            backgroundColor: [
                "#FF9C64",
                "#8C67F6",
                "#F575F7",
            ]
        }];

        return (
            <div className="report-main">
                <div className="col-12"><h4>Production Rate Overview</h4></div>
                <div className="col-12 report-item">
                    <DoughnutChart labels={chartLabels} data={chartData} centerText={averageProductionRateText}
                                   showLegend={true}/>
                </div>
            </div>
        )
    }
}

