import React, {Component} from "react";
import DoughnutChart from "../../Charts/ChartJS/components/DoughnutChart";
import {connect} from "react-redux";

// Keep a copy of original Production Rate Data Array received from Server
// To use when filtering data by shift
var PRODUCTION_RATE_FOR_DOUGHNUT_CHART = [];

class ProductionRateOverview extends Component {
    render() {
        let {productionRate} = this.props;
        let chartLabels = [], backgroundColor = [];
        let averageProductionRatesByShift = [], average = 0, averageProductionRateText = 'N/A';

        // Because React pass props by reference
        // -> Affect Production Rate Mixed Line Bar Chart
        // -> Copy to temporary variable
        let tempProductionRate = [];
        if (productionRate) {
            tempProductionRate = productionRate.slice();
        }

        // Update chart data after applying Shift Filter
        if (tempProductionRate) {
            if (tempProductionRate.length >= PRODUCTION_RATE_FOR_DOUGHNUT_CHART.length) {
                PRODUCTION_RATE_FOR_DOUGHNUT_CHART = tempProductionRate.slice();
            }
            tempProductionRate.length = 0;
            PRODUCTION_RATE_FOR_DOUGHNUT_CHART.forEach((element) => {
                if (this.props.globalShiftFilter.selectedShifts.get(element.label) === true) {
                    tempProductionRate.push(element);
                }
            });
            if (tempProductionRate.length > 0) {
                tempProductionRate.map((element) => {
                    chartLabels.push(element.label);
                    backgroundColor.push(element.backgroundColor);

                    average = element.data.reduce(    // sum all production rates of current shift
                        (accumulator, currentValue) => accumulator + currentValue,
                        0
                    ) / element.data.length;
                    // Round to 2 decimal places
                    average = average % 1 === 0 ? average : Math.round(average * 100) / 100;

                    averageProductionRatesByShift.push(average);
                });
                let averageProductionRate =
                    averageProductionRatesByShift.reduce((acc, curVal) => acc + curVal, 0) / averageProductionRatesByShift.length;
                averageProductionRateText = averageProductionRate % 1 !== 0
                    ? averageProductionRate.toFixed(2)
                    : averageProductionRate.toString();
            }
        }

        let chartData = [{
            data: averageProductionRatesByShift,
            backgroundColor: backgroundColor
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

const mapStateToProps = (state) => ({
    globalShiftFilter: state.globalShiftFilter,
});

export default connect(mapStateToProps)(ProductionRateOverview);
