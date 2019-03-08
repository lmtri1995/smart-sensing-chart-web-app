import React, {Component} from 'react';
import OEEChart from "./components/OEEChart";
import OEEGeneral from "./components/OEEGeneral";
import LossOfWork from "./components/LossOfWork";
import CycleDefectStationComparison from "./components/CycleDefectStationComparison";
import SwingArmMachine from "./components/SwingArmMachine";
import SwingOSStationComparison from "./components/SwingOSStationComparison";
import moment from "moment";
import {
    ANALYSIS_OEE_CHART_OEE_GENERAL_LOSS_OF_WORK_CYCLE_DEFECT_STATION_COMPARISON_ID,
    ANALYSIS_SWING_ARM_MACHINE_SWING_OS_STATION_COMPARISON_ID
} from "../../../../constants/constants";
import Singleton from "../../../../services/Socket";
import {connect} from "react-redux";

class listBottomComponent extends Component {
    constructor(props) {
        super(props);

        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        this.state = {
            availabilityNumber: 0,
            performanceNumber: 0,
            qualityNumber: 0,
            OEENumber: 0,
            workLossNumber: 0,
        };
    }

    componentDidMount() {
        let data = [{
            "working_hr": 27000,
            "stopping_hr": 0,
            "count1": 33,
            "count2": 27,
            "cycle_count": 486,
            "preparingtime": 34953,
            "curringtime": 103630,
            "shiftno": 1,
            "timedevice": "2019-03-06 13:20:02"
        }, {
            "working_hr": 27000,
            "stopping_hr": 0,
            "count1": 65,
            "count2": 62,
            "cycle_count": 447,
            "preparingtime": 40110,
            "curringtime": 94400,
            "shiftno": 2,
            "timedevice": "2019-03-06 20:57:36"
        }];
        let totalWorkingHour = 0;
        let totalStoppingHour = 0;
        let totalProductCount = 0;
        let totalDefect = 0;
        let totalStandardCycleTime = 0;
        let totalPreparingTime = 0;
        let totalCuringTime = 0;
        let totalCycleCount = 0;
        data.map(item => {
            if (item) {
                totalWorkingHour += item.working_hr;
                totalStoppingHour += item.stopping_hr;
                totalProductCount += item.count1 + item.count2;
                totalPreparingTime += item.preparingtime;
                totalCuringTime += item.curringtime;
                totalStandardCycleTime += totalPreparingTime + totalCuringTime;
                totalCycleCount += item.cycle_count;
            }
        });
        let availability = (totalWorkingHour - totalStoppingHour) / totalWorkingHour * 100;
        availability = Math.round(availability * 100) / 100;

        console.log(`totalStandardCycleTime: ${totalStandardCycleTime} = totalProductCount: ${totalProductCount} = totalWorkingHour: ${totalWorkingHour} = totalStoppingHour: ${totalStoppingHour}`);
        let performance = (totalStandardCycleTime * totalProductCount) / (totalWorkingHour - totalStoppingHour) * 100;
        performance = Math.round(performance * 100) / 100;

        console.log(`totalProductCount: ${totalProductCount} == totalDefect: ${totalDefect} == totalProductCount: ${totalProductCount}`);
        let quality = (totalProductCount - totalDefect) / totalProductCount * 100;
        quality = Math.round(quality * 100) / 100;

        let OEE = availability * performance * quality;
        OEE = Math.round(OEE * 100) / 100;

        let workLoss = totalPreparingTime / (totalStandardCycleTime * totalCycleCount) * 100;
        workLoss = Math.round(workLoss * 100) / 100;

        performance = (performance > 100)?100:performance;
        quality = (quality > 100)?100:quality;
        availability = (availability > 100)?100:availability;
        workLoss = (workLoss > 100)?100:workLoss;
        OEE = (OEE > 100)?100:OEE;

        this.setState({
            availabilityNumber: availability,
            performanceNumber: performance,
            qualityNumber: quality,
            OEENumber: OEE,
            workLossNumber: workLoss,
        });
    }

    render() {
        let {startDate, endDate} = this.props.globalDateFilter;
        startDate = moment(startDate).unix();
        endDate = moment(endDate).unix();

        let {availabilityNumber, performanceNumber, qualityNumber, OEENumber, workLossNumber} = this.state;

        return (
            <div className="container">
                <div
                    id={ANALYSIS_OEE_CHART_OEE_GENERAL_LOSS_OF_WORK_CYCLE_DEFECT_STATION_COMPARISON_ID}
                    className="row">
                    <div className="col">
                        <div className="row">
                            <div className="col-9"><OEEChart startDate={startDate} endDate={endDate}
                                                             availabilityNumber={availabilityNumber}
                                                             performanceNumber={performanceNumber}
                                                             qualityNumber={qualityNumber}/></div>
                            <div className="col-3"><OEEGeneral startDate={startDate}
                                                               endDate={endDate}
                                                               OEENumber={OEENumber}/></div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row">
                            <div className="col-3"><LossOfWork startDate={startDate}
                                                               endDate={endDate}
                                                               workLossNumber={workLossNumber}/>
                            </div>
                            <div className="col-9"><CycleDefectStationComparison
                                startDate={startDate} endDate={endDate}/></div>
                        </div>
                    </div>
                </div>
                <div id={ANALYSIS_SWING_ARM_MACHINE_SWING_OS_STATION_COMPARISON_ID}
                     className="row">
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
