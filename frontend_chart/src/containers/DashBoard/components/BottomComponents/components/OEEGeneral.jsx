import React, {Component} from 'react'
import DoughnutChart from "../../../../Charts/ChartJS/components/DoughnutChart";
import {changeNumberFormat} from "../../../../../shared/utils/Utilities";

export class OEEGeneral extends Component {

    render() {
        let {OEENumber, loading} = this.props;
        OEENumber = Math.round(OEENumber * 100) / 100;

        let oeeChartData = [{
            data: [
                OEENumber > 100 ? 100 : OEENumber,
                100 - (OEENumber > 100 ? 100 : OEENumber)
            ],
            dataForTooltips: [OEENumber, 0],
            backgroundColor: [
                "#46D6EA",
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
                        <div className="col-12">
                            <DoughnutChart loading={loading}
                                           labels={["OEE", ""]}
                                           data={oeeChartData}
                                           centerText={`${OEENumber}%`}
                                           customTooltips={customChartTooltips}/>
                        </div>
                        <div className="col-12 align-self-center text-white small"><div style={{marginTop:30,}}>OEE = Availability * Performance * Quality</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    }

    export
    default
    OEEGeneral
