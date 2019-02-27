import React, {Component} from 'react'
import LineChart from "./TemperatureTrendLine";
import Refresh from "../../../../../shared/img/Refresh.svg";

export default class TemperatureTrendItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isRefresh: false,
        };
    }

    refresh = ()=> {
        this.line.refresh();
    }

    render() {
        let {stationId} = this.props;
        return (
            <div className="col">
                <div className="row">
                    <div className="col-11">
                        <h4 className="float-left">STATION {stationId}: USL/ Value/ LSL</h4>
                    </div>
                    <div className="col-1">
                        <img className="float-right" src={Refresh} style={{width: '50%'}} onClick={this.refresh}/>
                    </div>
                </div>
                <LineChart stationId={stationId} onRef={ref => this.line = ref}/>
            </div>
        );
    }
}
