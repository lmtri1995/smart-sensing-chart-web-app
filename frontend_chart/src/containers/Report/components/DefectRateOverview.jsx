import React, {Component} from "react";
import DoughnutChart from "../../Charts/ChartJS/components/DoughnutChart";
import * as Utilities from "../../../shared/utils/Utilities";

export default class DefectRateOverview extends Component {
    render() {
        let {defectByTypeOverTime, loading} = this.props;
        let chartLabels = [];
        let sumDefectsByType = [], totalDefects = 0, totalDefectsText = '';
        if (defectByTypeOverTime) {
            defectByTypeOverTime.map((element, index) => {
                if (index < defectByTypeOverTime.length - 1) {
                    chartLabels.push(element.label);

                    sumDefectsByType.push(
                        element.data.reduce(    // sum all defects of current type
                            (accumulator, currentValue) => accumulator + currentValue,
                            0
                        )
                    );
                }
            });
            totalDefects = sumDefectsByType.reduce((acc, curVal) => acc + curVal, 0);
            totalDefectsText = Utilities.changeNumberFormat(totalDefects);
        }

        let customChartTooltips = {
            callbacks: {
                label: function (tooltipItem, data) {
                    let label = `${data.labels[tooltipItem.index]}: ` || '';

                    if (label && data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]) {
                        let defectCount = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        label += `${Utilities.changeNumberFormat(defectCount)}`;
                        label += ` (${Utilities.changeNumberFormat((defectCount / totalDefects) * 100)}%)`
                    } else {
                        label += 'N/A';
                    }

                    return label;
                },
            }
        };

        let chartData = [{
            data: sumDefectsByType,
            backgroundColor: [
                "#FF9C64",
                "#46D6EA",
                "#F575F7",
                "#8C67F6",
            ]
        }];

        return (
            <div className="report-main">
                <div className="col-12"><h4>Defect Rate Overview</h4></div>
                <div className="col-12 report-item">
                    <DoughnutChart labels={chartLabels} data={chartData} centerText={totalDefectsText}
                                   customTooltips={customChartTooltips} showLegend={true} loading={loading}/>
                </div>
            </div>
        )
    }
}

