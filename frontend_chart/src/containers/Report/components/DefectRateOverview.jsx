import React, {Component} from "react";
import DoughnutChart from "../../Charts/ChartJS/components/DoughnutChart";
import * as Utilities from "../../../shared/utils/Utilities";
import {DEFECT_COLORS} from "../../../constants/constants";

export default class DefectRateOverview extends Component {

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

                legendValue += `
                    <div style='margin-top: 5px;'>
                        <div id='lengendLabel' class='productionrate_legend-box'
                             style='background-color: ${color}; display: inline-block;'>
                        </div>
                        <div class='temperature-legend' style='display: inline-block'>
                            ${this.chartLabels[i]}: ${Utilities.changeNumberFormat(number)} (${Utilities.changeNumberFormat(percent)}%)
                        </div>
                        &nbsp; &nbsp;
                    </div> 
                `;
            }
            legendValue += "</div>";
            document.getElementById("defectRate-lengendLabel").innerHTML = legendValue;
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.chartLabels && this.chartLabels.length > 0){
            this.drawLegend();
        }
    }

    render() {
        let {defectByTypeOverTime, loading} = this.props;
        this.chartLabels = [];
        let colors = [];
        let sumDefectsByType = [], totalDefects = 0, totalDefectsText = '';
        if (defectByTypeOverTime) {
            defectByTypeOverTime.map((element, index) => {
                if (index < defectByTypeOverTime.length - 1) {
                    this.chartLabels.push(element.label);
                    colors.push(element.backgroundColor);

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

        this.chartData = [{
            data: sumDefectsByType,
            backgroundColor: colors,
        }];

        return (
            <div className="report-main">
                <div className="col-12"><h4>Defect Rate Overview</h4></div>
                <div className="col-12">
                    <DoughnutChart labels={this.chartLabels} data={this.chartData}
                                   centerText={totalDefectsText}
                                   customTooltips={customChartTooltips} showLegend={false}
                                   loading={loading}/>
                    <div id={'defectRate-lengendLabel'}/>
                </div>
            </div>
        )
    }
}

