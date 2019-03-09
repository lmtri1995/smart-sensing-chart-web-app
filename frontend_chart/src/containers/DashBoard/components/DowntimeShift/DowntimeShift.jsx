import React, {Component} from 'react';
import DowntimeShiftItem from './components/DowntimeShiftItem';
import Singleton from "../../../../services/Socket";
import moment from "moment";
import {ClipLoader} from 'react-spinners';

const override = `
    position: absolute;
    display:block;
    left:45%;
    top :25%;
    z-index: 100000;
`;

export default class DowntimeShift extends Component {

    constructor(props) {

        super(props);

        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        this.state = {
            dataArray: "",
            loading: true,
        }
    }

    componentWillUnmount() {
        this._isMounted = false;

        //Unregister event
        this.socket.emit('down_shift', {
            msg: {
                event: 'sna_down_shift',
                from_timedevice: 0,
                to_timedevice: 0,
                proccess: 'os-Molding',
                status: 'stop'
            }
        });
    }

    componentDidMount() {
        this._isMounted = true;
        /*var mDateFrom = moment.utc([2019, 0, 2, 10, 6, 40]);
        var uDateFrom = mDateFrom.unix();
        var mDateTo = moment.utc([2019, 0, 2, 10, 6, 43]);
        var uDateTo = mDateTo.unix();*/

        this.socket.emit('down_shift', {
            msg: {
                event: 'sna_down_shift',
                from_timedevice: 0,
                to_timedevice: 0,
                proccess: 'os-Molding',
                status: 'start'
            }
        });

        this.socket.on('sna_down_shift', (data) => {
            if (this._isMounted) {
                let returnArray = JSON.parse(data);
                let dataArray = returnArray.data;
                dataArray.sort(function (a, b) {
                    if (parseInt(a.idStation) < parseInt(b.idStation)) {
                        return -1;
                    }
                    if (parseInt(a.idStation) > parseInt(b.idStation)) {
                        return 1;
                    }
                    return 0;
                });
                this.setState({
                    dataArray: dataArray,
                    loading: false,
                });
            }
        });

        /*socket.on('token', (data) => {
            let tokenObject = JSON.parse(data);
            if (!tokenObject.success) {
                console.log('Token is expired');
                window.location.href = (ROUTE.Logout);
            }
        });*/
    }

    specifyCurrentShift() {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth();
        let yyyy = today.getFullYear();
        let hour = today.getHours();
        let minute = today.getMinutes();
        let second = today.getSeconds();
        //shift 1: 6:00 am - 2:00 pm
        //shift 2: 2:00 am - 20:00 pm
        //shift 3: 20:00 pm - 6:00 am
        let currentTime = moment.utc([yyyy, mm, dd, hour, minute, second]).unix();
        let shift1From = moment.utc([yyyy, mm, dd, 6, 0, 0]).unix();
        let shift1To = moment.utc([yyyy, mm, dd, 14, 0, 0]).unix();
        let shift2From = shift1To;
        let shift2To = moment.utc([yyyy, mm, dd, 22, 0, 0]).unix();
        let shift3From = shift2To;
        let shift3To = moment.utc([yyyy, mm, dd + 1, 6, 0, 0]).unix();

        let result = 0;
        if (currentTime >= shift1From && currentTime < shift1To) {
            result = 1;
        } else if (currentTime >= shift2From && currentTime < shift2To) {
            result = 2;
        } else if (currentTime >= shift3From && currentTime < shift3To) {
            result = 3;
        }

        return result;
    }

    countTotal(dataArray, shiftNo){
        let init = moment({h: '0', m: '0', s: '0'});
        let initHour = 0;
        let initMinute = 0;
        let initSecond = 0;
        let total = 0;
        //let total = 0;
        for (let i = 0; i < 8; i++) {
            //total = moment.duration(dataArray[i].amount_first_shift_off).add(total);
            //total = 0;
            let tmpTime = null;
            if (shiftNo == 1){
                tmpTime = dataArray[i].first_shift_off_sum;
            } else if (shiftNo == 2){
                tmpTime = dataArray[i].second_shift_off_sum;
            } else if (shiftNo == 3){
                tmpTime = dataArray[i].third_shift_off_sum;
            }

            let hour = tmpTime ? tmpTime.substr(tmpTime.indexOf('h') - 2, 2) : 'N/A';
            let minute = tmpTime ? tmpTime.substr(tmpTime.indexOf('m') - 2, 2) : 'N/A';
            let second = tmpTime ? tmpTime.substr(tmpTime.indexOf('s') - 2, 2) : 'N/A';
            if (hour != 'N/A'){
                initHour = +hour + initHour;
            } else {
                initHour = 'N/A';
            }
            if (minute != 'N/A'){
                initMinute = +minute + initMinute;
            } else {
                initMinute = 'N/A';
            }
            if (second != 'N/A'){
                initSecond = +second + initSecond;
            } else {
                initSecond = 'N/A';
            }
        }
        if (initHour != 'N/A' && initMinute != 'N/A' && initSecond != 'N/A'){
            if (initSecond >= 60) {
                initMinute = (initSecond % 60) + initMinute;
                initSecond = Math.floor(initSecond / 60);
                if (initMinute >= 60) {
                    initHour = (initMinute % 60) + initHour;
                    initMinute = Math.floor(initMinute / 60);
                }
            }
            initSecond = (initSecond >= 10) ? initSecond : '0' + initSecond;
            initMinute = (initMinute >= 10) ? initMinute : '0' + initMinute;
            initHour = (initHour >= 10) ? initHour : '0' + initHour;
            total = initHour + 'h:' + initMinute + "m:" + initSecond + "s";
        } else {
            total = 'N/A';
        }
        return total;
    }

