import React, {Component} from 'react';
import ShiftStatus from "./components/ShiftStatus/ShiftStatus";
import TemperatureTrend from "./components/TemperatureTrend/TemperatureTrend";
import ProcessStatus from "./components/ProcessStatus/ProcessStatus";
import ListBottomComponent from "./components/ListOfBottomComponent/ListOfBottomComponent";
import {
    ANALYSIS_CONTAINER_ID,
    ANALYSIS_PROCESSING_STATUS_ID,
    ANALYSIS_SHIFT_STATUS_ID, ROLES
} from "../../constants/constants";

class AnalysisPage extends Component {

    render() {
        return (
            <div id={ANALYSIS_CONTAINER_ID} className="container">
                <div id={ANALYSIS_SHIFT_STATUS_ID} className="row">
                    <div className="col">
                        <ShiftStatus/>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <TemperatureTrend/>
                    </div>
                </div>
                <div id={ANALYSIS_PROCESSING_STATUS_ID} className="row">
                    <div className="col">
                        <ProcessStatus/>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <ListBottomComponent/>
                    </div>
                </div>
            </div>
        )
    }
}

export default AnalysisPage;
