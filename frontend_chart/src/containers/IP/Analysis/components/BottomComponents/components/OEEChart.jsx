import React, {Component} from 'react'
import DoughnutChart      from "../../../../../Charts/ChartJS/components/DoughnutChart";

export default class OEEChart extends Component {

    render() {
        let {availabilityNumber, performanceNumber, qualityNumber, loading} = this.props;
        availabilityNumber = Math.round(availabilityNumber * 100) / 100;
        performanceNumber = Math.round(performanceNumber * 100) / 100;
        qualityNumber = Math.round(qualityNumber * 100) / 100;

        let availabilityChartData = [{
            data: [
                availabilityNumber > 100 ? 100 : availabilityNumber,
                100 - (availabilityNumber > 100 ? 100 : availabilityNumber)
            ],
            dataForTooltips: [availabilityNumber, 0],
            backgroundColor: [
                "#FFFFFF",
                "#303339"
            ]
        }];
        let performanceChartData = [{
            data: [
                performanceNumber > 100 ? 100 : performanceNumber,
                100 - (performanceNumber > 100 ? 100 : performanceNumber)
            ],
            dataForTooltips: [performanceNumber, 0],
            backgroundColor: [
                "#C88FFA",
                "#303339"
            ]
        }];
        let qualityChartData = [{
            data: [
                qualityNumber > 100 ? 100 : qualityNumber,
                100 - (qualityNumber > 100 ? 100 : qualityNumber)
            ],
            dataForTooltips: [qualityNumber, 0],
            backgroundColor: [
                "#FF7033",
                "#303339"
            ]
        }];

        let customChartTooltips = {
            callbacks: {
                label: function (tooltipItem, data) {
                    return `${data.datasets[tooltipItem.datasetIndex].dataForTooltips[tooltipItem.index]}%`;
                },
            },
            filter: function (tooltipItem, data) {
                return data.datasets[tooltipItem.datasetIndex].dataForTooltips[tooltipItem.index] !== 0;
            }
        };

        return (
            <div className="oee-main">
                <div className="container">
                    <div className="row">
                        <div className="col-12"><h4>OEE</h4></div>
                        <div className="col-4 align-self-center">
                            <DoughnutChart loading={loading}
                                           labels={["Availability", ""]}
                                           data={availabilityChartData}
                                           customTooltips={customChartTooltips}
                                           centerText={`Availability\n${availabilityNumber}%`}/>
                        </div>
                        <div className="col-4 align-self-center">
                            <DoughnutChart loading={loading}
                                           labels={["Performance", ""]}
                                           data={performanceChartData}
                                           customTooltips={customChartTooltips}
                                           centerText={`Performance\n${performanceNumber}%`}/>
                        </div>
                        <div className="col-4 align-self-center">
                            <DoughnutChart loading={loading}
                                           labels={["Quality", ""]}
                                           data={qualityChartData}
                                           customTooltips={customChartTooltips}
                                           centerText={`Quality\n${qualityNumber}%`}/>
                        </div>
                    </div>
                    <div className="col-12 align-self-center text-white small">
                        <div style={{marginLeft: 100,}}>Availability: (Work Hour- Stop working time)/Work Hour *100
                        </div>
                        <div style={{marginLeft: 100,}}>Performance: (Std Cycle time*Actual Qty)/Work Hour*100</div>
                        <div style={{marginLeft: 100,}}>Quality: (Productivity-Defect)/Productivity*100</div>
                    </div>
                </div>
            </div>
        )
    }
}
