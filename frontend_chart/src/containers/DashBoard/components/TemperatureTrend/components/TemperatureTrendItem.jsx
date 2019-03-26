import React, {Component} from 'react'
import Singleton from "../../../../../services/Socket";
import Dygraph from "dygraphs/src/dygraph";
import moment from "moment";
import Refresh from "../../../../../shared/img/Refresh.svg";
import {ClipLoader} from "react-spinners";
import API from "../../../../../services/api";
import {specifyNminutesToCurrentTimeDevice} from "../../../../../shared/utils/Utilities";
import connect from "react-redux/es/connect/connect";

const override = `
    position: absolute;
    display:block;
    left:45%;
    top: 25%;
    z-index: 100000;
`;

class TemperatureTrendItem extends Component {
    constructor(props) {
        super(props);

        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);
        this.preTempTime = 30;
        this.selectedModelsByArticle = '';

        let {stationIdNo} = this.props;
        switch (this.role) {
            case 'admin':
                this.apiUrl = 'api/os/tempTrend';
                this.emitEvent = `os_temp_trend_${stationIdNo}`;
                this.eventListen = `os_chart_temp_trend_${stationIdNo}`;
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#F575F7", "#8C67F6"];
                this.labelArray = ["Time", "Actual Top Temp", "Actual Mid Temp", "Actual Bottom" +
                " Temp", "Setting Top Temp", "Setting Mid Temp", "Setting Bottom Temp"];
                //this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1",
                // "tempB2","tempB3"];
                this.seriesOptions = {
                    "Setting Top Temp": {
                        strokeWidth: 3
                    },
                    "Setting Mid Temp": {
                        strokeWidth: 3
                    },
                    "Setting Bottom Temp": {
                        strokeWidth: 3
                    }
                };
                break;
            case 'ip':
                this.apiUrl = 'api/ip/tempTrend';
                this.emitEvent = `ip_temp_trend_${stationIdNo}`;
                this.eventListen = `ip_chart_temp_trend_${stationIdNo}`;
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#F575F7", "#8C67F6", "#449AFF", "#46D6EA"];
                this.labelArray = ["Time", "Actual L.Top Temp", "Actual L.Bottom Temp", "Actual R.Top Temp", "Acutal R.Bottom Temp", "Setting L.Top Temp", "Setting L.Bottom Temp", "Setting R.Top Temp", "Setting R.Bottom Temp"];
                this.seriesOptions = {
                    "Setting L.Top Temp": {
                        strokeWidth: 3
                    },
                    "Setting L.Bottom Temp": {
                        strokeWidth: 3
                    },
                    "Setting R.Top Temp": {
                        strokeWidth: 3
                    },
                    "Setting R.Bottom Temp": {
                        strokeWidth: 3
                    },
                };
                break;
            case 'os':
                this.apiUrl = 'api/os/tempTrend';
                this.emitEvent = `os_temp_trend_${stationIdNo}`;
                this.eventListen = `os_chart_temp_trend_${stationIdNo}`;
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#F575F7", "#8C67F6"];
                //this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1",
                // "tempB2","tempB3"];
                this.labelArray = ["Time", "Actual Top Temp", "Actual Mid Temp", "Actual Bottom Temp", "Setting Top Temp", "Setting Mid Temp", "Setting Bottom Temp"];
                this.seriesOptions = {
                    "Setting Top Temp": {
                        strokeWidth: 3
                    },
                    "Setting Mid Temp": {
                        strokeWidth: 3
                    },
                    "Setting Bottom Temp": {
                        strokeWidth: 3
                    }
                };
                break;
            default:
                this.apiUrl = 'api/os/tempTrend';
                this.emitEvent = `os_temp_trend_${stationIdNo}`;
                this.eventListen = `os_chart_temp_trend_${stationIdNo}`;
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#F575F7", "#8C67F6"];
                //this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1",
                // "tempB2","tempB3"];
                this.seriesOptions = {
                    "Setting Top Temp": {
                        strokeWidth: 3
                    },
                    "Setting Mid Temp": {
                        strokeWidth: 3
                    },
                    "Setting Bottom Temp": {
                        strokeWidth: 3
                    }
                };
                this.labelArray = ["Time", "Actual Top Temp", "Actual Mid Temp", "Actual Bottom Temp", "Setting Top Temp", "Setting Mid Temp", "Setting Bottom Temp"];
        }
        this.state = {
            loading: true
        };
    }

    componentWillUnmount() {
        let {stationIdNo} = this.props;
        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                minute: this.preTempTime,
                status: 'stop',
                idStation: stationIdNo,
                modelname: this.selectedModelsByArticle
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        let currentTime = this.preTempTime;
        let newTime = this.props.tempTime;

        let currentSelectdModel = this.selectedModelsByArticle;
        let currentModelKey = '';
        if (currentSelectdModel){
            currentModelKey = currentSelectdModel[1].key;
        }
        let newSelectededModel = this.props.globalModelsByArticleFilterReducer.selectedModelsByArticle;
        let newModelKey = '';
        if (newSelectededModel){
            newModelKey = newSelectededModel[1].key;
        }

        if (currentTime != newTime || currentModelKey != newModelKey) {
            this.callAxiosBeforeSocket(true);
        }
    }

    legendFormatter = (data) => {
        let stationId = this.props.stationIdNo;
        let text = '';
        if (data.xHTML) {
            text = data.xHTML + "<br/>";
        }
        let series = data.series;
        let numberOfTemp = this.colorArray.length;
        for (let i = 0; i < numberOfTemp; i++) {
            if (series[i].y) {
                text += "<span style='color:   " + series[i].color + ";'>" + series[i].label + ": </span>" + series[i].y + "&nbsp; &nbsp; &nbsp;";
            }
            if (i == (numberOfTemp / 2 - 1)) {
                text += "<br/>";
            }
        }

        if (document.getElementById("tooltip" + stationId)) {
            document.getElementById("tooltip" + stationId).innerHTML = text;
        }

        let html = "";
        return html;
    }

    callAxiosBeforeSocket = (stopCurrentSocket = false, callback) => {
        if (!this.state.loading) {
            this.setState({loading: true});
        }
        let {tempTime, stationIdNo} = this.props;
        let selectedModelsByArticle = this.props.globalModelsByArticleFilterReducer.selectedModelsByArticle;
        let modelKey = '';
        if (selectedModelsByArticle){
            modelKey = selectedModelsByArticle[1].key;
        }
        let currentTimeDevice = specifyNminutesToCurrentTimeDevice(tempTime);
        let param = {
            "idStation": stationIdNo,
            "from_timedevice": currentTimeDevice[0],
            "to_timedevice": currentTimeDevice[1],
            "shiftno": 0,
            "modelname": modelKey
        };
        API(this.apiUrl, 'POST', param)
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;
                    let displayData = JSON.parse(dataArray[0].data);
                    this.displayData = displayData;
                    this.graph.updateOptions(
                        {
                            'file': displayData,
                        },
                    );
                    this.displayData = [];
                    this.setState({loading: false});
                    if (!stopCurrentSocket){
                        this.callSocket();
                    } else {
                        this.restartSocket();
                    }
                } else {
                    return callback();
                }
            })
            .catch((err) => console.log('err:', err, "stationId: ", stationIdNo));
    }

    callSocket = () => {
        let {stationIdNo} = this.props;
        let displayData = "X\n";

        let selectedModelsByArticle = this.props.globalModelsByArticleFilterReducer.selectedModelsByArticle;
        let modelKey = '';
        if (selectedModelsByArticle){
            modelKey = selectedModelsByArticle[1].key;
        }
        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                minute: this.preTempTime,
                //minute: -10,
                status: 'start',
                idStation: stationIdNo,
                shiftno: 0,
                modelname: modelKey
            }
        });


        this.socket.on(this.eventListen, (response) => {
            response = JSON.parse(response);
            if (response.success) {
                let returnArrayObject = response.data;
                let returnArray = JSON.parse(returnArrayObject[0].data);
                if (returnArray && returnArray.length > 0) {
                    if (displayData === "X\n") {
                        displayData = returnArray;
                    } else {
                        displayData = displayData.slice(returnArray.length, displayData.length);
                        displayData.push(...returnArray);
                    }
                    this.graph.updateOptions({'file': displayData});
                    this.setState({loading: false});
                }
            }

        });
    }

    //Stop old socket, create new one
    restartSocket = () => {
        let currentSelectdModel = this.selectedModelsByArticle;
        let currentModelKey = '';
        if (currentSelectdModel){
            currentModelKey = currentSelectdModel[1].key;
        }
        let newSelectededModel = this.props.globalModelsByArticleFilterReducer.selectedModelsByArticle;
        let newModelKey = '';
        if (newSelectededModel){
            newModelKey = newSelectededModel[1].key;
        }

        let {tempTime, stationIdNo} = this.props;

        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                minute: this.preTempTime,
                status: 'stop',
                idStation: stationIdNo,
                modelname: currentModelKey
            }
        });

        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                minute: tempTime,
                status: 'start',
                idStation: `${stationIdNo}`,
                modelname: newModelKey
            }
        });
        this.preTempTime = tempTime;
        this.selectedModelsByArticle = newSelectededModel;
    }

    componentDidMount() {
        let {tempTime, stationIdNo} = this.props;
        this.preTempTime = tempTime;

        let myInteractions = Object.assign({}, Dygraph.defaultInteractionModel, {
            dblclick: (event, g, context) => {
                if (this.graph && this.graph.isZoomed()){
                    this.graph.resetZoom();
                    this.graph.updateOptions({
                        valueRange: [100, 180],
                    });
                }
            }
        });

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
                series: this.seriesOptions,
                //legendFormatter,
                //labelsSeparateLines: true,
                axes: {
                    x: {
                        drawGrid: false,
                        valueFormatter: function (x) {
                            return moment.unix(x).format("DD/MM/YYYY HH:mm:ss");
                        },
                        axisLabelFormatter: function (x) {
                            return moment.unix(x).format("DD/MM/YYYY HH:mm:ss");
                        },
                    },
                    y: {
                        axisLineColor: '#464d54',
                        valueRange: [100, 180],
                        //drawAxis: false,
                    }
                },
                legendFormatter: this.legendFormatter,
                labelsShowZeroValues: false,
                interactionModel: myInteractions,
            }
        );

        this.callAxiosBeforeSocket(false);

        /*
        Comment temporarily for fixing error loading socket long
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

        });*/
    };

    refresh = () => {
        if (this.graph && this.graph.isZoomed()) {
            this.graph.resetZoom();
            this.graph.updateOptions({
                valueRange: [100, 180],
            });
        }
    }

    render() {
        let stationId = this.props.stationIdNo;
        //let selectedModelsByArticle =
        // this.props.globalModelsByArticleFilterReducer.selectedModelsByArticle;

        return (
            <div className="col">
                <div className="row" style={{marginTop: 30}}>
                    <div className="col-11">
                        <h4 className="float-left">STATION {stationId}: USL/ Value/ LSL</h4>
                    </div>
                    <div className="col-1">
                        <img className="float-right" src={Refresh} style={{width: '50%'}}
                             onClick={this.refresh}/>
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
                            <div className="temperature-tooltip" style={{position: 'absolute'}}
                                 id={'tooltip' + stationId}></div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div id={'station' + stationId} style={{marginBottom: 50}}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    globalModelsByArticleFilterReducer: state.globalModelsByArticleFilterReducer,
});

export default connect(mapStateToProps)(TemperatureTrendItem);
