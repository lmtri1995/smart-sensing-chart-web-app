import React, {Component} from 'react';
import StationStatus from "./components/StationStatus/StationStatus";
import ShiftStatus from "./components/ShiftStatus/ShiftStatus";
import TemperatureTrend from "./components/TemperatureTrend/TemperatureTrend";
import ProcessStatus from "./components/ProcessStatus/ProcessStatus";
import DowntimeShift from "./components/DowntimeShift/DowntimeShift";

class AnalysisPage extends Component {

    render() {
        console.log('analysis analysis analysis analysis')
        return (
            <div className="container">
                <div className="row">
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
            </div>
        )
    }
}

export default AnalysisPage;
