import React, {Component} from 'react';
import ShiftStatus from "./components/ShiftStatus/ShiftStatus";
import TemperatureTrend from "./components/TemperatureTrend/TemperatureTrend";
import ProcessStatus from "./components/ProcessStatus/ProcessStatus";
import ListBottomComponent from "./components/ListOfBottomComponent/ListOfBottomComponent";

class AnalysisPage extends Component {

    render() {
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
