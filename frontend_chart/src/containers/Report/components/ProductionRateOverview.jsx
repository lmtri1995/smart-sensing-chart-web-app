import React, {Component} from "react";
import DoughnutChart from "../../Charts/ChartJS/components/DoughnutChart";
import {connect} from "react-redux";
import {SHIFT_OPTIONS} from "../../../constants/constants";
import * as Utilities from "../../../shared/utils/Utilities";

// Keep a copy of original Production Rate Data Array received from Server
// To use when filtering data by shift
var PRODUCTION_RATE_FOR_DOUGHNUT_CHART = [];

// Keep a copy of original Actual Production Data Array received from Server
// To use when filtering data by shift
var ACTUAL_PRODUCTION_FOR_DOUGHNUT_CHART = [];

class ProductionRateOverview extends Component {
    drawLegend = () => {
        if (this.chartData && this.chartData.length > 0) {
            let dataArray = this.chartData[0];
            let colorArray = dataArray.backgroundColor;
            let data = dataArray.data;
            let total = 0;
            for (let i = 0; i < data.length; i++) {
                total += data[i];
            }
            let legendValue = "<div>";
            for (let i = 0; i < colorArray.length; i++) {
                let color = colorArray[i];
                let number = data[i];
                let percent = (data[i] / total) * 100;
                legendValue += "<div style='margin-top: 5px;'>";
                legendValue += "<div id='lengendLabel' class='productionrate_legend-box'" +
                    " style='background-color: " + color + "; display: inline-block;'></div>";
                legendValue += "<div class='temperature-legend' style='display: inline-block'>" + `Shift ${i + 1}: ` + Utilities.changeNumberFormat(number) + ` (${Utilities.changeNumberFormat(percent)}%)` + "</div>" +
                    " &nbsp;" +
                    " &nbsp; ";
                legendValue += "</div>";
            }
            legendValue += "</div>";
            document.getElementById("productionRate-lengendLabel").innerHTML = legendValue;
        }
    }

    componentDidUpdate() {
        this.drawLegend();
    }

    render() {
        console.log("render");
        let {productionRate, actualProduction, loading} = this.props;
        let chartLabels = [], backgroundColor = [];
        let actualProductionsByShift = [], sumActualProduction = 0,
            totalActualProduction = 0, totalActualProductionText = 'N/A';

        // Because React pass props by reference
        // -> Affect Production Rate Mixed Line Bar Chart
        // -> Copy to temporary variable
        let tempProductionRate = [], tempActualProduction = [];
        if (productionRate) {
            tempProductionRate = productionRate.slice();
            tempActualProduction = actualProduction.slice();
        }

        let customChartTooltips;
        // Update chart data after applying Shift Filter
        if (tempProductionRate && tempActualProduction) {
            if (tempProductionRate.length >= PRODUCTION_RATE_FOR_DOUGHNUT_CHART.length) {
                PRODUCTION_RATE_FOR_DOUGHNUT_CHART = tempProductionRate.slice();
            }
            if (tempActualProduction.length >= ACTUAL_PRODUCTION_FOR_DOUGHNUT_CHART.length) {
                ACTUAL_PRODUCTION_FOR_DOUGHNUT_CHART = tempActualProduction.slice();
            }
            // Selected option is NOT All Shifts
            if (this.props.globalShiftFilter.selectedShift !== SHIFT_OPTIONS[0]) {
                tempProductionRate.length = 0;  // Empty Array
                tempActualProduction.length = 0;  // Empty Array

                PRODUCTION_RATE_FOR_DOUGHNUT_CHART.forEach((element) => {
                    if (this.props.globalShiftFilter.selectedShift === element.label) {
                        tempProductionRate.push(element);
                    }
                });
                switch (this.props.globalShiftFilter.selectedShift) {
                    case SHIFT_OPTIONS[1]:
                        tempActualProduction.push(ACTUAL_PRODUCTION_FOR_DOUGHNUT_CHART[0]);
                        break;
                    case SHIFT_OPTIONS[2]:
                        tempActualProduction.push(ACTUAL_PRODUCTION_FOR_DOUGHNUT_CHART[1]);
                        break;
                    case SHIFT_OPTIONS[3]:
                        tempActualProduction.push(ACTUAL_PRODUCTION_FOR_DOUGHNUT_CHART[2]);
                        break;
                }
            } else {    // Selected option is All Shifts
                tempProductionRate.pop();
            }
            if (tempProductionRate.length > 0 && tempActualProduction.length > 0) {
                tempProductionRate.forEach((element) => {
                    chartLabels.push(element.label);
                    backgroundColor.push(element.backgroundColor);
                });
                tempActualProduction.forEach((actualProductionsOfCurrentShift) => {
                    sumActualProduction = actualProductionsOfCurrentShift.reduce(
                        (acc, curVal) => acc + curVal, 0
                    );
                    actualProductionsByShift.push(sumActualProduction);
                });
                totalActualProduction = actualProductionsByShift.reduce(
                    (acc, curVal) => acc + curVal, 0
                );
                totalActualProductionText = Utilities.changeNumberFormat(totalActualProduction);
            }
            customChartTooltips = {
                callbacks: {
                    label: function (tooltipItem, data) {
                        let label = 'Actual: ';

                        let sumActualProduction = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        if (sumActualProduction) {
                            label += Utilities.changeNumberFormat(sumActualProduction);

                            let percentage = Utilities.changeNumberFormat(
                                (sumActualProduction / totalActualProduction) * 100
                            );
                            label += ` (${percentage}%)`;
                        } else {
                            label += 'N/A';
                        }

                        return label;
                    },
                }
            };
        }

        this.chartData = [{
            data: actualProductionsByShift,
            backgroundColor: backgroundColor
        }];

        return (
            <div className="report-main">
                <div className="col-12"><h4>Production Rate Overview</h4></div>
                <div className="col-12 report-item">
                    <DoughnutChart labels={chartLabels} data={this.chartData}
                                   centerText={totalActualProductionText}
                                   customTooltips={customChartTooltips} showLegend={false}
                                   loading={loading} />
                </div>
                <div className="col-12">
                    <div  id={'productionRate-lengendLabel'}></div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    globalShiftFilter: state.globalShiftFilter,
});

export default connect(mapStateToProps)(ProductionRateOverview);
