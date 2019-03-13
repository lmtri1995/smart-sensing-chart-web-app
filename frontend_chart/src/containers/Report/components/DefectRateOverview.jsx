import React, {Component} from "react";
import DoughnutChart from "../../Charts/ChartJS/components/DoughnutChart";
import * as Utilities from "../../../shared/utils/Utilities";

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
                let label = "";
                label = this.chartLabels[i].substring(0, this.chartLabels[i].indexOf('('));
                if (label == ''){
                    label = this.chartLabels[i];
                }

                legendValue += "<div style='margin-top: 5px;'>";
                legendValue += "<div id='lengendLabel' class='productionrate_legend-box'" +
                    " style='background-color: " + color + "; display: inline-block;'></div>";
                legendValue += "<div class='temperature-legend' style='display: inline-block'>" + `${label}: ` + Utilities.changeNumberFormat(number) + ` (${Utilities.changeNumberFormat(percent)}%)` + "</div>" +
                    " &nbsp;" +
                    " &nbsp; ";
                legendValue += "</div>";
            }
            legendValue += "</div>";
            document.getElementById("defectRate-lengendLabel").innerHTML = legendValue;
        }
    }

    componentDidUpdate() {
        if (this.chartLabels && this.chartLabels.length > 0){
            this.drawLegend();
        }
    }

    render() {
        let {defectByTypeOverTime, loading} = this.props;
        this.chartLabels = [];
        let sumDefectsByType = [], totalDefects = 0, totalDefectsText = '';
        if (defectByTypeOverTime) {
            defectByTypeOverTime.map((element, index) => {
                if (index < defectByTypeOverTime.length - 1) {
                    this.chartLabels.push(element.label);

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
                    <DoughnutChart labels={this.chartLabels} data={this.chartData}
                                   centerText={totalDefectsText}
                                   customTooltips={customChartTooltips} showLegend={false}
                                   loading={loading}/>
                </div>
                <div className="col-12">
                    <div id={'defectRate-lengendLabel'}></div>
                </div>
            </div>
        )
    }
}

