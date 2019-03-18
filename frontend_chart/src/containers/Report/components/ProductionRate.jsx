import React, {Component} from 'react'
import MixedLineBarChart from "../../Charts/ChartJS/components/MixedLineBarChart";
import {connect} from "react-redux";
import {SHIFT_OPTIONS} from "../../../constants/constants";
import * as Utilities from "../../../shared/utils/Utilities";

// Keep a copy of original Production Rate Data Array received from Server
// To use when filtering data by shift
var PRODUCTION_RATE_FOR_MIXED_LINE_BAR_CHART = [];

// Keep a copy of original Target Production Data Array received from Server
// To use when filtering data by shift
var TARGET_PRODUCTIONS_FOR_MIXED_LINE_BAR_CHART = [];

// Keep a copy of original Actual Production Data Array received from Server
// To use when filtering data by shift
var ACTUAL_PRODUCTIONS_FOR_MIXED_LINE_BAR_CHART = [];

class ProductionRate extends Component {
    render() {
        let {labels, productionRate, targetProduction, actualProduction} = this.props;
        let tempTargetProduction = [];
        if (targetProduction) {
            tempTargetProduction = targetProduction.slice();
        }
        let tempActualProduction = [];
        if (actualProduction) {
            tempActualProduction = actualProduction.slice();
        }
        // Update Actual Production on tooltips of the chart after applying Shift Filter
        if (tempTargetProduction.length > 0 && tempActualProduction.length > 0) {
            if (tempTargetProduction.length >= TARGET_PRODUCTIONS_FOR_MIXED_LINE_BAR_CHART.length) {
                TARGET_PRODUCTIONS_FOR_MIXED_LINE_BAR_CHART = tempTargetProduction.slice();
            }
            if (tempActualProduction.length >= ACTUAL_PRODUCTIONS_FOR_MIXED_LINE_BAR_CHART.length) {
                ACTUAL_PRODUCTIONS_FOR_MIXED_LINE_BAR_CHART = tempActualProduction.slice();
            }
            // Selected option is Not All Shifts
            if (this.props.globalShiftFilter.selectedShift !== SHIFT_OPTIONS[0]) {
                tempTargetProduction.length = 0;
                tempActualProduction.length = 0;

                switch (this.props.globalShiftFilter.selectedShift) {
                    case SHIFT_OPTIONS[1]:
                        tempTargetProduction.push(TARGET_PRODUCTIONS_FOR_MIXED_LINE_BAR_CHART[0]);
                        tempActualProduction.push(ACTUAL_PRODUCTIONS_FOR_MIXED_LINE_BAR_CHART[0]);
                        break;
                    case SHIFT_OPTIONS[2]:
                        tempTargetProduction.push(TARGET_PRODUCTIONS_FOR_MIXED_LINE_BAR_CHART[1]);
                        tempActualProduction.push(ACTUAL_PRODUCTIONS_FOR_MIXED_LINE_BAR_CHART[1]);
                        break;
                    case SHIFT_OPTIONS[3]:
                        tempTargetProduction.push(TARGET_PRODUCTIONS_FOR_MIXED_LINE_BAR_CHART[2]);
                        tempActualProduction.push(ACTUAL_PRODUCTIONS_FOR_MIXED_LINE_BAR_CHART[2]);
                        break;
                }
            }
        }
        let customChartTooltips = {
            callbacks: {
                label: function (tooltipItem, data) {
                    let label = data.datasets[tooltipItem.datasetIndex].label + ' Production Rate' || '';
                    if (label) {
                        label += ': ';
                    }
                    label += `${tooltipItem.yLabel}%`;
                    return label;
                },
                afterLabel: function(tooltipItem, data) {
                    let actualProductionLabel = 'Actual: ';
                    if (tempActualProduction[tooltipItem.datasetIndex] && tempActualProduction.length > 0) {
                        actualProductionLabel += Utilities.changeNumberFormat(tempActualProduction[tooltipItem.datasetIndex][tooltipItem.index]);
                    } else {
                        actualProductionLabel += '0';
                    }
                    let targetProductionLabel = 'Target: ';
                    if (tempTargetProduction[tooltipItem.datasetIndex] && tempTargetProduction.length > 0) {
                        targetProductionLabel += Utilities.changeNumberFormat(tempTargetProduction[tooltipItem.datasetIndex][tooltipItem.index]);
                    } else {
                        targetProductionLabel += '0';
                    }
                    return [targetProductionLabel, actualProductionLabel];
                },
            }
        };

        // Because React pass props by reference
        // -> Affect Production Rate Overview Doughnut Chart
        // -> Copy to temporary variable
        let tempProductionRate = [];
        if (productionRate) {
            tempProductionRate = productionRate.slice();
        }

        // Update chart data after applying Shift Filter
        if (tempProductionRate.length > 0) {
            if (tempProductionRate.length >= PRODUCTION_RATE_FOR_MIXED_LINE_BAR_CHART.length) {
                PRODUCTION_RATE_FOR_MIXED_LINE_BAR_CHART = tempProductionRate.slice();
            }
            // Selected option is Not All Shifts
            if (this.props.globalShiftFilter.selectedShift !== SHIFT_OPTIONS[0]) {
                tempProductionRate.length = 0;  // Empty Array

                let averageProductionRate = 0, averageProductionRatesByDay = [];
                PRODUCTION_RATE_FOR_MIXED_LINE_BAR_CHART.forEach((element, index, array) => {
                    if (this.props.globalShiftFilter.selectedShift === element.label) {
                        tempProductionRate.push(element);
                    }
                    // Recalculate Average Production Rates By Date for Filtered Shifts
                    if (index === PRODUCTION_RATE_FOR_MIXED_LINE_BAR_CHART.length - 1 && tempProductionRate && tempProductionRate.length > 0) {
                        for (let i = 0; i < tempProductionRate[0].data.length; ++i) {
                            for (let j = 0; j < tempProductionRate.length; ++j) {
                                averageProductionRate += tempProductionRate[j].data[i];
                            }
                            averageProductionRate /= tempProductionRate.length;
                            averageProductionRatesByDay.push(averageProductionRate);
                            averageProductionRate = 0;
                        }
                        tempProductionRate.push({
                            ...array[index],
                            data: averageProductionRatesByDay,
                        });
                    }
                });
            }
        }
        return (
            <div className="report-main">
                <div className="col-12"><h4>Production Rate</h4></div>
                <div className="col-12 report-item">
                    <MixedLineBarChart labels={labels} data={tempProductionRate}
                                       customTooltips={customChartTooltips} showLegend={true}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    globalShiftFilter: state.globalShiftFilter,
});

export default connect(mapStateToProps)(ProductionRate);
