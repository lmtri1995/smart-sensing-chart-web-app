import React, {Component} from 'react'
import MixedLineBarChart  from "../../../Charts/ChartJS/components/MixedLineBarChart";

export default class DefectRate extends Component {
    render() {
        return (
            <div className="report-main">
                <div className="col-12"><h4>Defect by Type over Time</h4></div>
                <div className="col-12">
                    <MixedLineBarChart labels={this.props.labels} data={this.props.defectByTypeOverTime}
                                       showLegend={true}/>
                </div>
            </div>
        )
    }
}
