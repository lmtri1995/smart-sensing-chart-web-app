import React, {Component} from 'react';
import Singleton from "../../../../../services/Socket";
import {ClipLoader} from "react-spinners";
import moment from "moment";
import {
    changeNumberFormat,
    specifyCurrentShift,
    specifyTheShiftStartHour
} from "../../../../../shared/utils/Utilities";
import API from "../../../../../services/api";
import connect from "react-redux/es/connect/connect";
import {pluginDrawZeroValue} from "../../../../../shared/utils/plugins";

let initialData = {
    labels: ['Shift 1', 'Shift 2', 'Shift 3'],
    datasets: [
        {
            label: 'Defective',
            backgroundColor: '#AFEEFF',
            borderColor: '#AFEEFF',
            borderWidth: 1,
            //hoverBackgroundColor: '#FF6384',
            //hoverBorderColor: '#FF6384',
            data: [0, 0, 0],
        },
        {
            label: 'Idle Cycle',
            backgroundColor: '#4C9EFF',
            borderColor: '#4C9EFF',
            borderWidth: 1,
            //hoverBackgroundColor: '#FF6384',
            //hoverBorderColor: '#FF6384',
            data: [0, 0, 0],
        }
    ],
};

const options = {
    legend: {
        display: true,
        position: 'bottom',
    },
    scales: {
        xAxes: [
            {
                stacked: true,
                ticks: {
                    fontColor: '#6D6F74',
                },
                barPercentage: 0.3
            },
        ],
        yAxes: [
            {
                stacked: true,
                gridLines: {
                    color: '#6D6F744D',
                    display: true,
                    drawBorder: false,
                    zeroLineColor: '#6D6F744D',
                },
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    fontColor: '#6D6F74',
                },
            },
        ],
    },
    tooltips: {
        callbacks: {
            label: function (tooltipItem, data) {
                let label = data.datasets[tooltipItem.datasetIndex].label || '';
                if (label) {
                    label += `: ${changeNumberFormat(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index])}`
                } else {
                    label = '0';
                }
                return label;
            },
        }
    },
};

const override = `
    position: absolute;
    display:block;
    left:45%;
    top: 10%;
    z-index: 100000;
`;

export class CycleDefectStationComparison extends Component {
    constructor() {
        super();

        this.canvas = null;
        this.datasets = [];
        this.labels = ['Shift 1', 'Shift 2', 'Shift 3'];

        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        switch (this.role) {
            case 'admin':
                this.apiUrl = `api/os/defectdata`;
                this.emitEvent = `os_swingarm_idledefect`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            case 'ip':
                this.apiUrl = `api/ip/defectdata`;
                this.emitEvent = `ip_swingarm_idledefect`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            case 'os':
                this.apiUrl = `api/os/defectdata`;
                this.emitEvent = `os_swingarm_idledefect`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            default:
                this.apiUrl = `api/os/defectdata`;
                this.emitEvent = `os_swingarm_idledefect`;
                this.eventListen = `sna_${this.emitEvent}`;
        }

        this.state = {
            loading: true
        };
        this._isMounted = false;

        if (this.role == 'ip'){
            initialData = {
                labels: ['Shift 1', 'Shift 2', 'Shift 3'],
                datasets: [
                    {
                        label: 'Defective',
                        backgroundColor: '#AFEEFF',
                        borderColor: '#AFEEFF',
                        borderWidth: 1,
                        //hoverBackgroundColor: '#FF6384',
                        //hoverBorderColor: '#FF6384',
                        data: [0, 0, 0],
                    },
                ],
            };
        }
    }

    handleReturnData = (returnData) => {
        let result = [];
        let idleCycleArray = [0, 0, 0], deffectiveArray = [0, 0, 0];
        let currentShift = specifyCurrentShift();
        if (returnData && returnData.length > 0) {
            returnData.map(item => {
                if (item) {
                    if (currentShift == 1) {//2, 3, 1
                        if (item[0] == 1) {
                            deffectiveArray[2] = item[1];
                            idleCycleArray[2] = item[2];
                        } else if (item[0] == 2) {
                            deffectiveArray[0] = item[1];
                            idleCycleArray[0] = item[2];
                        } else if (item[0] == 3) {
                            deffectiveArray[1] = item[1];
                            idleCycleArray[1] = item[2];
                        }
                    } else if (currentShift == 2) {//3, 1, 2
                        if (item[0] == 1) {
                            deffectiveArray[1] = item[1];
                            idleCycleArray[1] = item[2];
                        } else if (item[0] == 2) {
                            deffectiveArray[2] = item[1];
                            idleCycleArray[2] = item[2];
                        } else if (item[0] == 3) {
                            deffectiveArray[0] = item[1];
                            idleCycleArray[0] = item[2];
                        }
                    } else { //1, 2, 3
                        if (item[0] == 1) {
                            idleCycleArray[0] = item[1];
                            deffectiveArray[0] = item[2];
                        } else if (item[0] == 2) {
                            idleCycleArray[1] = item[1];
                            deffectiveArray[1] = item[2];
                        } else if (item[0] == 3) {
                            idleCycleArray[2] = item[1];
                            deffectiveArray[2] = item[2];
                        }
                    }

                }
            });
        }
        result.push(deffectiveArray);
        if (this.role != 'ip'){
            result.push(idleCycleArray);
        }

        return result;
    }

    componentWillUnmount() {
        if (this._isMounted){
            this.socket.emit(this.emitEvent, {
                msg: {
                    event: this.eventListen,
                    from_timedevice: 0,//1551333600
                    to_timedevice: 0,//1551420000
                    minute: 60,
                    status: 'stop'
                }
            });
        }
    }

