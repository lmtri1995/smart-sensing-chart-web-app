import React, {Component} from 'react'
import LineChart from "./TemperatureTrendLine";
import Refresh from "../../../../../shared/img/Refresh.svg";
import {ClipLoader} from "react-spinners";
import Dygraph from "dygraphs/src/dygraph";
import moment from "moment";
import API from "../../../../../services/api";
import Singleton from "../../../../../services/Socket";

const override = `
    position: absolute;
    display:block;
    left:45%;
    top: 30%;
    z-index: 100000;
`;

export default class TemperatureTrendItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tempData: "X\n",
        };

        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        switch(this.role) {
            case 'admin':
                this.apiUrl = 'api/os/tempTrend';
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#FF71CF", "#8C67F6"];
                this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2", "tempB3"];
                break;
            case 'ip':
                this.apiUrl = 'api/ip/tempTrend';
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#FF71CF", "#8C67F6", "#449AFF", "#46D6EA"];
                this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempA4", "tempB1", "tempB2", "tempB3", "tempB4"];
                break;
            case 'os':
                this.apiUrl = 'api/os/tempTrend';
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#FF71CF", "#8C67F6"];
                this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2", "tempB3"];
                break;
            default:
                this.apiUrl = 'api/os/tempTrend';
                this.colorArray = ["#71D7BE", "#FEF7DC", "#FF9C64", "#C8DCFC", "#FF71CF", "#8C67F6"];
                this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2", "tempB3"];
                break;
        }
        this.state = {
            loading: true
        };
    }

    legendFormatter = (data)=>{
        let text = '';
        if (data.xHTML){
            text = data.xHTML + "<br/>";
        }
        let series = data.series;
        for (let i = 0; i < 6; i++){
            if (series[i].y){
                text += "<span style='color: " + series[i].color +";'>" + series[i].label + ": </span>" + series[i].y + "&nbsp;";
            }
        }



        document.getElementById("tooltip" + this.props.stationId).innerHTML = text;

        let html = "";
        return html;
    }

    drawLegend = () => {
        let stationId = this.props.stationId;
        let legendValue = "<div class='legend-container'>";
        for (let i = 0; i < this.colorArray.length; i++){
            let color = this.colorArray[i];
            let label = this.labelArray[i+1];
            legendValue += "<div id='"+ label + stationId +"' class='legend-box'" +
                " style='background-color: " + color + ";'></div>";
            legendValue += "<div class='temperature-legend'>" + label + "</div> &nbsp; &nbsp; ";
        }
        legendValue += "</div>";
        document.getElementById("lengendLabel" + this.props.stationId).innerHTML = legendValue;
    }


    componentDidMount() {
        let {stationId} = this.props;

        this.drawLegend();

        let param = {
            idStation: stationId,
            from_timedevice: 0,
            to_timedevice: 0,
            minute: 0,
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
                axes: {
                    x: {
                        drawGrid: false,
                        valueFormatter: function (x) {
                            return moment.unix(x).format("DD/MM/YYYY hh:mm:ss");
                        },
                        axisLabelFormatter: function (x) {
                            return moment.unix(x).format("DD/MM/YYYY hh:mm:ss");
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

        API('api/os/tempTrend', 'POST', param)
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;

                    let displayData = JSON.parse(dataArray[0].data);
                    if (displayData) {
                        this.graph.updateOptions(
                            {
                                'file': displayData,
                            },
                        );
                    }
                    this.setState({loading: false});

                }
            })
            .catch((err) => console.log('err:', err, "stationId: ", stationId));
    }

    refresh = ()=> {
        if (this.graph){
            this.graph.resetZoom();
        }
    }

    render() {
        let {stationId} = this.props;
        return (
            <div className="col">
                <div className="row">
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
                            <div style={{marginBottom: 50}} id={'station' + stationId}></div>
                        </div>
                    </div>
                    <div className="container" style={{marginBottom: 40}}>
                        <div className="row">
                            <div style={{position: 'absolute'}} id={'lengendLabel' + stationId}> </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
