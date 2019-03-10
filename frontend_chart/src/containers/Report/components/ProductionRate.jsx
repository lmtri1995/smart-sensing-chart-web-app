import React, {Component} from 'react'
import MixedLineBarChart from "../../Charts/ChartJS/components/MixedLineBarChart";
import {connect} from "react-redux";

var PRODUCTION_RATE = [];

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
        // Update chart data after applying Shift Filter
        if (productionRate) {
            if (productionRate.length >= PRODUCTION_RATE.length) {
                PRODUCTION_RATE = productionRate.slice();
            }
            productionRate.length = 0;  // Empty Array
            let averageProductionRate = 0, averageProductionRatesByDay = [];
            PRODUCTION_RATE.forEach((element, index, array) => {
                if (this.props.globalShiftFilter.selectedShifts.get(element.label) === true) {
                    productionRate.push(element);
                }
                // Recalculate Average Production Rates By Date for Filtered Shifts
                if (index === PRODUCTION_RATE.length - 1 && productionRate && productionRate.length > 0) {
                    for (let i = 0; i < productionRate[0].data.length; ++i) {
                        for (let j = 0; j < productionRate.length; ++j) {
                            averageProductionRate += productionRate[j].data[i];
                        }
                        averageProductionRate /= productionRate.length;
                        averageProductionRatesByDay.push(averageProductionRate);
                        averageProductionRate = 0;
                    }
                    productionRate.push({
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
                    <MixedLineBarChart labels={labels} data={productionRate}
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
