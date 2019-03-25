import React, {Component} from 'react'
import Refresh from "../../../../../shared/img/Refresh.svg";
import {ClipLoader} from "react-spinners";
import Dygraph from "dygraphs/src/dygraph";
import moment from "moment";
import API from "../../../../../services/api";
import Singleton from "../../../../../services/Socket";
import connect from "react-redux/es/connect/connect";
import {SHIFT_OPTIONS} from "../../../../../constants/constants";
import {specifySelectedShiftNo} from "../../../../../shared/utils/Utilities";

const override = `
    position: absolute;
    display:block;
    left:45%;
    top: 30%;
    z-index: 100000;
`;

class TemperatureTrendItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tempData: "X\n",
        };

        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        switch (this.role) {
            case 'admin':
                this.apiUrl = 'api/os/tempTrend';
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#FF71CF", "#8C67F6"];
                //this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2",
                // "tempB3"];
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
            case 'ip':
                this.apiUrl = 'api/ip/tempTrend';
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#FF71CF", "#8C67F6", "#449AFF", "#46D6EA"];
                this.labelArray = ["Time", "Actual L.Top Temp", "Actual L.Bottom Temp", "Actual" +
                " R.Top Temp", "Actual R.Bottom Temp", "Setting L.Top Temp", "Setting L.Bottom" +
                " Temp", "Setting R.Top Temp", "Setting R.Bottom Temp"];
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
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#FF71CF", "#8C67F6"];
                //this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2",
                // "tempB3"];
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
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#FF71CF", "#8C67F6"];
                //this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2",
                // "tempB3"];
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
        }
        this.state = {
            loading: true
        };

    }


    legendFormatter = (data) => {
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

        //console.log("stationId: ", this.props.stationId);

        if (document.getElementById("tooltip" + this.props.stationId)) {
            document.getElementById("tooltip" + this.props.stationId).innerHTML = text;
        }

        let html = "";
        return html;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.setState({loading: true});
            let {stationId} = this.props;
            let {startDate, endDate} = this.props.globalDateFilter;
            let newFromTimeDevice = moment(startDate.toISOString()).unix();
            let newToTimeDevice = moment(endDate.toISOString()).unix();
            let isSelectedShiftChange = this.props.globalShiftFilter.selectedShift != prevProps.globalDateFilter.selectedShift;

            let newSelectededModel = this.props.globalModelsByArticleFilterReducer.selectedModelsByArticle;
            let modelKey = '';
            if (newSelectededModel) {
                modelKey = newSelectededModel[1].key;
            }

            if (this.fromTimeDevice != newFromTimeDevice || this.toTimedevice != newToTimeDevice) {
                this.fromTimeDevice = newFromTimeDevice;
                this.toTimedevice = newToTimeDevice;
                let param = {
                    "idStation": stationId,
                    /*"from_timedevice": this.fromTimeDevice,
                    "to_timedevice": this.toTimedevice*/
                    "from_timedevice": 0,
                    "to_timedevice": 0,
                    "shiftno": 0,
                    "modelname": modelKey
                };
                API(this.apiUrl, 'POST', param)
                    .then((response) => {
                        if (response.data.success) {
                            let dataArray = response.data.data;
                            let displayData = '';
                            if (dataArray[0].data) {
                                displayData = JSON.parse(dataArray[0].data.replace('],[]', ']]'));
                            }
                            this.graph.updateOptions(
                                {
                                    'file': displayData,
                                },
                            );
                            this.setState({loading: false});

                        }
                    })
                    .catch((err) => console.log('err:', err, "stationId: ", stationId));
            } else if (isSelectedShiftChange) {
                let selectedShift = this.props.globalShiftFilter.selectedShift;
                selectedShift = specifySelectedShiftNo(selectedShift);
                this.fromTimeDevice = newFromTimeDevice;
                this.toTimedevice = newToTimeDevice;
                let param = {
                    "idStation": stationId,
                    /*"from_timedevice": this.fromTimeDevice,
                    "to_timedevice": this.toTimedevice*/
                    "from_timedevice": this.fromTimeDevice,
                    "to_timedevice": this.toTimedevice,
                    "shiftno": selectedShift,
                    "modelname": modelKey
                };
                API(this.apiUrl, 'POST', param)
                    .then((response) => {
                        if (response.data.success) {
                            let dataArray = response.data.data;
                            let displayData = '';
                            displayData = JSON.parse(dataArray[0].data);
                            this.displayData = displayData;
                            this.graph.updateOptions(
                                {
                                    'file': displayData,
                                },
                            );
                            this.setState({loading: false});

                        }
                    })
                    .catch((err) => console.log('err:', err, "stationId: ", stationId));
            }
        }
    }

    componentDidMount() {
        let {stationId} = this.props;

        //this.drawLegend();

        let {startDate, endDate} = this.props.globalDateFilter;
        this.fromTimeDevice = moment(startDate.toISOString()).unix();
        this.toTimedevice = moment(endDate.toISOString()).unix();
        let selectedShift = this.props.globalShiftFilter.selectedShift;
        selectedShift = specifySelectedShiftNo(selectedShift);

        let newSelectededModel = this.props.globalModelsByArticleFilterReducer.selectedModelsByArticle;
        let modelKey = '';
        if (newSelectededModel) {
            modelKey = newSelectededModel[1].key;
        }

        let param = {
            "idStation": stationId,
            "from_timedevice": this.fromTimeDevice,
            "to_timedevice": this.toTimedevice,
            "shiftno": selectedShift,
            "modelname": modelKey
        };

        let displayData = "X\n";
        this.graph = new Dygraph(
            document.getElementById('station' + stationId),
            displayData,
            {
                // options go here. See http://dygraphs.com/options.html
                //https://stackoverflow.com/questions/20234787/in-dygraphs-how-to-display-axislabels-as-text-instead-of-numbers-date
                animatedZooms: true,
                showLabelsOnHighlight: true,
                width: 590,
                height: 200,
                labels: this.labelArray,
                colors: this.colorArray,
                series: this.seriesOptions,
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
                        //drawAxis: false,
                    }
                },
                //labelsDiv: `lengendLabel` + stationId,
                legendFormatter: this.legendFormatter,
                labelsShowZeroValues: false
            }
        );

        API(this.apiUrl, 'POST', param)
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;
                    displayData = JSON.parse(dataArray[0].data.replace(",[]", "]"));
                    this.graph.updateOptions(
                        {
                            'file': displayData,
                            strokeWidth: '20px',
                        },
                    );
                    this.setState({loading: false});

                }
            })
            .catch((err) => console.log('err:', err, "stationId: ", stationId));
    }

    refresh = () => {
        if (this.graph) {
            this.graph.resetZoom();
        }
    }

    render() {
        let {stationId} = this.props;
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
                            <div style={{marginBottom: 50}} id={'station' + stationId}></div>
                        </div>
                    </div>
                    {/*<div className="container" style={{marginBottom: 40}}>
                        <div className="row">
                            <div style={{position: 'absolute'}} id={'lengendLabel' + stationId}> </div>
                        </div>
                    </div>*/}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    globalDateFilter: state.globalDateFilter,
    globalShiftFilter: state.globalShiftFilter,
    globalModelsByArticleFilterReducer: state.globalModelsByArticleFilterReducer,
});

export default connect(mapStateToProps)(TemperatureTrendItem);
