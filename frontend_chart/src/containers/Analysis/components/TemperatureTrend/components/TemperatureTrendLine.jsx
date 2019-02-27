/* eslint-disable no-underscore-dangle,react/no-did-mount-set-state */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import Dygraph from "dygraphs/src/dygraph";
import moment from "moment";
import API from "../../../../../services/api";
import Singleton from "../../../../../services/Socket";

class TemperatureTrendLine extends PureComponent {
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
                this.colorArray = ["#71D7BE", "#F89D9D", "#FF9C64", "#EB6A91", "#F575F7", "#8C67F6"];
                this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2", "tempB3"];
                break;
            case 'ip':
                this.apiUrl = 'api/ip/tempTrend';
                this.colorArray = ["#71D7BE", "#F89D9D", "#FF9C64", "#EB6A91", "#F575F7", "#8C67F6", "#449AFF", "#46D6EA"];
                this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempA4", "tempB1", "tempB2", "tempB3", "tempB4"];
                break;
            case 'os':
                this.apiUrl = 'api/os/tempTrend';
                this.colorArray = ["#71D7BE", "#F89D9D", "#FF9C64", "#EB6A91", "#F575F7", "#8C67F6"];
                this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2", "tempB3"];
                break;
            default:
                this.apiUrl = 'api/os/tempTrend';
                this.colorArray = ["#71D7BE", "#F89D9D", "#FF9C64", "#EB6A91", "#F575F7", "#8C67F6"];
                this.labelArray = ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2", "tempB3"];
                break;
        }

        this.props.onRef(this);
    }

    refresh = () => {
        if (this.graph){
            this.graph.resetZoom();
        }
    }

    componentDidMount() {
        let {stationId} = this.props;
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
                showLabelsOnHighlight: false,
                width: 720,
                height: 200,
                labels: ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2", "tempB3"],
                colors: ["#71D7BE", "#F89D9D", "#FF9C64", "#EB6A91", "#F575F7", "#8C67F6"],
                axes: {
                    x: {
                        drawGrid: false,
                        valueFormatter: function (x) {
                            return moment.unix(x).format("YYYY/MM/DD hh:mm:ss");
                        },
                        axisLabelFormatter: function (x) {
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

        API('api/os/tempTrend', 'POST', param)
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;
                    console.log("stationId: ", stationId, " - dataArray: ", dataArray[0].data);

                    let displayData = JSON.parse(dataArray[0].data);
                    if (displayData) {
                        this.graph.updateOptions( { 'file': displayData } );
                    }

                }
            })
            .catch((err) => console.log('err:', err, "stationId: ", stationId));
    }

    render() {
        let {stationId} = this.props;
        return (
            <div className="container">
                <div className="row">
                    <div className="col" style={{marginBottom: 38}} id={'station' + stationId}></div>
                </div>
            </div>


        );
    }
}

const mapStateToProps = state => {
    return {
        globalFilter: state.globalFilter,
    }
};

export default connect(mapStateToProps, null)(
    TemperatureTrendLine
)
