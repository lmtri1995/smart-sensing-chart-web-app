import React, {Component} from 'react';
import OEEChart from "./components/OEEChart";
import OEEGeneral from "./components/OEEGeneral";
import LossOfWork from "./components/LossOfWork";
import CycleDefectStationComparison from "./components/CycleDefectStationComparison";
import SwingArmMachine from "./components/SwingArmMachine";
import SwingOSStationComparison from "./components/SwingOSStationComparison";
import {
    DASHBOARD_OEE_CHART_OEE_GENERAL_LOSS_OF_WORK_CYCLE_DEFECT_STATION_COMPARISON_ID,
    DASHBOARD_SWING_ARM_MACHINE_SWING_OS_STATION_COMPARISON_ID,
    START_WORK_DAY_TIME
} from "../../../../constants/constants";
import Singleton from "../../../../services/Socket";
import moment from "moment";
import API from "../../../../services/api";
import {changeNumberFormat} from "../../../../shared/utils/Utilities";
import {connect} from "react-redux";

class BottomComponents extends Component {
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
                this.apiUrl = `api/os/oeedata`;
                this.emitEvent = `os_swingarm_oeedata`;
                this.eventListen = `sna_${this.emitEvent}`;
                this.standardCycleTimeUrl = 'api/os/std';
                this.OEEType = 0;
                this.process = 'os-Molding';
                break;
            case 'ip':
                this.apiUrl = `api/ip/oeedata`;
                this.emitEvent = `ip_swingarm_oeedata`;
                this.eventListen = `sna_${this.emitEvent}`;
                this.standardCycleTimeUrl = 'api/ip/std';
                this.OEEType = 1;
                this.process = 'imev';
                break;
            case 'os':
                this.apiUrl = `api/os/oeedata`;
                this.emitEvent = `os_swingarm_oeedata`;
                this.eventListen = `sna_${this.emitEvent}`;
                this.standardCycleTimeUrl = 'api/os/std';
                this.OEEType = 0;
                this.process = 'os-Molding';
                break;
            default:
                this.apiUrl = `api/os/oeedata`;
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

