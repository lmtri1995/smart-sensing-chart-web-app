import React, {Component} from "react";
import DoughnutChart from "../../Charts/ChartJS/components/DoughnutChart";

export default class ProductionRateOverview extends Component {
    render() {
        let {productionRate} = this.props;
        let chartLabels = [];
        let sumProductionRates = [], sum = 0, averageProductionRateText = '';
        if (productionRate) {
            productionRate.map((element, index) => {
                if (index < productionRate.length - 1) {
                    chartLabels.push(element.label);

                    sum = element.data.reduce(    // sum all production rates of current shift
                        (accumulator, currentValue) => accumulator + currentValue,
                        0
                    );
                    // Round to 2 decimal places
                    sum = sum % 1 === 0 ? sum : Math.round(sum * 100) / 100;

                    sumProductionRates.push(sum);
                }
            });
            let averageProductionRate = sumProductionRates.reduce((acc, curVal) => acc + curVal, 0) / sumProductionRates.length;
            averageProductionRateText = averageProductionRate % 1 !== 0
                ? averageProductionRate.toFixed(2)
                : averageProductionRate.toString();
        }

        let chartData = [{
            data: sumProductionRates,
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
                    <DoughnutChart labels={chartLabels} data={chartData} centerText={averageProductionRateText} showLegend={true}/>
                </div>
            </div>
        )
    }
}

