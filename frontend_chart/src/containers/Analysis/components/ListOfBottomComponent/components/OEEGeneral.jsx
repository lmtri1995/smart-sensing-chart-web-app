import React, {Component} from 'react';
import DoughnutChart from "../../../../Charts/ChartJS/components/DoughnutChart";

export class OEEGeneral extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let {OEENumber, loading} = this.props;
        let oeeChartData = [{
            data: [OEENumber, 100 - OEENumber],
            backgroundColor: [
                "#46D6EA",
                "#303339"
            ]
        }];

        let customChartTooltips = {
            callbacks: {
                label: function(tooltipItem, data) {
                    if (data.datasets[tooltipItem.datasetIndex].data == "0"){
                        return data.labels[0] + ": " + data.datasets[tooltipItem.datasetIndex].data[0] + '%';
                    }
                    return data.labels[0] + ": " + data.datasets[tooltipItem.datasetIndex].data[0] + '%';
                },
            }
        }

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
                        <div className="col-12 align-self-center text-white"><span>OEE = Availability * Performance * Quality</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default OEEGeneral
