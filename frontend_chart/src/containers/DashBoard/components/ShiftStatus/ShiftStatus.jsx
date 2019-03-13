import React, {Component} from 'react'
import ShiftStatusItem from './components/ShiftStatusItem';
import moment from "moment";
import Singleton from "../../../../services/Socket";
import {ClipLoader} from 'react-spinners';
import {specifyCurrentShift} from "../../../../shared/utils/Utilities";

const override = `
    position: absolute;
    display:block;
    left:45%;
    top :25%;
    z-index: 100000;
`;
export default class ShiftStatus extends Component {

    constructor(props) {
        super(props);

        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        this.state = {
            dataArray: "",
            loading: true
        };

        switch (this.role) {
            case 'admin':
                console.log("admin");
                this.emitEvent = 'os_shift_status';
                this.eventListen = 'sna_' + this.emitEvent;
                break;
            case 'ip':
                console.log("ip");
                this.emitEvent = 'ip_shift_status';
                this.listenEvent = 'sna_' + this.emitEvent;
                break;
            case 'os':
                console.log("os");
                this.emitEvent = 'os_shift_status';
                this.listenEvent = 'sna_' + this.emitEvent;
                break;
            default:
                console.log("default");
                this.emitEvent = 'os_shift_status';
                this.listenEvent = 'sna_' + this.emitEvent;
                break;
        }
        console.log("ip");
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.listenEvent,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
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

        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.listenEvent,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                status: 'start'
            }
        });

        this.socket.on(this.listenEvent, (data) => {
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

        /*this.socket.on('token', (data) => {
            let tokenObject = JSON.parse(data);
            if (!tokenObject.success) {
                console.log('Token is expired');
                window.location.href = (ROUTE.Logout);
            }
        });*/

    }

    showShiftItem(dataArray, shiftNo, currentShift) {
        let result = "";
        if (dataArray.length > 7) {
            if (shiftNo == 1) {
                let total = 0;
                for (let i = 0; i < 8; i++) {
                    total += parseInt(dataArray[i].first_shift);
                }
                result = <ShiftStatusItem currentShift={currentShift}
                                          shiftNo={shiftNo} total={total}
                                          count1={dataArray[0].first_shift}
                                          count2={dataArray[1].first_shift}
                                          count3={dataArray[2].first_shift}
                                          count4={dataArray[3].first_shift}
                                          count5={dataArray[4].first_shift}
                                          count6={dataArray[5].first_shift}
                                          count7={dataArray[6].first_shift}
                                          count8={dataArray[7].first_shift}
                />
            } else if (shiftNo == 2) {
                let total = 0;
                for (let i = 0; i < 8; i++) {
                    total += parseInt(dataArray[i].second_shift);
                }
                result = <ShiftStatusItem currentShift={currentShift}
                                          shiftNo={shiftNo} total={total}
                                          count1={dataArray[0].second_shift}
                                          count2={dataArray[1].second_shift}
                                          count3={dataArray[2].second_shift}
                                          count4={dataArray[3].second_shift}
                                          count5={dataArray[4].second_shift}
                                          count6={dataArray[5].second_shift}
                                          count7={dataArray[6].second_shift}
                                          count8={dataArray[7].second_shift}
                />
            } else if (shiftNo == 3) {
                let total = 0;
                for (let i = 0; i < 8; i++) {
                    total += parseInt(dataArray[i].third_shift);
                }
                result = <ShiftStatusItem currentShift={currentShift}
                                          shiftNo={shiftNo} total={total}
                                          count1={dataArray[0].third_shift}
                                          count2={dataArray[1].third_shift}
                                          count3={dataArray[2].third_shift}
                                          count4={dataArray[3].third_shift}
                                          count5={dataArray[4].third_shift}
                                          count6={dataArray[5].third_shift}
                                          count7={dataArray[6].third_shift}
                                          count8={dataArray[7].third_shift}
                />
            }
        } else {
            result = <ShiftStatusItem currentShift={currentShift}
                                      shiftNo={shiftNo} total={0}
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

    showShiftTable(dataArray) {
        let result = '';
        let currentShift = specifyCurrentShift();
        let shift1 = this.showShiftItem(dataArray, 1, currentShift);
        let shift2 = this.showShiftItem(dataArray, 2, currentShift);
        let shift3 = this.showShiftItem(dataArray, 3, currentShift);
        if (currentShift == 1) {
            result = <tbody>{shift2}{shift3}{shift1}</tbody>;
        } else if (currentShift == 2) {
            result = <tbody>{shift3}{shift1}{shift2}</tbody>;
        } else {
            result = <tbody>{shift1}{shift2}{shift3}</tbody>;
        }
        return result;
    };


    render() {
        let dataArray = this.state.dataArray;
        if (dataArray && dataArray.length > 0 && this.state.loading === true) {
            this.setState({loading: false})
        }
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
                <div className={(this.state.loading) ? "loader" : ""}>
                    <table className="table table-bordered table-dark">
                        <thead>
                        <tr>
                            <th scope="col">Shifts' Status</th>
                            <th scope="col"> 1</th>
                            <th scope="col"> 2</th>
                            <th scope="col"> 3</th>
                            <th scope="col"> 4</th>
                            <th scope="col"> 5</th>
                            <th scope="col"> 6</th>
                            <th scope="col"> 7</th>
                            <th scope="col"> 8</th>
                            <th scope="col"> Total</th>
                        </tr>
                        </thead>
                        {this.showShiftTable(dataArray)}
                    </table>
                </div>
            </div>

        )
    }
}
