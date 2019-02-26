import React, {Component} from 'react'
import {ButtonDropdown, ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import Singleton from "../../../../services/Socket";
import {LOCAL_IP_TEMP_TREND, ROLES} from "../../../../constants/constants";
import API from "../../../../services/api";
import TemperatureTrendItem from "./components/TemperatureTrendItem";


export default class TemperatureTrend extends Component {

    constructor(props) {
        super(props);
        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        this.state = {
            dropdownOpen: false,
            dataArray: "",
            tempTime: 30, //choosen time for temperature
        }
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
    };


    showTemperatureTrendTable = () => {
        let result = (<div className="row" key={'2'}>
            <div className="col-6">
                <TemperatureTrendItem stationId={1}/>
                <TemperatureTrendItem stationId={2}/>
                <TemperatureTrendItem stationId={3}/>
                <TemperatureTrendItem stationId={4}/>
            </div>
            <div className="col-6">
                <TemperatureTrendItem stationId={5}/>
                <TemperatureTrendItem stationId={6}/>
                <TemperatureTrendItem stationId={7}/>
                <TemperatureTrendItem stationId={8}/>
            </div>
        </div>);
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
    };

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
                    </div>
                </div>
                {this.showTemperatureTrendTable()}
            </div>
        )
    }
}
