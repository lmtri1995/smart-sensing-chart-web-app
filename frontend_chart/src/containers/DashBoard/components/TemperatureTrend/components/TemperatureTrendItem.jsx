import React, {Component} from 'react'
import LineChart from "./TemperatureTrendLine";
import Singleton from "../../../../../services/Socket";
import {LOCAL_IP_TEMP_TREND, ROLES} from "../../../../../constants/constants";
import Dygraph from "dygraphs/src/dygraph";
import moment from "moment";

export default class TemperatureTrendItem extends Component {
    /*static socket = null;
    static pushInterval = null;
    static getInverval = null;
    static loginData = null;
    static role = null;
    static localTempArrayName = null;
    static emitEvent = 'temp_trend_1';
    static preTempTime = 30;*/

    constructor(props) {
        super(props);

        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);
        this.preTempTime = 30;

        let {stationIdNo} = this.props;
        switch(this.role) {
            case 'admin':
                this.emitEvent = `os_temp_trend_${stationIdNo}`;
                this.eventListen = `os_chart_temp_trend_${stationIdNo}`;
                this.colorArray = ["#71D7BE", "#F89D9D", "#FF9C64", "#EB6A91", "#F575F7", "#8C67F6"];
                this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2", "tempB3"];
                break;
            case 'ip':
                this.emitEvent = `ip_temp_trend_${stationIdNo}`;
                this.eventListen = `ip_chart_temp_trend_${stationIdNo}`;
                this.colorArray = ["#71D7BE", "#F89D9D", "#FF9C64", "#EB6A91", "#F575F7", "#8C67F6", "#449AFF", "#46D6EA"];
                this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempA4", "tempB1", "tempB2", "tempB3", "tempB4"];
                break;
            case 'os':
                this.emitEvent = `os_temp_trend_${stationIdNo}`;
                this.eventListen = `os_chart_temp_trend_${stationIdNo}`;
                this.colorArray = ["#71D7BE", "#F89D9D", "#FF9C64", "#EB6A91", "#F575F7", "#8C67F6"];
                this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2", "tempB3"];
                break;
            default:
                this.emitEvent = `os_temp_trend_${stationIdNo}`;
                this.eventListen = `os_chart_temp_trend_${stationIdNo}`;
                this.colorArray = ["#71D7BE", "#F89D9D", "#FF9C64", "#EB6A91", "#F575F7", "#8C67F6"];
                this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2", "tempB3"];
        }
    }

    componentWillUnmount(){
        let {stationIdNo} = this.props;
        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                minute: this.preTempTime,
                status: 'stop',
                idStation:stationIdNo
            }
        });
    }

    componentDidUpdate(){
        let {tempTime, stationIdNo} = this.props;

        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                minute: this.preTempTime,
                status: 'stop',
                idStation:stationIdNo
            }
        });

        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                minute: tempTime,
                status: 'start',
                idStation:`${stationIdNo}`
            }
        });
        this.preTempTime = tempTime;
    }

    componentDidMount() {

        let {tempTime, stationIdNo} = this.props;
        this.preTempTime = tempTime;
        let displayData = "X\n";
        let g = new Dygraph(
            document.getElementById(`station${stationIdNo}`),
            displayData,
            {
                // options go here. See http://dygraphs.com/options.html
                //https://stackoverflow.com/questions/20234787/in-dygraphs-how-to-display-axislabels-as-text-instead-of-numbers-date
                legend: 'always',
                animatedZooms: true,
                width: '100%',
                height: '65px',
                colors: this.colorArray,
                labels: this.labelArray,
                //legendFormatter,
                //labelsSeparateLines: true,
                axes : {
                    x: {
                        drawGrid: false,
                        valueFormatter: function(x) {
                            return moment.unix(x).format("YYYY/MM/DD hh:mm");;
                        },
                        axisLabelFormatter: function(x) {
                            return moment.unix(x).format("YYYY/MM/DD  hh:mm");
                        },
                    },
                    y: {
                        axisLineColor: '#464d54',
                        //drawAxis: false,
                    }
                }
            }
        );

        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                minute: this.preTempTime,
                //minute: -10,
                status: 'start',
                idStation:stationIdNo
            }
        });


        this.socket.on(this.eventListen, (response) => {
            response = JSON.parse(response);
            console.log("response: ", response);
            if (response.success){
                console.log("success");
                let returnArrayObject = response.data;
                let returnArray = JSON.parse(returnArrayObject[0].data);
                console.log("tempTime: ", tempTime, "stationID: ", stationIdNo);
                console.log("station: ", stationIdNo, "data: ", returnArray);
                //let timeSpacePushToStock = LOCAL_IP_TEMP_TREND.IP_TEMP_TIME_SPACE_PUSH_TO_STOCK;
                //let timeSpaceFromStock = LOCAL_IP_TEMP_TREND.IP_TEMP_TIME_SPACE_GET_FROM_STOCK;

                //this.getInverval = setInterval(this.showDataToGrid(quantity), timeSpaceFromStock);
                //this.pushInterval = setInterval(this.pushToStock(returnArray), timeSpacePushToStock);
                if (returnArray && returnArray.length > 0){

                    if (displayData === "X\n"){
                        console.log("display data is X");
                        displayData = returnArray;
                    } else {
                        console.log("display data different");
                        console.log("displayData: ", displayData);
                        console.log("returnArray: ", returnArray);
                        displayData = displayData.slice(returnArray.length, displayData.length);
                        console.log("display data after slice: ", displayData);
                        displayData.push(...returnArray);
                        console.log("displayData after updated: ", displayData);
                    }

                    g.updateOptions( { 'file': displayData } );
                }
            }

        });

        //Show data to grid for the first time after GUI rendered
        /*let quantity = LOCAL_IP_TEMP_TREND.IP_TEMP_ITEM_TO_GET;
        //this.showDataToGrid(quantity);

        this.socket.on('chart_temp_trend', (data) => {
            //console.log("data: ", data);
            let returnArray = JSON.parse(data);
            console.log("station: ", stationIdNo, "data: ", returnArray);
            let timeSpacePushToStock = LOCAL_IP_TEMP_TREND.IP_TEMP_TIME_SPACE_PUSH_TO_STOCK;
            let timeSpaceFromStock = LOCAL_IP_TEMP_TREND.IP_TEMP_TIME_SPACE_GET_FROM_STOCK;

            //this.getInverval = setInterval(this.showDataToGrid(quantity), timeSpaceFromStock);
            //this.pushInterval = setInterval(this.pushToStock(returnArray), timeSpacePushToStock);

        });*/

    };

    render() {
        let {stationIdNo} = this.props;
        return (
            <div className="col">
                <h4>STATION {stationIdNo}: USL/ Value/ LSL</h4>
                <div id={'station' + stationIdNo}></div>
            </div>
        );
    }
}
