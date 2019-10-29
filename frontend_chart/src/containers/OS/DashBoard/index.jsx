import React, {Component} from 'react';
import StationStatus      from "./components/StationStatus/StationStatus";
import ShiftStatus        from "./components/ShiftStatus/ShiftStatus";
import TemperatureTrend   from "./components/TemperatureTrend/TemperatureTrend";
import ProcessStatus      from "./components/ProcessStatus/ProcessStatus";
import DowntimeShift      from "./components/DowntimeShift/DowntimeShift";
import {
    DASHBOARD_CONTAINER_ID,
    DASHBOARD_DOWN_TIME_BY_SHIFT_ID,
    DASHBOARD_PROCESSING_STATUS_ID,
    DASHBOARD_STATION_STATUS_SHIFT_STATUS_ID,
    ROLES
}                         from "../../../constants/constants";
import BottomComponents   from "./components/BottomComponents/BottomComponents";

class DashboardPage extends Component {
    render() {
        return (
            <div id={DASHBOARD_CONTAINER_ID} className="container">
                <div id={DASHBOARD_STATION_STATUS_SHIFT_STATUS_ID} className="row">
                    <div className="col">
                        {/*<StationStatus/>*/}
                    </div>
                    <div className="col">
                        {/*<ShiftStatus/>*/}
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <TemperatureTrend/>
                    </div>
                </div>
                {/*<div id={DASHBOARD_PROCESSING_STATUS_ID} className="row">
                    <div className="col">
                        <ProcessStatus/>
                    </div>
                </div>
                <div id={DASHBOARD_DOWN_TIME_BY_SHIFT_ID} className="row">
                    <div className="col">
                        <DowntimeShift/>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <BottomComponents/>
                    </div>
                </div>*/}
            </div>
        )
    }
}

export default DashboardPage;
