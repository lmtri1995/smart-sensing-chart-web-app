import React, {Component} from 'react'
import Singleton from "../../../../services/Socket";
import TemperatureTrendItem from "./components/TemperatureTrendItem";
import {
    ANALYSIS_TEMPERATURE_TREND_ITEM_STATION_1_2_ID,
    ANALYSIS_TEMPERATURE_TREND_ITEM_STATION_3_4_ID,
    ANALYSIS_TEMPERATURE_TREND_ITEM_STATION_5_6_ID,
    ANALYSIS_TEMPERATURE_TREND_ITEM_STATION_7_8_ID, LOCAL_IP_TEMP_TREND, ROLES
} from "../../../../constants/constants";


export default class TemperatureTrend extends Component {

    constructor(props) {
        super(props);
        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        switch (this.role) {
            case ROLES.ROLE_ADMIN:
                this.localTempArrayName = LOCAL_IP_TEMP_TREND.IP_TEMP_TREND_ARRAY;
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#F575F7", "#8C67F6"];
                this.labelArray = ["Time", "Actual Top Temp", "Actual Mid Temp", "Actual Bottom" +
                " Temp", "Setting Top Temp", "Setting Mid Temp", "Setting Bottom Temp"];
                break;
            case ROLES.ROLE_IP:
                this.localTempArrayName = LOCAL_IP_TEMP_TREND.IP_TEMP_TREND_ARRAY;
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#F575F7", "#8C67F6", "#449AFF", "#46D6EA"];
                this.labelArray = ["Time", "Actual L.Top Temp", "Actual L.Bottom Temp", "Actual R.Top Temp", "Acutal R.Bottom Temp", "Setting L.Top Temp", "Setting L.Bottom Temp", "Setting R.Top Temp", "Setting R.Bottom Temp"];
                break;
            case ROLES.ROLE_OS:
                this.localTempArrayName = LOCAL_IP_TEMP_TREND.OS_TEMP_TREND_ARRAY;
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#F575F7", "#8C67F6"];
                this.labelArray = ["Time", "Actual Top Temp", "Actual Mid Temp", "Actual Bottom" +
                " Temp", "Setting Top Temp", "Setting Mid Temp", "Setting Bottom Temp"];
                break;
        }

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
        let result = (
            <div>
                <div id={ANALYSIS_TEMPERATURE_TREND_ITEM_STATION_1_2_ID} className="row" key={'2'}>
                    <div className="col-6">
                        <TemperatureTrendItem stationId={1}/>
                    </div>
                    <div className="col-6">
                        <TemperatureTrendItem stationId={2}/>
                    </div>
                </div>
                <div id={ANALYSIS_TEMPERATURE_TREND_ITEM_STATION_3_4_ID} className="row" key={'3'}>
                    <div className="col-6">
                        <TemperatureTrendItem stationId={3}/>
                    </div>
                    <div className="col-6">
                        <TemperatureTrendItem stationId={4}/>
                    </div>
                </div>
                <div id={ANALYSIS_TEMPERATURE_TREND_ITEM_STATION_5_6_ID} className="row" key={'4'}>
                    <div className="col-6">
                        <TemperatureTrendItem stationId={5}/>
                    </div>
                    <div className="col-6">
                        <TemperatureTrendItem stationId={6}/>
                    </div>
                </div>
                <div id={ANALYSIS_TEMPERATURE_TREND_ITEM_STATION_7_8_ID} className="row" key={'5'}>
                    <div className="col-6">
                        <TemperatureTrendItem stationId={7}/>
                    </div>
                    <div className="col-6">
                        <TemperatureTrendItem stationId={8}/>
                    </div>
                </div>
            </div>
        );
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

    drawLegend = () => {
        let legendValue = "<div class='legend-container' style='margin: 40px 200px 40px'>";
        for (let i = 0; i < this.colorArray.length; i++){
            let color = this.colorArray[i];
            let label = this.labelArray[i+1];
            legendValue += "<div id='lengendLabel' class='legend-box'" +
                " style='background-color: " + color + ";'></div>";
            legendValue += "<div class='temperature-legend'>" + label + "</div> &nbsp; &nbsp; ";
        }
        legendValue += "</div>";
        document.getElementById("lengendLabel").innerHTML = legendValue;
    }

    componentDidMount() {
        this.drawLegend();
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
                        <h4 className="float-left">Temperature Trend</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div tyle={{position: 'absolute'}} id={'lengendLabel'}> </div>
                    </div>
                </div>
                {this.showTemperatureTrendTable()}
            </div>
        )
    }
}
