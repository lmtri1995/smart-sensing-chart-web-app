import React, {Component} from 'react';
import StationStatus from "./components/StationStatus/StationStatus";
import ShiftStatus from "./components/ShiftStatus/ShiftStatus";
import TemperatureTrend from "./components/TemperatureTrend/TemperatureTrend";
import ProcessStatus from "./components/ProcessStatus/ProcessStatus";
import DowntimeShift from "./components/DowntimeShift/DowntimeShift";

class DashboardPage extends Component {

    render() {
        return (
            <div className="container">
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
            </div>
        )
    }
}

export default DashboardPage;
