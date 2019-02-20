import React, {Component} from 'react';
import StationStatus from "./components/StationStatus/StationStatus";
import ShiftStatus from "./components/ShiftStatus/ShiftStatus";
import TemperatureTrend from "./components/TemperatureTrend/TemperatureTrend";
import ProcessStatus from "./components/ProcessStatus/ProcessStatus";
import DowntimeShift from "./components/DowntimeShift/DowntimeShift";
import {DashboardContainerID} from "../../constants/constants";
import ListBottomCom from "./components/ListOfBottomComponent/index";
class DashboardPage extends Component {

    render() {
        return (
            <div className="container" id={DashboardContainerID}>
                <div className="row">
                    <div className="col">
                       <StationStatus/>
                    </div>
                    <div className="col">
                        <ShiftStatus/>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <TemperatureTrend/>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <ProcessStatus/>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <DowntimeShift/>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <ListBottomCom />
                    </div>
                </div>
            </div>
        )
    }
}

export default DashboardPage;
