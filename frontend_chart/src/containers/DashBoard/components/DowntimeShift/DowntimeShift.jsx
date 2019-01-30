import React, {Component} from 'react';
import DowntimeShiftItem from './components/DowntimeShiftItem';
import Singleton from "../../../../services/Socket";
import moment from "moment";

export default class DowntimeShift extends Component {
    static socket = null;
    static _isMounted = false;
    static loginData = null;
    static role = null;

    constructor(props) {

        super(props);

        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        this.state = {
            dataArray: "",
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        /*var mDateFrom = moment.utc([2019, 0, 2, 10, 6, 40]);
        var uDateFrom = mDateFrom.unix();
        var mDateTo = moment.utc([2019, 0, 2, 10, 6, 43]);
        var uDateTo = mDateTo.unix();*/
        let process = 'os-Molding';
        switch(this.role) {
            case 'admin':
                process = 'os-Molding';
                break;
            case 'ip':
                process = 'os-Molding';
                break;
            case 'os':
                process = 'os-Molding';
                break;
        }
        this.socket.emit('down_shift', {
            msg: {
                event: 'sna_down_shift',
                from_timedevice: 0,
                to_timedevice: 0,
                proccess: process,
                status: 'start'
            }
        });

        this.socket.on('sna_down_shift', (data) => {
            console.log("sna_down_shift 45: ", data);
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
                });
            }
        });

        /*socket.on('token', (data) => {
            let tokenObject = JSON.parse(data);
            if (!tokenObject.success) {
                console.log('Token is expired');
                window.location.href = ("/logout");
            }
        });*/
    }

    specifyCurrentShift(dataArray) {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth();
        let yyyy = today.getFullYear();
        //shift 1: 6:00 am - 2:00 pm
        //shift 2: 2:00 am - 20:00 pm
        //shift 3: 20:00 pm - 6:00 am
        let shift1From = moment.utc([yyyy, mm, dd, 6, 0, 0]).unix();
        let shift1To = moment.utc([yyyy, mm, dd, 14, 0, 0]).unix();
        let shift2From = shift1To;
        let shift2To = moment.utc([yyyy, mm, dd, 20, 0, 0]).unix();
        let shift3From = shift2To;
        let shift3To = moment.utc([yyyy, mm, dd + 1, 6, 0, 0]).unix();

        let result = 0;
        if (dataArray.length > 0) {
            let timeReceived = dataArray[7].timeRecieved;
            if (timeReceived >= shift1From && timeReceived < shift1To) {
                result = 1;
            } else if (timeReceived >= shift2From && timeReceived < shift2To) {
                result = 2;
            } else if (timeReceived >= shift3From && timeReceived < shift3To) {
                result = 3;
            }
        }
        result = 3;
        return result;
    }

    showDowntimeShiftItem(dataArray, shiftNo) {
        let result = "";
        if (dataArray && dataArray.length > 0) {
            if (shiftNo == 1) {
                let init = moment({h: '0', m: '0', s: '0'});
                let total = 0;
                for (let i = 0; i < 8; i++) {
                    //total = moment.duration(dataArray[i].amount_first_shift_off).add(total);
                    //total = 0;
                    let tmpTime = dataArray[i].first_shift_off_sum;
                    let hour = tmpTime?tmpTime.substr(tmpTime.indexOf('h') - 2, tmpTime.indexOf('h')):0;
                    let minute = tmpTime?tmpTime.substr(tmpTime.indexOf('m') - 2, tmpTime.indexOf('m')):0;
                    let second = tmpTime?tmpTime.substr(tmpTime.indexOf('s') - 2, tmpTime.indexOf('s')):0;
                    //let mTime = moment({h: hour, m: minute, s: second});
                    total = init.add(hour, 'hours', minute, 'minutes', second, 'seconds').format('HH:mm:ss');
                }
                result = <DowntimeShiftItem shiftNo={shiftNo} total={total}
                                            count1={dataArray[0].first_shift_off_sum}
                                            count2={dataArray[1].first_shift_off_sum}
                                            count3={dataArray[2].first_shift_off_sum}
                                            count4={dataArray[3].first_shift_off_sum}
                                            count5={dataArray[4].first_shift_off_sum}
                                            count6={dataArray[5].first_shift_off_sum}
                                            count7={dataArray[6].first_shift_off_sum}
                                            count8={dataArray[7].first_shift_off_sum}
                />
            } else if (shiftNo == 2) {
                let total = 0;

                result = <DowntimeShiftItem shiftNo={shiftNo} total={total}
                                            count1={dataArray[0].amount_second_shift_off}
                                            count2={dataArray[1].amount_second_shift_off}
                                            count3={dataArray[2].amount_second_shift_off}
                                            count4={dataArray[3].amount_second_shift_off}
                                            count5={dataArray[4].amount_second_shift_off}
                                            count6={dataArray[5].amount_second_shift_off}
                                            count7={dataArray[6].amount_second_shift_off}
                                            count8={dataArray[7].amount_second_shift_off}
                />
            } else if (shiftNo == 3) {
                let total = 0;
                for (let i = 0; i < 8; i++) {
                    //total = moment.duration(dataArray[i].amount_first_shift_off).add(total);
                    total = 0;
                }
                result = <DowntimeShiftItem shiftNo={shiftNo} total={total}
                                            count1={dataArray[0].amount_third_shift_off}
                                            count2={dataArray[1].amount_third_shift_off}
                                            count3={dataArray[2].amount_third_shift_off}
                                            count4={dataArray[3].amount_third_shift_off}
                                            count5={dataArray[4].amount_third_shift_off}
                                            count6={dataArray[5].amount_third_shift_off}
                                            count7={dataArray[6].amount_third_shift_off}
                                            count8={dataArray[7].amount_third_shift_off}/>
            }
        } else {
            result = <DowntimeShiftItem shiftNo={shiftNo} total={0}
                                        count1={0}
                                        count2={0}
                                        count3={0}
                                        count4={0}
                                        count5={0}
                                        count6={0}
                                        count7={0}
                                        count8={0}/>;
        }
        return result;
    }

    showDowntimeShiftTable(dataArray) {
        let result = '';
        let currentShift = this.specifyCurrentShift(dataArray);
        let shift1 = this.showDowntimeShiftItem(dataArray, 1);
        /*let shift2 = this.showDowntimeShiftItem(dataArray, 2);
        let shift3 = this.showDowntimeShiftItem(dataArray, 3);
        if (currentShift == 1) {
            result = <tbody>{shift2}{shift3}{shift1}</tbody>;
        } else if (currentShift == 2) {
            result = <tbody>{shift1}{shift3}{shift2}</tbody>;
        } else if (currentShift == 3) {
            result = <tbody>{shift1}{shift2}{shift3}</tbody>;
        }*/
        result = <tbody>{shift1}</tbody>;
        return result;
    }

    render() {
        let {dataArray} = this.state;
        return (
            <div>
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
