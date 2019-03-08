import React, {Component} from 'react';
import OEEChart from "./components/OEEChart";
import OEEGeneral from "./components/OEEGeneral";
import LossOfWork from "./components/LossOfWork";
import CycleDefectStationComparison from "./components/CycleDefectStationComparison";
import SwingArmMachine from "./components/SwingArmMachine";
import SwingOSStationComparison from "./components/SwingOSStationComparison";
import {
    DASHBOARD_OEE_CHART_OEE_GENERAL_LOSS_OF_WORK_CYCLE_DEFECT_STATION_COMPARISON_ID,
    DASHBOARD_SWING_ARM_MACHINE_SWING_OS_STATION_COMPARISON_ID
} from "../../../../constants/constants";
import Singleton from "../../../../services/Socket";

export default class listBottomComponent extends Component {
    constructor(props) {
        super(props);

        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        switch(this.role) {
            case 'admin':
                this.emitEvent = `os_swingarm_oeedata`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            case 'ip':
                this.emitEvent = `os_swingarm_oeedata`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            case 'os':
                this.emitEvent = `os_swingarm_oeedata`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            default:
                this.emitEvent = `os_swingarm_oeedata`;
                this.eventListen = `sna_${this.emitEvent}`;
        }

        this.state = {
            availabilityNumber: 0,
            performanceNumber: 0,
            qualityNumber: 0,
            OEENumber: 0,
            workLossNumber: 0,
        };
    }

    componentWillUnmount() {
        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                //idStation:0,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                status: 'stop'
            }
        });
    }

    componentDidMount(){
        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                //idStation:0,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                status: 'start'
            }
        });
        this.socket.on(this.eventListen, (response) => {
            if (response){
                let returnData = JSON.parse(response);
                if (returnData.success){
                    let data = returnData.data;
                    let totalWorkingHour = 0;
                    let totalStoppingHour = 0;
                    let totalProductCount = 0;

                    let totalDefectCount = localStorage.getItem("totalDefectCount");
                    let totalDefect = totalDefectCount?totalDefectCount:'N/A';

                    console.log("totalDefect: ", totalDefect);
                    let totalStandardCycleTime = 0;
                    let totalPreparingTime = 0;
                    let totalCuringTime = 0;
                    let totalCycleCount = 0;
                    data.map(item=> {
                        if (item){
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

                    console.log(`totalStandardCycleTime: ${totalStandardCycleTime} =
                    totalProductCount: ${totalProductCount} = totalWorkingHour: ${totalWorkingHour} = totalStoppingHour: ${totalStoppingHour}`);
                    let performance = (totalStandardCycleTime * totalProductCount) / (totalWorkingHour - totalStoppingHour) * 100;
                    performance = Math.round(performance * 100) / 100;

                    //console.log(`totalProductCount: ${totalProductCount} == totalDefect:
                    // ${totalDefect} == totalProductCount: ${totalProductCount}`);
                    let quality = 0;
                    if (totalDefect != 'N/A'){
                        quality = (totalProductCount - totalDefect)/totalProductCount * 100;
                        quality = Math.round(quality * 100) / 100;
                    }


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
            }
        });

    }

    render() {
        let {availabilityNumber, performanceNumber, qualityNumber, OEENumber, workLossNumber} = this.state;
        return <div className="container">
            <div id={DASHBOARD_OEE_CHART_OEE_GENERAL_LOSS_OF_WORK_CYCLE_DEFECT_STATION_COMPARISON_ID} className="row">
                <div className="col">
                    <div className="row">
                        <div className="col-9"><OEEChart availabilityNumber={availabilityNumber} performanceNumber={performanceNumber} qualityNumber={qualityNumber} /></div>
                        <div className="col-3"><OEEGeneral OEENumber={OEENumber}/></div>
                    </div>
                </div>
                <div className="col">
                    <div className="row">
                        <div className="col-3"><LossOfWork workLossNumber={workLossNumber} /></div>
                        <div className="col-9"><CycleDefectStationComparison /></div>
                    </div>
                </div>
            </div>
            <div id={DASHBOARD_SWING_ARM_MACHINE_SWING_OS_STATION_COMPARISON_ID} className="row">
                <div className="col-6">
                    <SwingArmMachine/>
                </div>
                <div className="col-6">
                    <SwingOSStationComparison/>
                </div>
            </div>
        </div>
    }
}
