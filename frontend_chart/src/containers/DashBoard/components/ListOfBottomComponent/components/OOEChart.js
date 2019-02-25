import React, {Component} from 'react'
import Doughtnut from "../../../../Charts/ChartJS/components/RamdomAnimatedDoughnut";

export class OOEChart extends Component {
    render() {
        return (
            <div className="oee-main">
                <div className="container">
                    <div className="row">
                        <div className="col-12"><h4>OEE</h4></div>
                        <div className="col-4 align-self-center"><Doughtnut/></div>
                        <div className="col-4 align-self-center"><Doughtnut/></div>
                        <div className="col-4 align-self-center"><Doughtnut/></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default OOEChart
