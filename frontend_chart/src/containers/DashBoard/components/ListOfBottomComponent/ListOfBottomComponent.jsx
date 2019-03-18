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
import moment from "moment";
import API from "../../../../services/api";
import {changeNumberFormat} from "../../../../shared/utils/Utilities";

export default class listBottomComponent extends Component {
    constructor(props) {
        super(props);

        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        this.standardCycleTimeArray = 0;

        switch (this.role) {
            case 'admin':
                this.emitEvent = `os_swingarm_oeedata`;
                this.eventListen = `sna_${this.emitEvent}`;
                this.standardCycleTimeUrl = 'api/os/std';
                this.OEEType = 0;
                this.process = 'os-Molding';
                break;
            case 'ip':
                this.emitEvent = `ip_swingarm_oeedata`;
                this.eventListen = `sna_${this.emitEvent}`;
                this.standardCycleTimeUrl = 'api/ip/std';
                this.OEEType = 1;
                this.process = 'imev';
                break;
            case 'os':
                this.emitEvent = `os_swingarm_oeedata`;
                this.eventListen = `sna_${this.emitEvent}`;
                this.standardCycleTimeUrl = 'api/os/std';
                this.OEEType = 0;
                this.process = 'os-Molding';
                break;
            default:
                this.emitEvent = `os_swingarm_oeedata`;
                this.eventListen = `sna_${this.emitEvent}`;
                this.standardCycleTimeUrl = 'api/os/std';
                this.OEEType = 0;
                this.process = 'os-Molding';
        }

        this.state = {
            availabilityNumber: 0,
            performanceNumber: 0,
            qualityNumber: 0,
            OEENumber: 0,
            workLossNumber: 0,
        };

        this.countStandardCycleTime();

        this.currentWorkingHour = [];
        this.totalWorkingHour = 0;
    }

