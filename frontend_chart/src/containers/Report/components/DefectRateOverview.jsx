import React, {Component} from "react";
import DoughnutChart from "../../Charts/ChartJS/components/DoughnutChart";
import API from "../../../services/api";

export default class DefectRateOverview extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataArray: null
        };

        let param = {
            from_workdate: "20190202",
            to_workdate: "20190202",
        };
        API('api/os/defectRateOverview', 'POST', param)
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;
                    this.setState({
                        dataArray: dataArray,
                    });
                }
            })
            .catch((err) => console.log('err:', err))
    }

    render() {
        return (
            <div className="report-main">
                <div className="col-12"><h4>Defect Rate Overview</h4></div>
                <div className="col-12 report-item">
                    <DoughnutChart data={this.state.dataArray}/>
                </div>
            </div>
        )
    }
}

