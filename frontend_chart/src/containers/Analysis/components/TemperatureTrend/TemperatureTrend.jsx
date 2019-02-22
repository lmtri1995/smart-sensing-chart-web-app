import React, {Component} from 'react'
import {ButtonDropdown, ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import Singleton from "../../../../services/Socket";
import {LOCAL_IP_TEMP_TREND, ROLES} from "../../../../constants/constants";
import API from "../../../../services/api";
import TemperatureTrendItem from "./components/TemperatureTrendItem";


export default class TemperatureTrend extends Component {

    static socket = null;
    static pushInterval = null;
    static getInverval = null;
    static loginData = null;
    static role = null;
    static localTempArrayName = null;

    constructor(props) {
        super(props);
        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        //Specify which array in local storage to push data to and get data from
        this.localTempArrayName = LOCAL_IP_TEMP_TREND.OS_TEMP_TREND_ARRAY;
        switch (this.role) {
            case ROLES.ROLE_ADMIN:
                this.localTempArrayName = LOCAL_IP_TEMP_TREND.OS_TEMP_TREND_ARRAY;
                break;
            case ROLES.ROLE_IP:
                this.localTempArrayName = LOCAL_IP_TEMP_TREND.OS_TEMP_TREND_ARRAY;
                break;
            case ROLES.ROLE_OS:
                this.localTempArrayName = LOCAL_IP_TEMP_TREND.OS_TEMP_TREND_ARRAY;
                break;
        }

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false,
            dataArray: "",
            tempTime: 30, //choosen time for temperature
        }
    }


    componentDidMount() {
        let param = {
            idStation: 1,
            from_timedevice: 0,
            to_timedevice: 0,
            minute: 0,
        }
        API('api/os/tempTrend', 'POST', param)
            .then((response) => {
                console.log("response fsdafasdf: ", response);
                if (response.data.success) {
                    let dataArray = response.data.data;
                    let displayData = JSON.parse(dataArray[0].data);
                    /*this.setState({
                        dataArray: dataArray,
                    });*/
                }
            })
            .catch((err) => console.log('err:', err))

    }

    toggle() {
        this.setState({dropdownOpen: !this.state.dropdownOpen})
    }


    changeTempTime = (event) => {
        /*let loginData = JSON.parse(localStorage.getItem('logindata'));
        let token = loginData.token;
        let socket = Singleton.getInstance(token);*/
        let preTempTime = this.state.tempTime;
        let currentTempTime = parseInt(event.currentTarget.getAttribute("dropdownvalue"));

        /*let emitEvent = 'temp_trend';
        switch(this.role) {
            case 'admin':
                emitEvent = 'temp_trend';
                break;
            case 'ip':
                emitEvent = 'temp_trend';
                break;
            case 'os':
                emitEvent = 'os_temp_trend';
                break;
        }

        this.socket.emit(emitEvent, {
            msg: {
                event: 'chart_temp_trend',
                minute: preTempTime,
                status: 'stop'
            }
        });

        this.socket.emit(emitEvent, {
            msg: {
                event: 'chart_temp_trend',
                minute: currentTempTime,
                status: 'start'
            }
        });*/
        this.setState({
            tempTime: currentTempTime,
        });
    }


    showTemperatureTrendTable = () => {
        let result = (<div className="row" key={'2'}>
            <div className="col">
                <TemperatureTrendItem stationId={1}/>
                <TemperatureTrendItem stationId={2}/>
                <TemperatureTrendItem stationId={3}/>
                <TemperatureTrendItem stationId={4}/>
            </div>
            <div className="col">
                <TemperatureTrendItem stationId={5}/>
                <TemperatureTrendItem stationId={6}/>
                <TemperatureTrendItem stationId={7}/>
                <TemperatureTrendItem stationId={8}/>
            </div>
        </div>)
        /*for (let i = 1; i < 9; i++) {
            this["tempItem" + i] = <TemperatureTrendItem tempData=""/>;
            let param = {
                idStation: i,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
            }
            API('api/os/tempTrend', 'POST', param)
                .then((response) => {
                    if (response.data.success) {
                        let dataArray = response.data.data;
                        let displayData = JSON.parse(dataArray[0].data);
                        console.log("station: ", i, " displayData: ", displayData);
                        this["tempItem" + i] = <TemperatureTrendItem tempData={displayData}/>
                    }
                })
                .catch((err) => console.log('err:', err))
        }*/
        /*result = <div className="row" key={'1'}>
            <div className="col">
                <TemperatureTrendItem tempData={this.tempItem1}  stationId={1}/>
                <TemperatureTrendItem tempData={this.tempItem2}  stationId={2}/>
                <TemperatureTrendItem tempData={this.tempItem3}  stationId={3}/>
                <TemperatureTrendItem tempData={this.tempItem4}  stationId={4}/>
            </div>
            <div className="col">
                <TemperatureTrendItem tempData={this.tempItem5}  stationId={5}/>
                <TemperatureTrendItem tempData={this.tempItem6}  stationId={6}/>
                <TemperatureTrendItem tempData={this.tempItem7}  stationId={7}/>
                <TemperatureTrendItem tempData={this.tempItem8}  stationId={8}/>
            </div>
        </div>*/

        return result;
    }

    render() {
        this.showTemperatureTrendTable();
        let {dataArray} = this.state;
        let choosenTime = '30 Minutes';
        if (this.state.tempTime == 60) {
            choosenTime = '1 Hour';
        } else if (this.state.tempTime == 180) {
            choosenTime = '3 Hours'
        }
        //console.log("dataArray", dataArray);
        //this.pushToStock(dataArray);
        return (
            <div className="temperature">
                <div className="row">
                    <div className="col">
                        <h4 className="float-left">temperature Trend</h4>
                        <ButtonGroup className="float-right">
                            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                <DropdownToggle caret>
                                    Monitoring Time: {choosenTime}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={this.changeTempTime} dropdownvalue="30">30
                                        Minutes</DropdownItem>
                                    <DropdownItem onClick={this.changeTempTime} dropdownvalue="60">1
                                        Hour</DropdownItem>
                                    <DropdownItem onClick={this.changeTempTime} dropdownvalue="180">3
                                        Hour</DropdownItem>
                                </DropdownMenu>
                            </ButtonDropdown>
                        </ButtonGroup>
                    </div>
                </div>
                {this.showTemperatureTrendTable()}
            </div>
        )
    }
}