    componentWillUnmount() {
        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                from_timedevice:0,
                to_timedevice:0,
                minute:0,
                istatus:0,
                proccess:this.process,
                type:this.OEEType,
                status: 'stop'
            }
        });
    }

    countCurrentWorkingHour() {
        let workingHourShift1 = 0, workingHourShift2 = 0, workingHourShift3 = 0;
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth();
        let yyyy = today.getFullYear();
        let hour = today.getHours();
        let minute = today.getMinutes();
        let second = today.getSeconds();
        //shift 1: 6:00 am - 2:00 pm
        //shift 2: 2:00 am - 22:00 pm
        //shift 3: 20:00 pm - 6:00 am

        let currentTime = moment.utc([yyyy, mm, dd, hour, minute, second]).unix();
        let shift1From = moment.utc([yyyy, mm, dd, 6, 0, 0]).unix();
        let shift1To = moment.utc([yyyy, mm, dd, 14, 0, 0]).unix();
        let shift2From = shift1To;
        let shift2To = moment.utc([yyyy, mm, dd, 22, 0, 0]).unix();
        let shift3From = shift2To;
        let shift3To = moment.utc([yyyy, mm, dd + 1, 6, 0, 0]).unix();

        if (hour < 6) {
            shift1From = moment.utc([yyyy, mm, dd - 1, 6, 0, 0]).unix();
            shift1To = moment.utc([yyyy, mm, dd - 1, 14, 0, 0]).unix();
            shift2From = shift1To;
            shift2To = moment.utc([yyyy, mm, dd - 1, 22, 0, 0]).unix();
            shift3From = shift2To;
            shift3To = moment.utc([yyyy, mm, dd, 6, 0, 0]).unix();
        }

        if (currentTime >= shift1From && currentTime < shift1To) {
            workingHourShift1 = currentTime - shift1From;
            workingHourShift1 = (workingHourShift1 < 27000)?workingHourShift1:27000;
            workingHourShift2 = 0;
            workingHourShift3 = 0;
        } else if (currentTime >= shift2From && currentTime < shift2To) {
            workingHourShift1 = 27000;
            workingHourShift2 = currentTime - shift2From;
            workingHourShift2 = (workingHourShift2 < 27000)?workingHourShift2:27000;
            workingHourShift3 = 0;
        } else {
            workingHourShift1 = 27000;
            workingHourShift2 = 27000;
            workingHourShift3 = currentTime - shift3From;
            workingHourShift3 = (workingHourShift3 < 27000)?workingHourShift3:27000;
        }

        let result = [workingHourShift1, workingHourShift2, workingHourShift3];
        this.currentWorkingHour = result;

        this.totalWorkingHour = 0;
        for (let i = 0; i < this.currentWorkingHour.length; i++){
            this.totalWorkingHour += this.currentWorkingHour[i];
        }
    }

    countStandardCycleTime() {
        let today = new Date();
        let hour = today.getHours();
        let todayYMD = moment(today.toISOString()).format("YYYYMMDD");
        if (hour < 6){
            todayYMD = moment(todayYMD).subtract(1, "days").format("YYYYMMDD");
        }
        let param = {
            from_workdate: todayYMD,
            to_workdate: todayYMD,
        };
        let standardCycleTime1 = 0, standardCycleTime2 = 0, standardCycleTime3 = 0,
            standardCycleTime4 = 0,
            standardCycleTime5 = 0, standardCycleTime6 = 0, standardCycleTime7 = 0,
            standardCycleTime8 = 0;
        API(this.standardCycleTimeUrl, 'POST', param).then((response) => {
            let dataArray = response.data.data;
            if (dataArray && dataArray.length > 0) {
                dataArray.map(item => {
                    //{STATION_NO: 7, STD_CURING_TM: 0, STD_TEMP: 0, STD_PREPARING_TM: 0,
                    // STD_PRESSURE: 0}
                    switch (item.STATION_NO) {
                        case 1:
                            standardCycleTime1 += item.STD_PREPARING_TM + item.STD_CURING_TM;
                            break;
                        case 2:
                            standardCycleTime2 += item.STD_PREPARING_TM + item.STD_CURING_TM;
                            break;
                        case 3:
                            standardCycleTime3 += item.STD_PREPARING_TM + item.STD_CURING_TM;
                            break;
                        case 4:
                            standardCycleTime4 += item.STD_PREPARING_TM + item.STD_CURING_TM;
                            break;
                        case 5:
                            standardCycleTime5 += item.STD_PREPARING_TM + item.STD_CURING_TM;
                            break;
                        case 6:
                            standardCycleTime6 += item.STD_PREPARING_TM + item.STD_CURING_TM;
                            break;
                        case 7:
                            standardCycleTime7 += item.STD_PREPARING_TM + item.STD_CURING_TM;
                            break;
                        case 8:
                            standardCycleTime8 += item.STD_PREPARING_TM + item.STD_CURING_TM;
                            break;
                    }
                });
            }
            this.standardCycleTimeArray = [standardCycleTime1, standardCycleTime2, standardCycleTime3, standardCycleTime4,
                standardCycleTime5, standardCycleTime6, standardCycleTime7, standardCycleTime8];
        }).catch((err) => console.log('err:', err));
    }

    handleReturnArray(dataArray){
        this.countCurrentWorkingHour();
        let stoppingHour1 = 0, productCount1 = 0, preparingTime1 = 0,
            cycleCount1 = 0, defect1 = 0,
            standardCycleTime1 = this.standardCycleTimeArray[0];
        let stoppingHour2 = 0, productCount2 = 0, preparingTime2 = 0,
            cycleCount2 = 0, defect2 = 0,
            standardCycleTime2 = this.standardCycleTimeArray[1];
        let stoppingHour3 = 0, productCount3 = 0, preparingTime3 = 0,
            cycleCount3 = 0, defect3 = 0,
            standardCycleTime3 = this.standardCycleTimeArray[2];
        let stoppingHour4 = 0, productCount4 = 0, preparingTime4 = 0,
            cycleCount4 = 0, defect4 = 0,
            standardCycleTime4 = this.standardCycleTimeArray[3];
        let stoppingHour5 = 0, productCount5 = 0, preparingTime5 = 0,
            cycleCount5 = 0, defect5 = 0,
            standardCycleTime5 = this.standardCycleTimeArray[4];
        let stoppingHour6 = 0, productCount6 = 0, preparingTime6 = 0,
            cycleCount6 = 0, defect6 = 0,
            standardCycleTime6 = this.standardCycleTimeArray[5];
        let stoppingHour7 = 0, productCount7 = 0, preparingTime7 = 0,
            cycleCount7 = 0, defect7 = 0,
            standardCycleTime7 = this.standardCycleTimeArray[6];
        let stoppingHour8 = 0, productCount8 = 0, preparingTime8 = 0,
            cycleCount8 = 0, defect8 = 0,
            standardCycleTime8 = this.standardCycleTimeArray[7];

        if (dataArray && dataArray.length > 0) {
            dataArray.map(item => {
                let stopping_hr = item.stopping_hr?item.stopping_hr:0;
                let count = item.count?item.count:0;
                let preparingtime = item.preparingtime?item.preparingtime:0;
                let cycle_count = item.cycle_count?item.cycle_count:0;
                let defect = item.defect?item.defect:0;
                if (item.idStation == 1){
                    stoppingHour1 += parseFloat(stopping_hr);
                    productCount1 += parseInt(count);
                    preparingTime1 += parseInt(preparingtime);
                    cycleCount1 += parseInt(cycle_count);
                    defect1 += parseInt(defect);
                } else if (item.idStation == 2){
                    stoppingHour2 += parseFloat(stopping_hr);
                    productCount2 += parseInt(count);
                    preparingTime2 += parseInt(preparingtime);
                    cycleCount2 += parseInt(cycle_count);
                    defect2 += parseInt(defect);
                } else if (item.idStation == 3){
                    stoppingHour3 += parseFloat(stopping_hr);
                    productCount3 += parseInt(count);
                    preparingTime3 += parseInt(preparingtime);
                    cycleCount3 += parseInt(cycle_count);
                    defect3 += parseInt(defect);
                } else if (item.idStation == 4){
                    stoppingHour4 += parseFloat(stopping_hr);
                    productCount4 += parseInt(count);
                    preparingTime4 += parseInt(preparingtime);
                    cycleCount4 += parseInt(cycle_count);
                    defect4 += parseInt(defect);
                } else if (item.idStation == 5){
                    stoppingHour5 += parseFloat(stopping_hr);
                    productCount5 += parseInt(count);
                    preparingTime5 += parseInt(preparingtime);
                    cycleCount5 += parseInt(cycle_count);
                    defect5 += parseInt(defect);
                } else if (item.idStation == 6){
                    stoppingHour6 += parseFloat(stopping_hr);
                    productCount6 += parseInt(count);
                    preparingTime6 += parseInt(preparingtime);
                    cycleCount6 += parseInt(cycle_count);
                    defect6 += parseInt(defect);
                } else if (item.idStation == 7){
                    stoppingHour7 += parseFloat(stopping_hr);
                    productCount7 += parseInt(count);
                    preparingTime7 += parseInt(preparingtime);
                    cycleCount7 += parseInt(cycle_count);
                    defect7 += parseInt(defect);
                } else if (item.idStation == 8){
                    stoppingHour8 += parseFloat(stopping_hr);
                    productCount8 += parseInt(count);
                    preparingTime8 += parseInt(preparingtime);
                    cycleCount8 += parseInt(cycle_count);
                    defect8 += parseInt(defect);
                }
            });
        }

        let availability1 = (this.totalWorkingHour - stoppingHour1)/this.totalWorkingHour * 100,
            performance1 = (standardCycleTime1 * productCount1)/((this.totalWorkingHour - stoppingHour1) * 8) * 100,
            quality1 = (productCount1 - defect1)/productCount1 * 100,
            OEE1 = availability1 * performance1 * quality1,
            workLost1 = preparingTime1 / (standardCycleTime1 * cycleCount1) * 100;

        let availability2 = (this.totalWorkingHour - stoppingHour2)/this.totalWorkingHour * 100,
            performance2 = (standardCycleTime2 * productCount2)/((this.totalWorkingHour - stoppingHour2) * 8) * 100,
            quality2 = (productCount2 - defect2)/productCount2 * 100,
            OEE2 = availability2 * performance2 * quality2,
            workLost2 = preparingTime2 / (standardCycleTime2 * cycleCount2) * 100;

        let availability3 = (this.totalWorkingHour - stoppingHour3)/this.totalWorkingHour * 100,
            performance3 = (standardCycleTime3 * productCount3)/((this.totalWorkingHour - stoppingHour3) * 8) * 100,
            quality3 = (productCount3 - defect3)/productCount3 * 100,
            OEE3 = availability3 * performance3 * quality3,
            workLost3 = preparingTime3 / (standardCycleTime3 * cycleCount3) * 100;


        let availability4 = (this.totalWorkingHour - stoppingHour4)/this.totalWorkingHour * 100,
            performance4 = (standardCycleTime4 * productCount4)/((this.totalWorkingHour - stoppingHour4) * 8) * 100,
            quality4 = (productCount4 - defect4)/productCount4 * 100,
            OEE4 = availability4 * performance4 * quality4,
            workLost4 = preparingTime4 / (standardCycleTime4 * cycleCount4) * 100;

        let availability5 = (this.totalWorkingHour - stoppingHour5)/this.totalWorkingHour * 100,
            performance5 = (standardCycleTime5 * productCount5)/((this.totalWorkingHour - stoppingHour5) * 8) * 100,
            quality5 = (productCount5 - defect5)/productCount5 * 100,
            OEE5 = availability5 * performance5 * quality5,
            workLost5 = preparingTime5 / (standardCycleTime5 * cycleCount5) * 100;

        let availability6 = (this.totalWorkingHour - stoppingHour6)/this.totalWorkingHour * 100,
            performance6 = (standardCycleTime6 * productCount6)/((this.totalWorkingHour - stoppingHour6) * 8) * 100,
            quality6 = (productCount6 - defect6)/productCount6 * 100,
            OEE6 = availability6 * performance6 * quality6,
            workLost6 = preparingTime6 / (standardCycleTime6 * cycleCount6) * 100;

        let availability7 = (this.totalWorkingHour - stoppingHour7)/this.totalWorkingHour * 100,
            performance7 = (standardCycleTime7 * productCount7)/(this.totalWorkingHour - stoppingHour7) * 100,
            quality7 = (productCount7 - defect7)/productCount7 * 100,
            OEE7 = availability7 * performance7 * quality7,
            workLost7 = preparingTime7 / (standardCycleTime7 * cycleCount7) * 100;

        let availability8 = (this.totalWorkingHour - stoppingHour8)/this.totalWorkingHour * 100,
            performance8 = (standardCycleTime8 * productCount8)/((this.totalWorkingHour - stoppingHour8) * 8) * 100,
            quality8 = (productCount8 - defect8)/productCount8 * 100,
            OEE8 = availability8 * performance8 * quality8,
            workLost8 = preparingTime8 / (standardCycleTime8 * cycleCount8) * 100;

        let summaryArray = [
            [availability1, performance1, quality1, OEE1, workLost1],
            [availability2, performance2, quality2, OEE2, workLost2],
            [availability3, performance3, quality3, OEE3, workLost3],
            [availability4, performance4, quality4, OEE4, workLost4],
            [availability5, performance5, quality5, OEE5, workLost5],
            [availability6, performance6, quality6, OEE6, workLost6],
            [availability7, performance7, quality7, OEE7, workLost7],
            [availability8, performance8, quality8, OEE8, workLost8]
        ];
        return summaryArray;
    }

    componentDidMount() {
        //this.countCurrentRunningTime()
        /*setInterval(_ => {
            this.countCurrentWorkingHour();
            console.log("currentTime: ", this.currentWorkingHour);
        }, 100);*/

        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                from_timedevice:0,
                to_timedevice:0,
                minute:0,
                istatus:0,
                proccess:this.process,
                type:this.OEEType,
                status: 'start'
            }
        });
        this.socket.on(this.eventListen, (response) => {
            if (response) {
                let returnData = JSON.parse(response.trim());
                if (returnData.success) {
                    let data = returnData.data;
                    let summaryArray = this.handleReturnArray(data);

                    let availability = 0, performance = 0, quality = 0, OEE = 0, workLost = 0;
                    summaryArray.map(item => {
                        availability += (item[0]?item[0]:0);
                        performance += (item[1]?item[1]:0);
                        quality += (item[2]?item[2]:0);
                        OEE += (item[3]?item[3]:0);
                        workLost += (item[4]?item[4]:0);
                    });
                    this.setState({
                        availabilityNumber: Math.round(availability/8 * 100)/100,
                        performanceNumber: Math.round(performance * 100)/100,
                        qualityNumber: Math.round(quality/8 * 100)/100,
                        OEENumber: Math.round(OEE/8 * 100)/100,
                        workLossNumber: Math.round(workLost/8 * 100)/100,
                        loading: false,
                    });
                }
            }
        });


    }

    render() {
        let {availabilityNumber, performanceNumber, qualityNumber, OEENumber, workLossNumber} = this.state;
        availabilityNumber = changeNumberFormat(availabilityNumber);
        performanceNumber = changeNumberFormat(performanceNumber);
        qualityNumber = changeNumberFormat(qualityNumber);
        OEENumber = changeNumberFormat(OEENumber);
        workLossNumber = changeNumberFormat(workLossNumber);
        return <div className="container">
            <div
                id={DASHBOARD_OEE_CHART_OEE_GENERAL_LOSS_OF_WORK_CYCLE_DEFECT_STATION_COMPARISON_ID}
                className="row">
                <div className="col">
                    <div className="row">
                        <div className="col-9"><OEEChart availabilityNumber={availabilityNumber}
                                                         performanceNumber={performanceNumber}
                                                         qualityNumber={qualityNumber}
                                                         loading={this.state.loading}/></div>
                        <div className="col-3"><OEEGeneral OEENumber={OEENumber}/></div>
                    </div>
                </div>
                <div className="col">
                    <div className="row">
                        <div className="col-3"><LossOfWork workLossNumber={workLossNumber}/>
                        </div>
                        <div className="col-9"><CycleDefectStationComparison/></div>
                    </div>
                </div>
            </div>
            {this.role == 'ip'?'':<div id={DASHBOARD_SWING_ARM_MACHINE_SWING_OS_STATION_COMPARISON_ID}
                 className="row">
                <div className="col-6">
                    <SwingArmMachine/>
                </div>
                <div className="col-6">
                    <SwingOSStationComparison/>
                </div>
            </div> }
        </div>
    }
}
