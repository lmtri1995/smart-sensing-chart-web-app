import React, {Component} from 'react'
import Singleton from "../../../../../services/Socket";
import Dygraph from "dygraphs/src/dygraph";
import moment from "moment";
import Refresh from "../../../../../shared/img/Refresh.svg";
import {ClipLoader} from "react-spinners";

const override = `
    position: absolute;
    display:block;
    left:45%;
    top: 25%;
    z-index: 100000;
`;

export default class TemperatureTrendItem extends Component {
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
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#F575F7", "#8C67F6"];
                this.labelArray = ["Time", "Actual Top Temp", "Actual Mid Temp", "Actual Bottom" +
                " Temp", "Setting Top Temp", "Setting Mid Temp", "Setting Bottom Temp"];
                //this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1",
                // "tempB2","tempB3"];
                break;
            case 'ip':
                this.emitEvent = `ip_temp_trend_${stationIdNo}`;
                this.eventListen = `ip_chart_temp_trend_${stationIdNo}`;
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#F575F7", "#8C67F6", "#449AFF", "#46D6EA"];
                this.labelArray = ["Time", "Actual L.Top Temp", "Actual L.Bottom Temp", "Actual R.Top Temp", "Acutal R.Bottom Temp", "Setting L.Top Temp", "Setting L.Bottom Temp", "Setting R.Top Temp", "Setting R.Bottom Temp"];
                break;
            case 'os':
                this.emitEvent = `os_temp_trend_${stationIdNo}`;
                this.eventListen = `os_chart_temp_trend_${stationIdNo}`;
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#F575F7", "#8C67F6"];
                //this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1",
                // "tempB2","tempB3"];
                this.labelArray = ["Time", "Actual Top Temp", "Actual Mid Temp", "Actual Bottom Temp", "Setting Top Temp", "Setting Mid Temp", "Setting Bottom Temp"];
                break;
            default:
                this.emitEvent = `os_temp_trend_${stationIdNo}`;
                this.eventListen = `os_chart_temp_trend_${stationIdNo}`;
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#F575F7", "#8C67F6"];
                //this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1",
                // "tempB2","tempB3"];
                this.labelArray = ["Time", "Actual Top Temp", "Actual Mid Temp", "Actual Bottom Temp", "Setting Top Temp", "Setting Mid Temp", "Setting Bottom Temp"];
        }

        let parentLoading = this.props.loading;
        this.state = {
            loading: parentLoading
        };
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

    componentDidUpdate(prevProps, prevState, snapshot){
        let currentTime = this.preTempTime;
        let newTime = this.props.tempTime;
        if (currentTime !== newTime) {
            let {tempTime, stationIdNo, parentLoading} = this.props;

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
            this.setState({
                loading: parentLoading
            });
        }
    }

    legendFormatter = (data)=>{
        let stationId = this.props.stationIdNo;
        let text = '';
        if (data.xHTML){
            text = data.xHTML + "<br/>";
        }
        let series = data.series;
        let numberOfTemp = this.colorArray.length;
        for (let i = 0; i < numberOfTemp; i++){
            if (series[i].y){
                text += "<span style='color:   " + series[i].color +";'>" + series[i].label + ": </span>" + series[i].y + "&nbsp; &nbsp; &nbsp;";
            }
            if (i == (numberOfTemp/2 - 1)){
                text += "<br/>";
            }
        }

        if (document.getElementById("tooltip" + stationId)){
            document.getElementById("tooltip" + stationId).innerHTML = text;
        }

        let html = "";
        return html;
    }

    drawLegend = () => {
        let stationId = this.props.stationIdNo;
        let legendValue = "<div class='legend-container'>";
        for (let i = 0; i < this.colorArray.length; i++){
            let color = this.colorArray[i];
            let label = this.labelArray[i+1];
            legendValue += "<div id='"+ label + stationId +"' class='legend-box'" +
                " style='background-color: " + color + ";'></div>";
            legendValue += "<div class='temperature-legend'>" + label + "</div> &nbsp; &nbsp; ";
        }
        legendValue += "</div>";
        document.getElementById("lengendLabel" + stationId).innerHTML = legendValue;
    }

    componentDidMount() {
        //this.drawLegend();

        let {tempTime, stationIdNo} = this.props;
        this.preTempTime = tempTime;
        let displayData = "X\n";
        this.graph = new Dygraph(
            document.getElementById(`station${stationIdNo}`),
            displayData,
            {
                // options go here. See http://dygraphs.com/options.html
                //https://stackoverflow.com/questions/20234787/in-dygraphs-how-to-display-axislabels-as-text-instead-of-numbers-date
                showLabelsOnHighlight: true,
                animatedZooms: true,
                width: 590,
                height: 300,
                colors: this.colorArray,
                labels: this.labelArray,
                //legendFormatter,
                //labelsSeparateLines: true,
                axes : {
                    x: {
                        drawGrid: false,
                        valueFormatter: function(x) {
                            return moment.unix(x).format("DD/MM/YYYY HH:mm:ss");
                        },
                        axisLabelFormatter: function(x) {
                            return moment.unix(x).format("DD/MM/YYYY HH:mm:ss");
                        },
                    },
                    y: {
                        axisLineColor: '#464d54',
                        //drawAxis: false,
                    }
                },
                legendFormatter: this.legendFormatter,
                labelsShowZeroValues: false
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
            if (response.success){
                let returnArrayObject = response.data;
                let returnArray = JSON.parse(returnArrayObject[0].data);
                if (returnArray && returnArray.length > 0){
                    if (displayData === "X\n"){
                        displayData = returnArray;
                    } else {
                        displayData = displayData.slice(returnArray.length, displayData.length);
                        displayData.push(...returnArray);
                    }
                    this.graph.updateOptions( { 'file': displayData } );
                    this.setState({loading: false});
                }
            }

        });
    };

    refresh = () => {
        if (this.graph){
            this.graph.resetZoom();
        }
    }

    render() {
        let stationId = this.props.stationIdNo;
        return (
                <div className="col">
                    <div className="row" style={{marginTop: 30}}>
                        <div className="col-11">
                            <h4 className="float-left">STATION {stationId}: USL/ Value/ LSL</h4>
                        </div>
                        <div className="col-1">
                            <img className="float-right" src={Refresh} style={{width: '50%'}} onClick={this.refresh}/>
                        </div>
                    </div>
                    <div className="row">
                        <ClipLoader
                            css={override}
                            sizeUnit={"px"}
                            size={100}
                            color={'#30D4A4'}
                            loading={this.state.loading}
                            margin-left={300}
                        />
                        <div className="container" style={{marginBottom: 40}}>
                            <div className="row">
                                <div className="temperature-tooltip" style={{position: 'absolute'}} id={'tooltip' + stationId}> </div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="row">
                                <div id={'station' + stationId}  style={{marginBottom: 50}} ></div>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}
