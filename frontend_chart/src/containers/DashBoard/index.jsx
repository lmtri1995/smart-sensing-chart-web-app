import React, {Component} from 'react';
import StationStatus from "./components/StationStatus/StationStatus";
import ShiftStatus from "./components/ShiftStatus/ShiftStatus";
import TemperatureTrend from "./components/TemperatureTrend/TemperatureTrend";
import ProcessStatus from "./components/ProcessStatus/ProcessStatus";
import DowntimeShift from "./components/DowntimeShift/DowntimeShift";
import {
    DASHBOARD_CONTAINER_ID,
    DASHBOARD_DOWN_TIME_BY_SHIFT_ID,
    DASHBOARD_PROCESSING_STATUS_ID,
    DASHBOARD_STATION_STATUS_SHIFT_STATUS_ID,
    ROLES
} from "../../constants/constants";
import ListBottomComponent from "./components/ListOfBottomComponent/ListOfBottomComponent";

class DashboardPage extends Component {
    constructor(props) {
        super(props);

        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        switch (this.role) {
            case ROLES.ROLE_IP:
                this.listBottomComponent = '';
                break;
            case ROLES.ROLE_ADMIN:
            case ROLES.ROLE_OS:
                this.listBottomComponent = <div className="row">
                    <div className="col">
                        <ListBottomComponent/>
                    </div>
                </div>
                break;
            default:
                this.listBottomComponent = '';
        }
    }

    render() {
        return (
            <div id={DASHBOARD_CONTAINER_ID} className="container">
                <div id={DASHBOARD_STATION_STATUS_SHIFT_STATUS_ID} className="row">
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
                <div id={DASHBOARD_PROCESSING_STATUS_ID} className="row">
                    <div className="col">
                        <ProcessStatus/>
                    </div>
                </div>
                <div id={DASHBOARD_DOWN_TIME_BY_SHIFT_ID} className="row">
                    <div className="col">
                        <DowntimeShift/>
                    </div>
                </div>
                {this.listBottomComponent}
            </div>
        )
    }
}

export default DashboardPage;
