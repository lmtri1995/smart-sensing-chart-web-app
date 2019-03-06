import React, {Component} from 'react'
import {ButtonDropdown, ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import TemperatureTrendTable from './components/TemperatureTrendTable';
import TemperatureTrendItem from './components/TemperatureTrendItem';
import Singleton from "../../../../services/Socket";
import {LOCAL_IP_TEMP_TREND, ROLES} from "../../../../constants/constants";
import {config} from "../../../../constants/config";


export default class TemperatureTrend extends Component {

    static socket = null;
    static pushInterval = null;
    static getInverval = null;
    static loginData = null;
    static role = null;
    static localTempArrayName = null;
    static emitEvent = 'temp_trend';

    constructor(props) {
        super(props);

        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        //Specify which array in local storage to push data to and get data from
        this.localTempArrayName = LOCAL_IP_TEMP_TREND.IP_TEMP_TREND_ARRAY;
        switch (this.role) {
            case ROLES.ROLE_ADMIN:
                this.localTempArrayName = LOCAL_IP_TEMP_TREND.IP_TEMP_TREND_ARRAY;
                break;
            case ROLES.ROLE_IP:
                this.localTempArrayName = LOCAL_IP_TEMP_TREND.IP_TEMP_TREND_ARRAY;
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
        };

        switch (this.role) {
            case 'admin':
                this.emitEvent = 'temp_trend';
                break;
            case 'ip':
                this.emitEvent = 'temp_trend';
                break;
            case 'os':
                this.emitEvent = 'os_temp_trend';
                break;
        }
    }

    /*componentWillUnmount() {
        //Clear 2 intervals
        if (this.pushInterval) {
            console.log("clear push interval");
            clearInterval(this.pushInterval);
        }
        if (this.getInverval) {
            console.log("clear push interval");
            clearInterval(this.getInverval);
        }

        //Clear emit: chart_temp_trend
        console.log("clear on chart_temp_trend");
        this.socket.emit(this.emitEvent, {
            msg: {
                event: 'chart_temp_trend',
                minute: 0,
                status: 'stop'
            }
        });
    }*/

    pushToStock = (returnArray) => {
        if (returnArray && +returnArray.total > 0) {
            let capacity = LOCAL_IP_TEMP_TREND.IP_TEMP_STOCK_CAPACITY;//capacity of IP, OS
            let stock = JSON.parse(localStorage.getItem(this.localTempArrayName));
            let total = returnArray.total;
            //returnArray.data =
            // returnArray.data.concat(returnArray.data).concat(returnArray.data);////////////
            //returnArray.total = returnArray.total *3;//////////////
            if (stock) {
                total = returnArray.total + stock.length;
            }

            //returnArray.total > stock
            if (returnArray.total >= capacity) {
                console.log("case 1: return array length > capacity");
                localStorage.setItem(this.localTempArrayName,
                    JSON.stringify(returnArray.data.slice(0, capacity)));
            } else if (total > capacity) {
                console.log("case 2: total of return array and existing stock > capacity");
                let diff = total - capacity;
                if (stock) {
                    stock = stock.slice(0, stock.length - diff);
                    //stock = stock.concat(returnArray.data);
                    //add return array to the head of the stock
                    stock = returnArray.data.concat(stock);
                } else {
                    stock = returnArray.data;
                }
                localStorage.setItem(this.localTempArrayName, JSON.stringify(stock));
            } else {//total < capacity
                console.log("case 3: total of return array and existing stock <= capacity");
                if (stock) {
                    //stock = stock.concat(returnArray.data);
                    //add return array to the head of the stock
                    stock = returnArray.data.concat(stock);
                } else {
                    stock = returnArray.data;
                }
                //localStorage.setItem(this.localTempArrayName, JSON.stringify(stock));
                try {
                    localStorage.setItem(this.localTempArrayName, JSON.stringify(stock));
                } catch (exception) {
                    console.log("quota exceeded");
                }

            }
        }
    };

    showDataToGrid = (quantity) => {
        let stock = JSON.parse(localStorage.getItem(this.localTempArrayName));
        let dataToShow = [];
        //Get data from Stock
        if (stock && stock.length > 0) {
            let stockLength = stock.length;
            if (stockLength >= quantity) {
                dataToShow = stock.slice(stockLength - quantity, stockLength);
                stock = stock.slice(0, stockLength - quantity);
            } else {
                dataToShow = stock.slice(0, stockLength);
                stock = [];
            }
            localStorage.setItem(this.localTempArrayName, JSON.stringify(stock));
        } else {
            console.log("Stock is empty");
        }


        //Show data to Grid
        if (dataToShow.length > 0) {
            console.log("dataToShow: ", dataToShow);
            let temp11 = [], temp12 = [], temp13 = [], temp14 = [], temp15 = [],
                temp16 = [],
                temp17 = [], temp18 = [];
            let temp21 = [], temp22 = [], temp23 = [], temp24 = [], temp25 = [],
                temp26 = [],
                temp27 = [], temp28 = [];
            let temp31 = [], temp32 = [], temp33 = [], temp34 = [], temp35 = [],
                temp36 = [],
                temp37 = [], temp38 = [];
            let temp41 = [], temp42 = [], temp43 = [], temp44 = [], temp45 = [],
                temp46 = [],
                temp47 = [], temp48 = [];
            let temp51 = [], temp52 = [], temp53 = [], temp54 = [], temp55 = [],
                temp56 = [],
                temp57 = [], temp58 = [];
            let temp61 = [], temp62 = [], temp63 = [], temp64 = [], temp65 = [],
                temp66 = [],
                temp67 = [], temp68 = [];
            let temp71 = [], temp72 = [], temp73 = [], temp74 = [], temp75 = [],
                temp76 = [],
                temp77 = [], temp78 = [];
            let temp81 = [], temp82 = [], temp83 = [], temp84 = [], temp85 = [],
                temp86 = [],
                temp87 = [], temp88 = [];
            let dataArray = Array(config.NUMBER_OF_STATION),
                noOfStations = config.NUMBER_OF_STATION;
            for (let i = 1; i <= noOfStations; i++) {
                dataArray[i] = [];
            }
            dataToShow.forEach(item => {
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

        }
    };

    componentDidMount() {
        /*let loginData = JSON.parse(localStorage.getItem('logindata'));
        let token = loginData.token;
        let socket = Singleton.getInstance(token);*/

            //////////////test
        /*let {tempTime, stationIdNo} = this.props;
        this.socket.emit('os_temp_trend', {
            msg: {
                event: 'chart_temp_trend',
                minute: 30,
                status: 'start',
                idStation:'1'
            }
        });

        //Show data to grid for the first time after GUI rendered
        let quantity = LOCAL_IP_TEMP_TREND.IP_TEMP_ITEM_TO_GET;
        //this.showDataToGrid(quantity);

        this.socket.on('chart_temp_trend', (data) => {
            console.log("data raw: ", data);
            let returnArray = JSON.parse(data);
            console.log("=====================================");
            console.log("=====================================");console.log("=====================================");
            console.log("=====================================");
            console.log("station: ", stationIdNo, "data: ", returnArray);
            let timeSpacePushToStock = LOCAL_IP_TEMP_TREND.IP_TEMP_TIME_SPACE_PUSH_TO_STOCK;
            let timeSpaceFromStock = LOCAL_IP_TEMP_TREND.IP_TEMP_TIME_SPACE_GET_FROM_STOCK;

            //this.getInverval = setInterval(this.showDataToGrid(quantity), timeSpaceFromStock);
            //this.pushInterval = setInterval(this.pushToStock(returnArray), timeSpacePushToStock);

        });*/

        ///end test
        /*let {tempTime} = this.state;
        this.socket.emit(this.emitEvent, {
            msg: {
                event: 'chart_temp_trend',
                minute: tempTime,
                status: 'start'
            }
        });

        //Show data to grid for the first time after GUI rendered
        let quantity = LOCAL_IP_TEMP_TREND.IP_TEMP_ITEM_TO_GET;
        this.showDataToGrid(quantity);

        this.socket.on('chart_temp_trend', (data) => {
            console.log("data: ", data);
            let returnArray = JSON.parse(data);
            let timeSpacePushToStock = LOCAL_IP_TEMP_TREND.IP_TEMP_TIME_SPACE_PUSH_TO_STOCK;
            let timeSpaceFromStock = LOCAL_IP_TEMP_TREND.IP_TEMP_TIME_SPACE_GET_FROM_STOCK;

            this.getInverval = setInterval(this.showDataToGrid(quantity), timeSpaceFromStock);
            this.pushInterval = setInterval(this.pushToStock(returnArray), timeSpacePushToStock);

        });

        /!*socket.on('token', (data) => {
            let tokenObject = JSON.parse(data);
            if (!tokenObject.success) {
                console.log('Token is expired');
                window.location.href = ("/logout");
            }
        });*!/*/

    }

    toggle() {
        this.setState({dropdownOpen: !this.state.dropdownOpen})
    }


    changeTempTime = (event) => {
        /*let loginData = JSON.parse(localStorage.getItem('logindata'));
        let token = loginData.token;
        let socket = Singleton.getInstance(token);*/
        let currentTempTime = parseInt(event.currentTarget.getAttribute("dropdownvalue"));

        this.setState({
            tempTime: currentTempTime,
        });
    };


    showTempTable = (dataArray) => {
        let result = (<div className="row" key={'2'}>
            <div className="col-6">
                <TemperatureTrendItem stationIdNo={1} tempTime={this.state.tempTime}/>
                <TemperatureTrendItem stationIdNo={2} tempTime={this.state.tempTime}/>
                <TemperatureTrendItem stationIdNo={3} tempTime={this.state.tempTime}/>
                <TemperatureTrendItem stationIdNo={4} tempTime={this.state.tempTime}/>
            </div>
            <div className="col-6">
                <TemperatureTrendItem stationIdNo={5} tempTime={this.state.tempTime}/>
                <TemperatureTrendItem stationIdNo={6} tempTime={this.state.tempTime}/>
                <TemperatureTrendItem stationIdNo={7} tempTime={this.state.tempTime}/>
                <TemperatureTrendItem stationIdNo={8} tempTime={this.state.tempTime}/>
            </div>
        </div>);
        return result;
    };

    render() {
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
                        <h4 className="float-left">Temperature Trend</h4>
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
                {this.showTempTable()}
            </div>
        )
    }
}
