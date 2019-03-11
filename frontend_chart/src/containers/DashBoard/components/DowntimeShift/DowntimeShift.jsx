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

        switch (this.role) {
            case 'admin':
                /*this.emitEvent = `os_temp_trend_${stationIdNo}`;
                this.eventListen = `os_chart_temp_trend_${stationIdNo}`;*/
                this.process = "os-Molding";
                break;
            case 'ip':
                /* this.emitEvent = `ip_temp_trend_${stationIdNo}`;
                 this.eventListen = `ip_chart_temp_trend_${stationIdNo}`;*/
                this.process = "imev";
                break;
            case 'os':
                /*this.emitEvent = `os_temp_trend_${stationIdNo}`;
                this.eventListen = `os_chart_temp_trend_${stationIdNo}`;*/
                this.process = "os-Molding";
                break;
            default:
                /*this.emitEvent = `os_temp_trend_${stationIdNo}`;
                this.eventListen = `os_chart_temp_trend_${stationIdNo}`;*/
                this.process = "os-Molding";
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
            console.log("data 88: ", data);
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
        //shift 2: 2:00 am - 22:00 pm
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

    showDowntimeShiftItem(dataArray, shiftNo) {
        console.log("dataArray: ", dataArray);
        let result = "";


        if (dataArray && dataArray.length > 0) {
            if (shiftNo == 1) {
                result = <DowntimeShiftItem shiftNo={shiftNo}
                                            count1={dataArray[0][0]}
                                            count2={dataArray[0][1]}
                                            count3={dataArray[0][2]}
                                            count4={dataArray[0][3]}
                                            count5={dataArray[0][4]}
                                            count6={dataArray[0][5]}
                                            count7={dataArray[0][6]}
                                            count8={dataArray[0][7]}
                                            total ={dataArray[0][8]}
                />
            } else if (shiftNo == 2){
                result = <DowntimeShiftItem shiftNo={shiftNo}
                                            count1={dataArray[1][0]}
                                            count2={dataArray[1][1]}
                                            count3={dataArray[1][2]}
                                            count4={dataArray[1][3]}
                                            count5={dataArray[1][4]}
                                            count6={dataArray[1][5]}
                                            count7={dataArray[1][6]}
                                            count8={dataArray[1][7]}
                                            total ={dataArray[1][8]}
                />
            } else if (shiftNo == 3){
                result = <DowntimeShiftItem shiftNo={shiftNo}
                                            count1={dataArray[2][0]}
                                            count2={dataArray[2][1]}
                                            count3={dataArray[2][2]}
                                            count4={dataArray[2][3]}
                                            count5={dataArray[2][4]}
                                            count6={dataArray[2][5]}
                                            count7={dataArray[2][6]}
                                            count8={dataArray[2][7]}
                                            total ={dataArray[2][8]}
                />
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

    handleData(dataArray){
        let downtimeShiftArray1 = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
        let downtimeShiftArray2 = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
        let downtimeShiftArray3 = ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
        let downtimeShiftArraySummary = [];
        if (dataArray && dataArray.length){
            downtimeShiftArray1[8] = dataArray[0].first_shift_total;
            downtimeShiftArray2[8] = dataArray[0].second_shift_total;
            downtimeShiftArray3[8] = dataArray[0].third_shift_total;
            dataArray.map(item => {
                if (item.idStation == 1){
                    downtimeShiftArray1[0] = item.first_shift_sum;
                    downtimeShiftArray2[0] = item.second_shift_off_sum;
                    downtimeShiftArray3[0] = item.third_shift_off_sum;
                } else if (item.idStation == 2){
                    downtimeShiftArray1[1] = item.first_shift_sum;
                    downtimeShiftArray2[1] = item.second_shift_off_sum;
                    downtimeShiftArray3[1] = item.third_shift_off_sum;
                } else if (item.idStation == 3){
                    downtimeShiftArray1[2] = item.first_shift_sum;
                    downtimeShiftArray2[2] = item.second_shift_off_sum;
                    downtimeShiftArray3[2] = item.third_shift_off_sum;
                } else if (item.idStation == 4){
                    downtimeShiftArray1[3] = item.first_shift_sum;
                    downtimeShiftArray2[3] = item.second_shift_off_sum;
                    downtimeShiftArray3[3] = item.third_shift_off_sum;
                } else if (item.idStation == 5){
                    downtimeShiftArray1[4] = item.first_shift_sum;
                    downtimeShiftArray2[4] = item.second_shift_off_sum;
                    downtimeShiftArray3[4] = item.third_shift_off_sum;
                } else if (item.idStation == 6){
                    downtimeShiftArray1[5] = item.first_shift_sum;
                    downtimeShiftArray2[5] = item.second_shift_off_sum;
                    downtimeShiftArray3[5] = item.third_shift_off_sum;
                } else if (item.idStation == 7){
                    downtimeShiftArray1[6] = item.first_shift_sum;
                    downtimeShiftArray2[6] = item.second_shift_off_sum;
                    downtimeShiftArray3[6] = item.third_shift_off_sum;
                } else if (item.idStation == 8){
                    downtimeShiftArray1[7] = item.first_shift_sum;
                    downtimeShiftArray2[7] = item.second_shift_off_sum;
                    downtimeShiftArray3[7] = item.third_shift_off_sum;
                }
            });
        }
        downtimeShiftArraySummary = [downtimeShiftArray1, downtimeShiftArray2, downtimeShiftArray3];
        return downtimeShiftArraySummary;
    }

    showDowntimeShiftTable(dataArray) {
        let result = '';
        let currentShift = this.specifyCurrentShift();
        let processData = this.handleData(dataArray);
        let shift1 = this.showDowntimeShiftItem(processData, 1);
        let shift2 = this.showDowntimeShiftItem(processData, 2);
        let shift3 = this.showDowntimeShiftItem(processData, 3);
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
