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
                this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2", "tempB3"];
                break;
            case 'ip':
                this.emitEvent = `ip_temp_trend_${stationIdNo}`;
                this.eventListen = `ip_chart_temp_trend_${stationIdNo}`;
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#F575F7", "#8C67F6", "#449AFF", "#46D6EA"];
                this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempA4", "tempB1", "tempB2", "tempB3", "tempB4"];
                break;
            case 'os':
                this.emitEvent = `os_temp_trend_${stationIdNo}`;
                this.eventListen = `os_chart_temp_trend_${stationIdNo}`;
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#F575F7", "#8C67F6"];
                this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2", "tempB3"];
                break;
            default:
                this.emitEvent = `os_temp_trend_${stationIdNo}`;
                this.eventListen = `os_chart_temp_trend_${stationIdNo}`;
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#F575F7", "#8C67F6"];
                this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2", "tempB3"];
        }

        this.state = {
            loading: true
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
        this.graph = new Dygraph(
            document.getElementById(`station${stationIdNo}`),
            displayData,
            {
                // options go here. See http://dygraphs.com/options.html
                //https://stackoverflow.com/questions/20234787/in-dygraphs-how-to-display-axislabels-as-text-instead-of-numbers-date
                showLabelsOnHighlight: false,
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
                            return moment.unix(x).format("YYYY/MM/DD hh:mm:ss");
                        },
                        axisLabelFormatter: function(x) {
                            return moment.unix(x).format("YYYY/MM/DD hh:mm:ss");
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

    refresh = () => {
        if (this.graph){
            this.graph.resetZoom();
        }
    }

    render() {
        let {stationIdNo} = this.props;
        return (
                <div className="col">
                    <div className="row">
                        <div className="col-11">
                            <h4 className="float-left">STATION {stationIdNo}: USL/ Value/ LSL</h4>
                        </div>
                        <div className="col-1">
                            <img className="float-right" src={Refresh} style={{width: '50%'}} onClick={this.refresh}/>
                        </div>
                        <div>
                            <ClipLoader
                                css={override}
                                sizeUnit={"px"}
                                size={100}
                                color={'#30D4A4'}
                                loading={this.state.loading}
                                margin-left={300}
                            />
                            <div className="container">
                                <div className="row">
                                    <div id={'station' + stationIdNo}  style={{marginBottom: 70}} ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
        );
    }
}