    showDowntimeShiftItem(dataArray, shiftNo) {
        let result = "";
        if (dataArray && dataArray.length > 7) {
            let total = this.countTotal(dataArray, shiftNo);
            if (shiftNo == 1) {
                result = <DowntimeShiftItem shiftNo={shiftNo} total={dataArray[0].first_shift_total?dataArray[0].first_shift_total:'N/A'}
                                            count1={dataArray[0].first_shift_off_sum?dataArray[0].first_shift_off_sum: 'N/A'}
                                            count2={dataArray[1].first_shift_off_sum?dataArray[1].first_shift_off_sum: 'N/A'}
                                            count3={dataArray[2].first_shift_off_sum?dataArray[2].first_shift_off_sum: 'N/A'}
                                            count4={dataArray[3].first_shift_off_sum?dataArray[3].first_shift_off_sum: 'N/A'}
                                            count5={dataArray[4].first_shift_off_sum?dataArray[4].first_shift_off_sum: 'N/A'}
                                            count6={dataArray[5].first_shift_off_sum?dataArray[5].first_shift_off_sum: 'N/A'}
                                            count7={dataArray[6].first_shift_off_sum?dataArray[6].first_shift_off_sum: 'N/A'}
                                            count8={dataArray[7].first_shift_off_sum?dataArray[7].first_shift_off_sum: 'N/A'}
                />
            } else if (shiftNo == 2) {
                result = <DowntimeShiftItem shiftNo={shiftNo} total={dataArray[0].second_shift_total?dataArray[0].second_shift_total:'N/A'}
                                            count1={dataArray[0].second_shift_off_sum?dataArray[0].second_shift_off_sum:'N/A'}
                                            count2={dataArray[1].second_shift_off_sum?dataArray[1].second_shift_off_sum:'N/A'}
                                            count3={dataArray[2].second_shift_off_sum?dataArray[2].second_shift_off_sum:'N/A'}
                                            count4={dataArray[3].second_shift_off_sum?dataArray[3].second_shift_off_sum:'N/A'}
                                            count5={dataArray[4].second_shift_off_sum?dataArray[4].second_shift_off_sum:'N/A'}
                                            count6={dataArray[5].second_shift_off_sum?dataArray[5].second_shift_off_sum:'N/A'}
                                            count7={dataArray[6].second_shift_off_sum?dataArray[6].second_shift_off_sum:'N/A'}
                                            count8={dataArray[7].second_shift_off_sum?dataArray[7].second_shift_off_sum:'N/A'}
                />
            } else if (shiftNo == 3) {
                result = <DowntimeShiftItem shiftNo={shiftNo} total={dataArray[0].third_shift_total?dataArray[0].third_shift_total:'N/A'}
                                            count1={dataArray[0].third_shift_off_sum?dataArray[0].third_shift_off_sum:'N/A'}
                                            count2={dataArray[1].third_shift_off_sum?dataArray[1].third_shift_off_sum:'N/A'}
                                            count3={dataArray[2].third_shift_off_sum?dataArray[2].third_shift_off_sum:'N/A'}
                                            count4={dataArray[3].third_shift_off_sum?dataArray[3].third_shift_off_sum:'N/A'}
                                            count5={dataArray[4].third_shift_off_sum?dataArray[4].third_shift_off_sum:'N/A'}
                                            count6={dataArray[5].third_shift_off_sum?dataArray[5].third_shift_off_sum:'N/A'}
                                            count7={dataArray[6].third_shift_off_sum?dataArray[6].third_shift_off_sum:'N/A'}
                                            count8={dataArray[7].third_shift_off_sum?dataArray[7].third_shift_off_sum:'N/A'}/>
            }
        } else {
            result = <DowntimeShiftItem shiftNo={shiftNo} total={'N/A'}
                                        count1={'N/A'}
                                        count2={'N/A'}
                                        count3={'N/A'}
                                        count4={'N/A'}
                                        count5={'N/A'}
                                        count6={'N/A'}
                                        count7={'N/A'}
                                        count8={'N/A'}/>;
        }
        return result;
    }

    showDowntimeShiftTable(dataArray) {
        let result = '';
        let currentShift = this.specifyCurrentShift();
        let shift1 = this.showDowntimeShiftItem(dataArray, 1);
        let shift2 = this.showDowntimeShiftItem(dataArray, 2);
        let shift3 = this.showDowntimeShiftItem(dataArray, 3);
        if (currentShift == 1) {
            result = <tbody>{shift2}{shift3}{shift1}</tbody>;
        } else if (currentShift == 2) {
            result = <tbody>{shift1}{shift3}{shift2}</tbody>;
        } else if (currentShift == 3) {
            result = <tbody>{shift1}{shift2}{shift3}</tbody>;
        }
        return result;
    }

    render() {
        let {dataArray} = this.state;
        return (
            <div>
                <ClipLoader
                    css={override}
                    sizeUnit={"px"}
                    size={100}
                    color={'#30D4A4'}
                    fadeIn="half"
                    fadeOut="half"
                    loading={this.state.loading}
                    margin-left={300}
                />
                <table className="table table-bordered table-dark">
                    <thead>
                    <tr>
                        <th scope="col">Down Time By Shift</th>
                        <th scope="col">1</th>
                        <th scope="col">2</th>
                        <th scope="col">3</th>
                        <th scope="col">4</th>
                        <th scope="col">5</th>
                        <th scope="col">6</th>
                        <th scope="col">7</th>
                        <th scope="col">8</th>
                        <th scope="col">Total</th>
                    </tr>
                    </thead>
                    {this.showDowntimeShiftTable(dataArray)}
                </table>
            </div>
        )
    }
}
