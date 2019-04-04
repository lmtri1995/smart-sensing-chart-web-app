import React, {Component} from 'react';
import Singleton from "../../../../../services/Socket";
import {ClipLoader} from "react-spinners";
import {
    changeNumberFormat,
    specifyCurrentDateDevice,
    specifyCurrentShift,
    specifyTheShiftStartHour,
} from "../../../../../shared/utils/Utilities";
import API from "../../../../../services/api";
import connect from "react-redux/es/connect/connect";
import {pluginDrawZeroLine} from "../../../../../shared/utils/plugins";

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

        if (this.role == 'ip') {
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

        if (this.role != 'ip') {
            result.push(idleCycleArray);
        }
        return result;
    }

    arrangeSapByCurrentShift(sapArray){
        let result = [0, 0, 0];
        let currentShift = specifyCurrentShift();

        sapArray.map(item => {
            if (item) {
                if (currentShift == 1) {//2, 3, 1
                    result[0] = sapArray[1];
                    result[1] = sapArray[2];
                    result[2] = sapArray[0];
                } else if (currentShift == 2) {//3, 1, 2
                    result[0] = sapArray[2];
                    result[1] = sapArray[0];
                    result[2] = sapArray[1];
                } else { //1, 2, 3
                    result[0] = sapArray[0];
                    result[1] = sapArray[1];
                    result[2] = sapArray[2];
                }
            }
        });
        return result;
    }

    componentWillUnmount() {
        if (this._isMounted) {
            this.socket.emit(this.emitEvent, {
                msg: {
                    event: this.eventListen,
                    from_timedevice: 0,//1551333600
                    to_timedevice: 0,//1551420000
                    minute: 0,
                    status: 'stop',
                    shiftno: 0,
                    "modelname": ''
                }
            });
        }
    }

    changeLabelArray() {
        let currentShift = specifyCurrentShift();
        if (currentShift == 1) {
            this.labelArray = ['Shift 2', 'Shift 3', 'Shift 1'];
        } else if (currentShift == 2) {
            this.labelArray = ['Shift 3', 'Shift 1', 'Shift 2'];
        } else {
            this.labelArray = ['Shift 1', 'Shift 2', 'Shift 3'];
        }
    }

    callAxiosBeforeSocket = (stopCurrentSocket = false, callback) => {
        if (!this.state.loading) {
            this.setState({loading: true});
        }

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
            "shiftno": 0,
            "modelname": articleKey,
        };

        API(this.apiUrl, 'POST', param)
            .then((response) => {
                try {
                    let dataArray = response.data.data;
                    let returnData = JSON.parse(dataArray[0].data);


                    let displayArray = this.handleReturnData(returnData);
                    let dataset = [];
                    if (this.role == 'ip') {
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

                        this.myChart.data = {
                            labels: this.labelArray,
                            datasets: dataset
                        };
                        this.myChart.update();
                        this.setState({loading: false});
                        if (!stopCurrentSocket) {
                            this.callSocket();
                        } else {
                            this.restartSocket();
                        }
                    } else {
                        //Get SAP data for cycle
                        let currentWorkingDate = specifyCurrentDateDevice();
                        let param1 = {
                            "from_workdate": currentWorkingDate[0],
                            "to_workdate": currentWorkingDate[1],
                            "model_name": articleKey
                        };
                        API(`api/os/sap`, 'POST', param1).then((response1) => {
                            try {
                                let responseArray = response1.data.data;
                                let sapData = [0, 0, 0];
                                responseArray.map(item => {
                                    if (item.SHIFT_NO == '1') {
                                        sapData[0] = item.sap;
                                    } else if (item.SHIFT_NO == '2') {
                                        sapData[1] = item.sap;
                                    } else if (item.SHIFT_NO == '3') {
                                        sapData[2] = item.sap;
                                    }
                                });
                                sapData = this.arrangeSapByCurrentShift(sapData);
                                displayArray[1][0] -= sapData[0];
                                displayArray[1][1] -= sapData[1];
                                displayArray[1][2] -= sapData[2];

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

                                this.myChart.data = {
                                    labels: this.labelArray,
                                    datasets: dataset
                                };
                                this.myChart.update();
                                this.setState({loading: false});
                                if (!stopCurrentSocket) {
                                    this.callSocket();
                                } else {
                                    this.restartSocket();
                                }
                            } catch (e) {
                                console.log("Error: ", e);
                            }
                        });
                    }
                } catch (e) {
                    console.log("Error: ", e);
                    let dataset = [];
                    if (this.role == 'ip') {
                        dataset = [
                            {
                                label: 'Defective',
                                backgroundColor: '#4C9EFF',
                                borderColor: '#4C9EFF',
                                borderWidth: 1,
                                //hoverBackgroundColor: '#FF6384',
                                //hoverBorderColor: '#FF6384',
                                data: [0, 0, 0],
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
                                data: [0, 0, 0],
                            },
                            {
                                label: 'Idle Cycle',
                                backgroundColor: '#AFEEFF',
                                borderColor: '#AFEEFF',
                                borderWidth: 1,
                                //hoverBackgroundColor: '#FF6384',
                                //hoverBorderColor: '#FF6384',
                                data: [0, 0, 0],
                            }
                        ];
                    }
                    this.myChart.data = {
                        labels: this.labelArray,
                        datasets: dataset
                    };
                    this.myChart.update();
                    this.setState({loading: false});
                    if (!stopCurrentSocket) {
                        this.callSocket();
                    } else {
                        this.restartSocket();
                    }
                }
            })
            .catch((err) => console.log('err:', err))
    }

    //Stop old socket, create new one
    restartSocket = () => {
        let newSelectededArticle = this.props.globalArticleFilter.selectedArticle;
        let articleKey = '';
        if (newSelectededArticle) {
            articleKey = newSelectededArticle[1].key;
        }

        this.socket.emit(this.emitEvent, {
            msg: {
                "event": this.eventListen,
                "from_timedevice": 0,//1551333600
                "to_timedevice": 0,//1551420000
                "minute": 0,
                "status": 'stop',
                "shiftno": 0,
                "modelname": articleKey,
            }
        });

        this.socket.emit(this.emitEvent, {
            msg: {
                "event": this.eventListen,
                "from_timedevice": 0,//1551333600
                "to_timedevice": 0,//1551420000
                "minute": 0,
                "status": 'start',
                "shiftno": 0,
                "modelname": articleKey,
            }
        });
        this.currentSelectedArticle = newSelectededArticle;
    };

    callSocket = () => {
        let newSelectededArticle = this.props.globalArticleFilter.selectedArticle;
        let articleKey = '';
        if (newSelectededArticle) {
            articleKey = newSelectededArticle[1].key;
        }

        this.socket.emit(this.emitEvent, {
            msg: {
                "event": this.eventListen,
                "from_timedevice": 0,//1551333600
                "to_timedevice": 0,//1551420000
                "minute": 0,
                "status": 'start',
                "shiftno": 0,
                "modelname": articleKey,
            }
        });
        this.socket.on(this.eventListen, (response) => {
            try {
                response = JSON.parse(response);
                let dataArray = response.data;
                let returnData = JSON.parse(dataArray[0].data);
                let displayArray = this.handleReturnData(returnData);
                let totalDefectcount = 0;
                if (displayArray[0] && displayArray.length > 0) {
                    displayArray[0].map(item => {
                        if (item) {
                            totalDefectcount += parseInt(item);
                        }
                    });
                }
                //localStorage.setItem("totalDefectCount", totalDefectcount);
                let dataset = [];
                if (this.role == 'ip') {
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
                    this.myChart.data = {
                        labels: this.labelArray,
                        datasets: dataset
                    };
                    this.myChart.update();
                    this.setState({loading: false});
                } else {
                    //Get SAP data for cycle
                    let currentWorkingDate = specifyCurrentDateDevice();
                    let param1 = {
                        "from_workdate": currentWorkingDate[0],
                        "to_workdate": currentWorkingDate[1],
                        "model_name": articleKey
                    };
                    API(`api/os/sap`, 'POST', param1).then((response1) => {
                        try {
                            let responseArray = response1.data.data;
                            let sapData = [0, 0, 0];
                            responseArray.map(item => {
                                if (item.SHIFT_NO == '1') {
                                    sapData[0] = item.sap;
                                } else if (item.SHIFT_NO == '2') {
                                    sapData[1] = item.sap;
                                } else if (item.SHIFT_NO == '3') {
                                    sapData[2] = item.sap;
                                }
                            });
                            sapData = this.arrangeSapByCurrentShift(sapData);
                            displayArray[1][0] -= sapData[0];
                            displayArray[1][1] -= sapData[1];
                            displayArray[1][2] -= sapData[2];

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

                            this.myChart.data = {
                                labels: this.labelArray,
                                datasets: dataset
                            };
                            this.myChart.update();
                            this.setState({loading: false});
                        } catch (e) {
                            console.log("Error: ", e);
                        }
                    });
                }
            } catch (e) {
                console.log("Error: ", e);
                let dataset = [];
                if (this.role == 'ip') {
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
                            data: [0, 0, 0],
                        },
                        {
                            label: 'Idle Cycle',
                            backgroundColor: '#AFEEFF',
                            borderColor: '#AFEEFF',
                            borderWidth: 1,
                            //hoverBackgroundColor: '#FF6384',
                            //hoverBorderColor: '#FF6384',
                            data: [0, 0, 0],
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

        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let currentTime = this.preTempTime;
        let newTime = this.props.tempTime;

        let currentSelectedArticle = this.currentSelectedArticle;
        let currentArticleKey = '';
        if (currentSelectedArticle) {
            currentArticleKey = currentSelectedArticle[1].key;
        }
        let newSelectedArticle = this.props.globalArticleFilter.selectedArticle;
        let newArticleKey = '';
        if (newSelectedArticle) {
            newArticleKey = newSelectedArticle[1].key;
        }

        if (currentTime != newTime || currentArticleKey != newArticleKey) {
            this.callAxiosBeforeSocket(true);
        }
    }

    componentDidMount() {
        this._isMounted = true;
        const ctx = this.canvas.getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'bar',
            data: initialData,
            options: options,
            plugins: pluginDrawZeroLine
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
    globalModelFilterReducer: state.globalModelFilterReducer,
});

export default connect(mapStateToProps)(CycleDefectStationComparison);
