import React, {Component} from "react";
import DoughnutChart from "../../Charts/ChartJS/components/DoughnutChart";

export default class DefectRateOverview extends Component {
    render() {
        let {defectByTypeOverTime} = this.props;
        let chartLabels = [];
        let sumDefectsByType = [], totalDefectsText = '';
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
            let totalDefects = sumDefectsByType.reduce((acc, curVal) => acc + curVal, 0);
            totalDefectsText = totalDefects % 1 !== 0 ? totalDefects.toFixed(2) : totalDefects.toString();
        }

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
                    <DoughnutChart labels={chartLabels} data={chartData} centerText={totalDefectsText} showLegend={true}/>
                </div>
            </div>
        )
    }
}