    changeLabelArray(){
        let currentShift = specifyCurrentShift();
        if (currentShift == 1){
            this.labelArray = ['Shift 2', 'Shift 3', 'Shift 1'];
        } else if (currentShift == 2){
            this.labelArray = ['Shift 3', 'Shift 1', 'Shift 2'];
        } else {
            this.labelArray = ['Shift 1', 'Shift 2', 'Shift 3'];
        }
    }

    callAxiosBeforeSocket = (callback) => {
        let newSelectededArticle = this.props.globalArticleFilter.selectedArticle;
        let articleKey = '';
        if (newSelectededArticle) {
            articleKey = newSelectededArticle[1].key;
        }
        let timeFromStartOfShift = specifyTheShiftStartHour();
        let param = {
            "from_timedevice": timeFromStartOfShift[0],
            "to_timedevice": timeFromStartOfShift[1],
            "istatus": this.istatus,
            "proccess": this.process,
            // "shiftno": 0,
            // "modelname": articleKey,
        };

        API(this.apiUrl, 'POST', param)
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;
                    let returnData =  JSON.parse(dataArray[0].data);
                    if (returnData && returnData.length > 0) {
                        let displayArray = this.handleReturnData(returnData);
                        let dataset = {};
                        if (this.role == 'ip'){
                            dataset = [
                                {
                                    label: 'Defective',
                                    backgroundColor: '#4C9EFF',
                                    borderColor: '#4C9EFF',
                                    borderWidth: 1,
                                    //hoverBackgroundColor: '#FF6384',
                                    //hoverBorderColor: '#FF6384',
                                    data: displayArray[0],
                                }
                            ];
                        } else {
                            dataset = [
                                {
                                    label: 'Defective',
                                    backgroundColor: '#4C9EFF',
                                    borderColor: '#4C9EFF',
                                    borderWidth: 1,
                                    //hoverBackgroundColor: '#FF6384',
                                    //hoverBorderColor: '#FF6384',
                                    data: displayArray[0],
                                },
                                {
                                    label: 'Idle Cycle',
                                    backgroundColor: '#AFEEFF',
                                    borderColor: '#AFEEFF',
                                    borderWidth: 1,
                                    //hoverBackgroundColor: '#FF6384',
                                    //hoverBorderColor: '#FF6384',
                                    data: displayArray[1],
                                }
                            ];
                        }
                        this.myChart.data = {
                            labels: this.labelArray,
                            datasets: dataset
                        };
                        this.callSocket()
                        this.myChart.update();
                        this.setState({loading: false});
                    }
                } else {
                    callback();
                }
            })
            .catch((err) => console.log('err:', err))
    }

    callSocket = () => {
        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                from_timedevice: 0,//1551333600
                to_timedevice: 0,//1551420000
                minute: 60,
                status: 'start'
            }
        });
        this.socket.on(this.eventListen, (response) => {
            response = JSON.parse(response);
            if (response && response.success == "true") {
                let dataArray = response.data;
                let returnData = JSON.parse(dataArray[0].data);
                if (returnData.length > 0) {
                    let displayArray = this.handleReturnData(returnData);
                    let totalDefectcount = 0;
                    if (displayArray[0] && displayArray.length > 0){
                        displayArray[0].map(item=>{
                            if (item){
                                totalDefectcount += parseInt(item);
                            }
                        });
                    }
                    //localStorage.setItem("totalDefectCount", totalDefectcount);
                    let dataset = {};
                    if (this.role == 'ip'){
                        dataset = [
                            {
                                label: 'Defective',
                                backgroundColor: '#4C9EFF',
                                borderColor: '#4C9EFF',
                                borderWidth: 1,
                                //hoverBackgroundColor: '#FF6384',
                                //hoverBorderColor: '#FF6384',
                                data: displayArray[0],
                            }
                        ];
                    } else {
                        dataset = [
                            {
                                label: 'Defective',
                                backgroundColor: '#4C9EFF',
                                borderColor: '#4C9EFF',
                                borderWidth: 1,
                                //hoverBackgroundColor: '#FF6384',
                                //hoverBorderColor: '#FF6384',
                                data: displayArray[0],
                            },
                            {
                                label: 'Idle Cycle',
                                backgroundColor: '#AFEEFF',
                                borderColor: '#AFEEFF',
                                borderWidth: 1,
                                //hoverBackgroundColor: '#FF6384',
                                //hoverBorderColor: '#FF6384',
                                data: displayArray[1],
                            }
                        ];
                    }
                    this.myChart.data = {
                        labels: this.labelArray,
                        datasets: dataset
                    };
                    this.myChart.update();
                    this.setState({loading: false});
                }
            }
        });
    }

    componentDidMount() {
        this._isMounted = true;
        const ctx = this.canvas.getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'bar',
            data: initialData,
            options: options,
            plugins: pluginDrawZeroValue
        });

        this.changeLabelArray();
        this.callAxiosBeforeSocket();
    }

    render() {
        return (
            <div className="oee-main">
                <div className="col-12"><h4>Station Comparison</h4></div>
                <div>
                    <ClipLoader
                        css={override}
                        sizeUnit={"px"}
                        size={100}
                        color={'#30D4A4'}
                        loading={this.state.loading}
                        margin-left={300}
                    />
                    <canvas ref={(element) => this.canvas = element} height={140} width={570}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    globalArticleFilter: state.globalArticleFilter,
});

export default connect(mapStateToProps)(CycleDefectStationComparison);
