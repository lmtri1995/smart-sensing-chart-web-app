import React, {Component} from 'react';
import OEEChart from "./components/OEEChart";
import OEEGeneral from "./components/OEEGeneral";
import LossOfWork from "./components/LossOfWork";
import CycleDefectStationComparison from "./components/CycleDefectStationComparison";
import SwingArmMachine from "./components/SwingArmMachine";
import SwingOSStationComparison from "./components/SwingOSStationComparison";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import {
    ANALYSIS_OEE_CHART_OEE_GENERAL_LOSS_OF_WORK_CYCLE_DEFECT_STATION_COMPARISON_ID,
    ANALYSIS_SWING_ARM_MACHINE_SWING_OS_STATION_COMPARISON_ID
} from "../../../../constants/constants";

class listBottomComponent extends Component {

    render() {
        let {startDate, endDate} = this.props.globalDateFilter;
        startDate = moment(startDate).unix();
        endDate = moment(endDate).unix();


        return (
            <div className="container">
                <div id={ANALYSIS_OEE_CHART_OEE_GENERAL_LOSS_OF_WORK_CYCLE_DEFECT_STATION_COMPARISON_ID}
                     className="row">
                    <div className="col">
                        <div className="row">
                            <div className="col-9"><OEEChart startDate={startDate} endDate={endDate}/></div>
                            <div className="col-3"><OEEGeneral startDate={startDate} endDate={endDate}/></div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row">
                            <div className="col-3"><LossOfWork startDate={startDate} endDate={endDate}/></div>
                            <div className="col-9"><CycleDefectStationComparison startDate={startDate}
                                                                                 endDate={endDate}/></div>
                        </div>
                    </div>
                </div>
                <div id={ANALYSIS_SWING_ARM_MACHINE_SWING_OS_STATION_COMPARISON_ID} className="row">
                    <div className="col-6">
                        <SwingArmMachine startDate={startDate} endDate={endDate}/>
                    </div>
                    <div className="col-6">
                        <SwingOSStationComparison startDate={startDate} endDate={endDate}/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    globalDateFilter: state.globalDateFilter
});

export default connect(mapStateToProps)(listBottomComponent);
