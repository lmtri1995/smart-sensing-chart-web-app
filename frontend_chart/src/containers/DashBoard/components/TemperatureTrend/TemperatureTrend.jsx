import React, {Component} from 'react'
import {ButtonDropdown, ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import TemperatureTrendItem from './components/TemperatureTrendItem';
import Singleton from "../../../../services/Socket";

export default class TemperatureTrend extends Component {
    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false,
            dataArray: "",
            tempTime: 30, //choosen time for temperature
        }
    }

    componentDidMount() {
        let loginData = JSON.parse(localStorage.getItem('logindata'));
        let token = loginData.token;
        let socket = Singleton.getInstance(token);
        let {tempTime} = this.state;
        socket.emit('temp_trend', {
            msg: {
                event: 'chart_temp_trend',
                minute: tempTime,
                status: 'start'
            }
        });

        socket.on('chart_temp_trend', (data) => {
            let returnArray = JSON.parse(data);
            let returnData = returnArray.data;
            let temp11 = [], temp12 = [], temp13 = [], temp14 = [], temp15 = [], temp16 = [],
                temp17 = [], temp18 = [];
            let temp21 = [], temp22 = [], temp23 = [], temp24 = [], temp25 = [], temp26 = [],
                temp27 = [], temp28 = [];
            let temp31 = [], temp32 = [], temp33 = [], temp34 = [], temp35 = [], temp36 = [],
                temp37 = [], temp38 = [];
            let temp41 = [], temp42 = [], temp43 = [], temp44 = [], temp45 = [], temp46 = [],
                temp47 = [], temp48 = [];
            let temp51 = [], temp52 = [], temp53 = [], temp54 = [], temp55 = [], temp56 = [],
                temp57 = [], temp58 = [];
            let temp61 = [], temp62 = [], temp63 = [], temp64 = [], temp65 = [], temp66 = [],
                temp67 = [], temp68 = [];
            let temp71 = [], temp72 = [], temp73 = [], temp74 = [], temp75 = [], temp76 = [],
                temp77 = [], temp78 = [];
            let temp81 = [], temp82 = [], temp83 = [], temp84 = [], temp85 = [], temp86 = [],
                temp87 = [], temp88 = [];
            let dataArray = [], noOfStations = 8;
            for (let i = 1; i <= noOfStations; i++) {
                dataArray[i] = [];
            }

            if (returnData.length > 0) {
                returnData.forEach(item => {
                    switch (item.idStation) {
                        case "1":
                            temp11.push(item.TempA1);
                            temp12.push(item.TempA2);
                            temp13.push(item.TempA3);
                            temp14.push(item.TempA4);
                            temp15.push(item.TempB1);
                            temp16.push(item.TempB2);
                            temp17.push(item.TempB3);
                            temp18.push(item.TempB4);
                            break;
                        case "2":
                            temp21.push(item.TempA1);
                            temp22.push(item.TempA2);
                            temp23.push(item.TempA3);
                            temp24.push(item.TempA4);
                            temp25.push(item.TempB1);
                            temp26.push(item.TempB2);
                            temp27.push(item.TempB3);
                            temp28.push(item.TempB4);
                            break;
                        case "3":
                            temp31.push(item.TempA1);
                            temp32.push(item.TempA2);
                            temp33.push(item.TempA3);
                            temp34.push(item.TempA4);
                            temp35.push(item.TempB1);
                            temp36.push(item.TempB2);
                            temp37.push(item.TempB3);
                            temp38.push(item.TempB4);
                            break;
                        case "4":
                            temp41.push(item.TempA1);
                            temp42.push(item.TempA2);
                            temp43.push(item.TempA3);
                            temp44.push(item.TempA4);
                            temp45.push(item.TempB1);
                            temp46.push(item.TempB2);
                            temp47.push(item.TempB3);
                            temp48.push(item.TempB4);
                            break;
                        case "5":
                            temp51.push(item.TempA1);
                            temp52.push(item.TempA2);
                            temp53.push(item.TempA3);
                            temp54.push(item.TempA4);
                            temp55.push(item.TempB1);
                            temp56.push(item.TempB2);
                            temp57.push(item.TempB3);
                            temp58.push(item.TempB4);
                            break;
                        case "6":
                            temp61.push(item.TempA1);
                            temp62.push(item.TempA2);
                            temp63.push(item.TempA3);
                            temp64.push(item.TempA4);
                            temp65.push(item.TempB1);
                            temp66.push(item.TempB2);
                            temp67.push(item.TempB3);
                            temp68.push(item.TempB4);
                            break;
                        case "7":
                            temp71.push(item.TempA1);
                            temp72.push(item.TempA2);
                            temp73.push(item.TempA3);
                            temp74.push(item.TempA4);
                            temp75.push(item.TempB1);
                            temp76.push(item.TempB2);
                            temp77.push(item.TempB3);
                            temp78.push(item.TempB4);
                            break;
                        case "8":
                            temp81.push(item.TempA1);
                            temp82.push(item.TempA2);
                            temp83.push(item.TempA3);
                            temp84.push(item.TempA4);
                            temp85.push(item.TempB1);
                            temp86.push(item.TempB2);
                            temp87.push(item.TempB3);
                            temp88.push(item.TempB4);
                            break;
                    }
                });
            }

            dataArray[1].push(temp11, temp12, temp13, temp14, temp15, temp16, temp17, temp18);
            dataArray[2].push(temp21, temp22, temp23, temp24, temp25, temp26, temp27, temp28);
            dataArray[3].push(temp31, temp32, temp33, temp34, temp35, temp36, temp37, temp38);
            dataArray[4].push(temp41, temp42, temp43, temp44, temp45, temp46, temp47, temp48);
            dataArray[5].push(temp51, temp52, temp53, temp54, temp55, temp56, temp57, temp58);
            dataArray[6].push(temp61, temp62, temp63, temp64, temp65, temp66, temp67, temp68);
            dataArray[7].push(temp71, temp72, temp73, temp74, temp75, temp76, temp77, temp78);
            dataArray[8].push(temp81, temp82, temp83, temp84, temp85, temp86, temp87, temp88);
            this.setState({
                dataArray: dataArray,
            });
        });

        socket.on('token', (data) => {
            let tokenObject = JSON.parse(data);
            if (!tokenObject.success) {
                console.log('Token is expired');
                window.location.href = ("/logout");
            }
        });

    }

    toggle() {
        this.setState({dropdownOpen: !this.state.dropdownOpen})
    }

    showTempTable(dataArray) {
        let result = <div className="row">
            <div className="col">
                <TemperatureTrendItem/>
                <TemperatureTrendItem/>
                <TemperatureTrendItem/>
                <TemperatureTrendItem/>
            </div>
            <div className="col">
                <TemperatureTrendItem/>
                <TemperatureTrendItem/>
                <TemperatureTrendItem/>
                <TemperatureTrendItem/>
            </div>
        </div>
        if (dataArray && dataArray.length > 0) {
            result = <div className="row">
                <div className="col">
                    <TemperatureTrendItem tempData={dataArray[1]}/>
                    <TemperatureTrendItem tempData={dataArray[2]}/>
                    <TemperatureTrendItem tempData={dataArray[3]}/>
                    <TemperatureTrendItem tempData={dataArray[4]}/>
                </div>
                <div className="col">
                    <TemperatureTrendItem tempData={dataArray[5]}/>
                    <TemperatureTrendItem tempData={dataArray[6]}/>
                    <TemperatureTrendItem tempData={dataArray[7]}/>
                    <TemperatureTrendItem tempData={dataArray[8]}/>
                </div>
            </div>
        }
        return result;
    }

    changeTempTime = (event) => {
        let loginData = JSON.parse(localStorage.getItem('logindata'));
        let token = loginData.token;
        let socket = Singleton.getInstance(token);
        let preTempTime = this.state.tempTime;
        let currentTempTime = parseInt(event.currentTarget.getAttribute("dropdownvalue"));
        socket.emit('temp_trend', {
            msg: {
                event: 'chart_temp_trend',
                minute: preTempTime,
                status: 'stop'
            }
        });

        socket.emit('temp_trend', {
            msg: {
                event: 'chart_temp_trend',
                minute: currentTempTime,
                status: 'start'
            }
        });
        this.setState({
            tempTime: currentTempTime,
        });
    }


    render() {
        let {dataArray} = this.state;
        let choosenTime = '30 Minutes';
        if (this.state.tempTime == 60) {
            choosenTime = '1 Hour';
        } else if (this.state.tempTime == 180) {
            choosenTime = '3 Hours'
        }
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
                {this.showTempTable(dataArray)}
            </div>
        )
    }
}
