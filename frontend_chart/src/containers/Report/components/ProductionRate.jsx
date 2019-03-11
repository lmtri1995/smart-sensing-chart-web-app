import React, {Component} from 'react'
import MixedLineBarChart from "../../Charts/ChartJS/components/MixedLineBarChart";
import {connect} from "react-redux";

// Keep a copy of original Production Rate Data Array received from Server
// To use when filtering data by shift
var PRODUCTION_RATE_FOR_MIXED_LINE_BAR_CHART = [];

class ProductionRate extends Component {
    render() {
        let {labels, productionRate} = this.props;
        let customChartTooltips = {
            callbacks: {
                label: function (tooltipItem, data) {
                    let label = data.datasets[tooltipItem.datasetIndex].label || '';
                    if (label) {
                        label += ': ';
                    }
                    label += `${tooltipItem.yLabel}%`;
                    return label;
                }
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
        if (tempProductionRate) {
            if (tempProductionRate.length >= PRODUCTION_RATE_FOR_MIXED_LINE_BAR_CHART.length) {
                PRODUCTION_RATE_FOR_MIXED_LINE_BAR_CHART = tempProductionRate.slice();
            }
            tempProductionRate.length = 0;  // Empty Array
            let averageProductionRate = 0, averageProductionRatesByDay = [];
            PRODUCTION_RATE_FOR_MIXED_LINE_BAR_CHART.forEach((element, index, array) => {
                if (this.props.globalShiftFilter.selectedShifts.get(element.label) === true) {
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