        this.totalWorkingHour = 0;
    }

    componentWillUnmount() {
        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                istatus: 0,
                proccess: this.process,
                type: this.OEEType,
                status: 'stop',
                shiftno: 0,
                modelname: '',
            }
        });
    }

    countCurrentWorkingHour() {
        // Shift 1: 6:00 AM - 13:30 PM -> 30 minutes break
        // Shift 2: 14:00 PM - 21:30 PM -> 30 minutes break
        // Shift 3: 22:00 PM - 5:30 AM -> 30 minutes break
        let rangeShift1 = [moment(START_WORK_DAY_TIME), moment({hours: 14})],
            rangeShift2 = [moment({hours: 14}), moment({hours: 22})],
            rangeShift3 = [moment({hours: 22}), moment(START_WORK_DAY_TIME).add({days: 1})];

        let totalWorkHoursInSecondsShift1 = 0,
            totalWorkHoursInSecondsShift2 = 0,
            totalWorkHoursInSecondsShift3 = 0;

        let curMoment = moment();

        // Don't count from 6:00 AM Sunday -> 5:59:59 AM Monday
        // Count from 6:00 AM Monday -> 5:59:59 AM Sunday
        if (curMoment.isoWeekday() >= 1 && curMoment.isSameOrAfter(moment(START_WORK_DAY_TIME))
            || curMoment.isoWeekday() <= 7 && curMoment.isBefore(moment(START_WORK_DAY_TIME))) {

            if (curMoment.isSameOrAfter(rangeShift1[0]) && curMoment.isBefore(rangeShift1[1])) {  // 6:00 AM <= curTime < 14:00 PM
                if (curMoment.isSameOrBefore(moment(rangeShift1[1]).subtract({minutes: 30}))) {    // curTime <= 13:30 PM
                    totalWorkHoursInSecondsShift1 += curMoment.diff(rangeShift1[0], "seconds");
                } else {    // 13:30 PM < curTime
                    totalWorkHoursInSecondsShift1 += moment(rangeShift1[1]).subtract({minutes: 30})
                        .diff(rangeShift1[0], "seconds"); // 27000 seconds = 7.5 hours
                }
                this.totalWorkingHour = totalWorkHoursInSecondsShift1;
            } else if (curMoment.isSameOrAfter(rangeShift2[0]) && curMoment.isBefore(rangeShift2[1])) {   // 14:00 PM <= curTime < 22:00 PM
                totalWorkHoursInSecondsShift1 += moment(rangeShift1[1]).subtract({minutes: 30})
                    .diff(rangeShift1[0], "seconds"); // 27000 seconds = 7.5 hours
                if (curMoment.isSameOrBefore(moment(rangeShift2[1]).subtract({minutes: 30}))) {  // curTime <= 21:30 PM
                    totalWorkHoursInSecondsShift2 += curMoment.diff(rangeShift2[0], "seconds");
                } else {    // 21:30 PM < curTime
                    totalWorkHoursInSecondsShift2 += moment(rangeShift2[1]).subtract({minutes: 30})
                        .diff(rangeShift2[0], "seconds");   // 27000 seconds = 7.5 hours
                }
                this.totalWorkingHour = totalWorkHoursInSecondsShift1 + totalWorkHoursInSecondsShift2;
            } else {    // 22:00 PM <= curTime < 6:00 AM
                totalWorkHoursInSecondsShift1 += moment(rangeShift1[1]).subtract({minutes: 30})
                    .diff(rangeShift1[0], "seconds"); // 27000 seconds = 7.5 hours
                totalWorkHoursInSecondsShift2 += moment(rangeShift2[1]).subtract({minutes: 30})
                    .diff(rangeShift2[0], "seconds");   // 27000 seconds = 7.5 hours
                if (curMoment.isSameOrBefore(moment(rangeShift3[1]).subtract({minutes: 30}))) {  // curTime <= 5:30 PM
                    totalWorkHoursInSecondsShift3 += curMoment.diff(rangeShift3[0], "seconds");
                } else {    // 5:30 PM < curTime
                    totalWorkHoursInSecondsShift3 += moment(rangeShift3[1]).subtract({minutes: 30})
                        .diff(rangeShift3[0], "seconds");   // 27000 seconds = 7.5 hours
                }
                this.totalWorkingHour = totalWorkHoursInSecondsShift1 + totalWorkHoursInSecondsShift2 + totalWorkHoursInSecondsShift3;
            }
        }

        return [totalWorkHoursInSecondsShift1, totalWorkHoursInSecondsShift2, totalWorkHoursInSecondsShift3];
    }

    handleReturnArray(dataArray) {
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
                let stopping_hr = item.stopping_hr ? item.stopping_hr : 0;
                let count = item.count ? item.count : 0;
                let preparingtime = item.preparingtime ? item.preparingtime : 0;
                let cycle_count = item.cycle_count ? item.cycle_count : 0;
                let defect = item.defect ? item.defect : 0;
                if (item.idStation == 1) {
                    stoppingHour1 += parseFloat(stopping_hr);
                    productCount1 += parseInt(count);
                    preparingTime1 += parseInt(preparingtime);
                    cycleCount1 += parseInt(cycle_count);
                    defect1 += parseInt(defect);
                } else if (item.idStation == 2) {
                    stoppingHour2 += parseFloat(stopping_hr);
                    productCount2 += parseInt(count);
                    preparingTime2 += parseInt(preparingtime);
                    cycleCount2 += parseInt(cycle_count);
                    defect2 += parseInt(defect);
                } else if (item.idStation == 3) {
                    stoppingHour3 += parseFloat(stopping_hr);
                    productCount3 += parseInt(count);
                    preparingTime3 += parseInt(preparingtime);
                    cycleCount3 += parseInt(cycle_count);
                    defect3 += parseInt(defect);
                } else if (item.idStation == 4) {
                    stoppingHour4 += parseFloat(stopping_hr);
                    productCount4 += parseInt(count);
                    preparingTime4 += parseInt(preparingtime);
                    cycleCount4 += parseInt(cycle_count);
                    defect4 += parseInt(defect);
                } else if (item.idStation == 5) {
                    stoppingHour5 += parseFloat(stopping_hr);
                    productCount5 += parseInt(count);
                    preparingTime5 += parseInt(preparingtime);
                    cycleCount5 += parseInt(cycle_count);
                    defect5 += parseInt(defect);
                } else if (item.idStation == 6) {
                    stoppingHour6 += parseFloat(stopping_hr);
                    productCount6 += parseInt(count);
                    preparingTime6 += parseInt(preparingtime);
                    cycleCount6 += parseInt(cycle_count);
                    defect6 += parseInt(defect);
                } else if (item.idStation == 7) {
                    stoppingHour7 += parseFloat(stopping_hr);
                    productCount7 += parseInt(count);
                    preparingTime7 += parseInt(preparingtime);
                    cycleCount7 += parseInt(cycle_count);
                    defect7 += parseInt(defect);
                } else if (item.idStation == 8) {
                    stoppingHour8 += parseFloat(stopping_hr);
                    productCount8 += parseInt(count);
                    preparingTime8 += parseInt(preparingtime);
                    cycleCount8 += parseInt(cycle_count);
                    defect8 += parseInt(defect);
                }
            });
        }

        let availability1 = (this.totalWorkingHour - stoppingHour1) / this.totalWorkingHour,
            performance1 = (standardCycleTime1 * productCount1) / (this.totalWorkingHour - stoppingHour1),
            quality1 = (productCount1 - defect1) / productCount1,
            OEE1 = availability1 * performance1 * quality1,
            workLost1 = preparingTime1 / (standardCycleTime1 * cycleCount1);

        let availability2 = (this.totalWorkingHour - stoppingHour2) / this.totalWorkingHour,
            performance2 = (standardCycleTime2 * productCount2) / (this.totalWorkingHour - stoppingHour2),
            quality2 = (productCount2 - defect2) / productCount2,
            OEE2 = availability2 * performance2 * quality2,
            workLost2 = preparingTime2 / (standardCycleTime2 * cycleCount2);

        let availability3 = (this.totalWorkingHour - stoppingHour3) / this.totalWorkingHour,
            performance3 = (standardCycleTime3 * productCount3) / (this.totalWorkingHour - stoppingHour3),
            quality3 = (productCount3 - defect3) / productCount3,
            OEE3 = availability3 * performance3 * quality3,
            workLost3 = preparingTime3 / (standardCycleTime3 * cycleCount3);

        let availability4 = (this.totalWorkingHour - stoppingHour4) / this.totalWorkingHour,
            performance4 = (standardCycleTime4 * productCount4) / (this.totalWorkingHour - stoppingHour4),
            quality4 = (productCount4 - defect4) / productCount4,
            OEE4 = availability4 * performance4 * quality4,
            workLost4 = preparingTime4 / (standardCycleTime4 * cycleCount4);

        let availability5 = (this.totalWorkingHour - stoppingHour5) / this.totalWorkingHour,
            performance5 = (standardCycleTime5 * productCount5) / (this.totalWorkingHour - stoppingHour5),
            quality5 = (productCount5 - defect5) / productCount5,
            OEE5 = availability5 * performance5 * quality5,
            workLost5 = preparingTime5 / (standardCycleTime5 * cycleCount5);

        let availability6 = (this.totalWorkingHour - stoppingHour6) / this.totalWorkingHour,
            performance6 = (standardCycleTime6 * productCount6) / (this.totalWorkingHour - stoppingHour6),
            quality6 = (productCount6 - defect6) / productCount6,
            OEE6 = availability6 * performance6 * quality6,
            workLost6 = preparingTime6 / (standardCycleTime6 * cycleCount6);

        let availability7 = (this.totalWorkingHour - stoppingHour7) / this.totalWorkingHour,
            performance7 = (standardCycleTime7 * productCount7) / (this.totalWorkingHour - stoppingHour7),
            quality7 = (productCount7 - defect7) / productCount7,
            OEE7 = availability7 * performance7 * quality7,
            workLost7 = preparingTime7 / (standardCycleTime7 * cycleCount7);

        let availability8 = (this.totalWorkingHour - stoppingHour8) / this.totalWorkingHour,
            performance8 = (standardCycleTime8 * productCount8) / (this.totalWorkingHour - stoppingHour8),
            quality8 = (productCount8 - defect8) / productCount8,
            OEE8 = availability8 * performance8 * quality8,
            workLost8 = preparingTime8 / (standardCycleTime8 * cycleCount8);

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

    countStandardCycleTime() {
        let today = new Date();
        let hour = today.getHours();
        let todayYMD = moment(today.toISOString()).format("YYYYMMDD");
        if (hour < 6) {
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
                this.standardCycleTimeArray = [standardCycleTime1, standardCycleTime2, standardCycleTime3, standardCycleTime4,
                    standardCycleTime5, standardCycleTime6, standardCycleTime7, standardCycleTime8];
            }
        }).catch((err) => console.log('err:', err));
    }

    callAxiosBeforeSocket = (stopCurrentSocket = false, callback) => {
        if (!this.state.loading) {
            this.setState({loading: true});
        }
        let currentWorkHours = this.countCurrentWorkingHour();
        let timeFromStartOfDay = [];
        let i = currentWorkHours.length - 1;
        for (; i >= 0; --i) {
            if (currentWorkHours[i] > 0) {
                break;
            }
        }
        switch (i) {
            case 0: // Shift 1
                timeFromStartOfDay.push(moment(START_WORK_DAY_TIME).unix(), moment().unix());
                break;
            case 1: // Shift 2
                timeFromStartOfDay.push(moment(START_WORK_DAY_TIME).unix(), moment().unix());
                break;
            case 2: // Shift 3
                if (currentWorkHours[2] >= 7200) {  // current moment is on the following day
                    timeFromStartOfDay.push(moment(START_WORK_DAY_TIME).subtract({days: 1}).unix(), moment().unix());
                } else {
                    timeFromStartOfDay.push(moment(START_WORK_DAY_TIME).unix(), moment().unix());
                }
                break;
        }

        let articleKey = this.props.globalArticleFilter.selectedArticle[1].key
            ? this.props.globalArticleFilter.selectedArticle[1].key
            : '';
        let param = {
            "from_timedevice": timeFromStartOfDay[0],
            "to_timedevice": timeFromStartOfDay[1],
            "modelname": articleKey,    // todo: change 'modelname' to 'articlename' on API
            "shiftno": 0,
        };
        this.setState({
            loading: true,
        });
        console.log("param 387: ", param);
        console.log("this.apiUrl: ", this.apiUrl);

        API(this.apiUrl, 'POST', param)
            .then((response) => {
                try {
                    let data = response.data.data;
                    let summaryArray = this.handleReturnArray(data);
                    let availability = 0, performance = 0, quality = 0, OEE = 0, workLost = 0;
                    summaryArray.map(item => {
                        availability += (item[0] ? item[0] : 0);
                        performance += (item[1] ? item[1] : 0);
                        quality += (item[2] ? item[2] : 0);
                        OEE += (item[3] ? item[3] : 0);
                        workLost += (item[4] ? item[4] : 0);
                    });
                    this.setState({
                        availabilityNumber: Math.round(((availability / summaryArray.length) * 100) * 100) / 100,
                        performanceNumber: Math.round(((performance / summaryArray.length) * 100) * 100) / 100,
                        qualityNumber: Math.round(((quality / summaryArray.length) * 100) * 100) / 100,
                        OEENumber: Math.round(((OEE / summaryArray.length) * 100) * 100) / 100,
                        workLossNumber: Math.round(((workLost / summaryArray.length) * 100) * 100) / 100,
                        loading: false,
                    });
                    if (!stopCurrentSocket) {
                        this.callSocket();
                    } else {
                        this.restartSocket();
                    }
                } catch (e) {
                    this.setState({
                        availabilityNumber: 0,
                        performanceNumber: 0,
                        qualityNumber: 0,
                        OEENumber: 0,
                        workLossNumber: 0,
                        loading: false,
                    });
                    if (!stopCurrentSocket) {
                        this.callSocket();
                    } else {
                        this.restartSocket();
                    }
                }
            })
            .catch((err) => console.log('err:', err))
    };

    callSocket = () => {
        let newSelectededArticle = this.props.globalArticleFilter.selectedArticle;
        let articleKey = '';
        if (newSelectededArticle) {
            articleKey = newSelectededArticle[1].key;
        }
        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                istatus: 0,
                proccess: this.process,
                type: this.OEEType,
                status: 'start',
                shiftno: 0,
                modelname: articleKey,
            }
        });
        this.socket.on(this.eventListen, (response) => {
            if (response) {
                try {
                    let returnData = JSON.parse(response.trim());
                        let data = returnData.data;
                        let summaryArray = this.handleReturnArray(data);

                        let availability = 0, performance = 0, quality = 0, OEE = 0, workLost = 0;
                        summaryArray.map(item => {
                            availability += (item[0] ? item[0] : 0);
                            performance += (item[1] ? item[1] : 0);
                            quality += (item[2] ? item[2] : 0);
                            OEE += (item[3] ? item[3] : 0);
                            workLost += (item[4] ? item[4] : 0);
                        });
                        this.setState({
                            availabilityNumber: Math.round(((availability / summaryArray.length) * 100) * 100) / 100,
                            performanceNumber: Math.round(((performance / summaryArray.length) * 100) * 100) / 100,
                            qualityNumber: Math.round(((quality / summaryArray.length) * 100) * 100) / 100,
                            OEENumber: Math.round(((OEE / summaryArray.length) * 100) * 100) / 100,
                            workLossNumber: Math.round(((workLost / summaryArray.length) * 100) * 100) / 100,
                            loading: false,
                        });
                } catch (e) {
                    this.setState({
                        availabilityNumber: 0,
                        performanceNumber: 0,
                        qualityNumber: 0,
                        OEENumber: 0,
                        workLossNumber: 0,
                        loading: false,
                    });
                }

            }
        });
    };

    //Stop old socket, create new one
    restartSocket = () => {
        let newSelectededArticle = this.props.globalArticleFilter.selectedArticle;
        let articleKey = '';
        if (newSelectededArticle) {
            articleKey = newSelectededArticle[1].key;
        }

        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                istatus: 0,
                proccess: this.process,
                type: this.OEEType,
                status: 'stop',
                shiftno: 0,
                modelname: '',
            }
        });

        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                istatus: 0,
                proccess: this.process,
                type: this.OEEType,
                status: 'start',
                shiftno: 0,
                modelname: articleKey,
            }
        });
        this.currentSelectedArticle = newSelectededArticle;
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        let currentTime = this.preTempTime;
        let newTime = this.props.tempTime;

        let currentSelectedArticle = this.currentSelectedArticle;
        let currentArticleKey = '';
        if (currentSelectedArticle) {
            currentArticleKey = currentSelectedArticle[1].key;
        }
        let newSelectedArticle = this.props.globalArticleFilter.selectedArticle;
        let newArticleKey = '';
        if (newSelectedArticle) {
            newArticleKey = newSelectedArticle[1].key;
        }

        if (currentTime != newTime || currentArticleKey != newArticleKey) {
            this.currentSelectedArticle = newSelectedArticle;
            this.callAxiosBeforeSocket(true);
        }
    }

    componentDidMount() {
        this.callAxiosBeforeSocket();
        //this.countCurrentRunningTime()
        /*setInterval(_ => {
            this.countCurrentWorkingHour();
            console.log("currentTime: ", this.currentWorkingHour);
        }, 100);*/
    }

    render() {
        let {availabilityNumber, performanceNumber, qualityNumber, OEENumber, workLossNumber} = this.state;
        availabilityNumber = changeNumberFormat(availabilityNumber);
        availabilityNumber = availabilityNumber > 100 ? 100 : availabilityNumber;
        performanceNumber = changeNumberFormat(performanceNumber);
        performanceNumber = performanceNumber > 100 ? 100 : performanceNumber;
        qualityNumber = changeNumberFormat(qualityNumber);
        qualityNumber = qualityNumber > 100 ? 100 : qualityNumber;
        OEENumber = changeNumberFormat(OEENumber);
        OEENumber = OEENumber > 100 ? 100 : OEENumber;
        workLossNumber = changeNumberFormat(workLossNumber);
        workLossNumber = workLossNumber > 100 ? 100 : workLossNumber;
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
                        <div className="col-3"><OEEGeneral OEENumber={OEENumber}
                                                           loading={this.state.loading}/></div>
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
            {
                this.role === 'ip'
                    ? ''
                    : <div id={DASHBOARD_SWING_ARM_MACHINE_SWING_OS_STATION_COMPARISON_ID}
                           className="row">
                        <div className="col-6">
                            <SwingArmMachine/>
                        </div>
                        <div className="col-6">
                            <SwingOSStationComparison/>
                        </div>
                    </div>
            }
        </div>
    }
}

const mapStateToProps = (state) => ({
    globalArticleFilter: state.globalArticleFilter,
});

export default connect(mapStateToProps)(BottomComponents);
