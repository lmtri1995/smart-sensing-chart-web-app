import React, {Component} from 'react'
import MixedLineBarChart from "../../Charts/ChartJS/components/MixedLineBarChart";

export default class ProductionRate extends Component {
    render() {
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
        return (
            <div className="report-main">
                <div className="col-12"><h4>Production Rate</h4></div>
                <div className="col-12 report-item">
                    <MixedLineBarChart labels={this.props.labels} data={this.props.productionRate} customTooltips={customChartTooltips}/>
                </div>
            </div>
        )
    }
}
