import React, {Component} from 'react';
import Singleton from "../../../../../services/Socket";
import {ClipLoader} from "react-spinners";
import moment from "moment";

const initialData = {
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
                this.emitEvent = `os_swingarm_idledefect`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            case 'ip':
                this.emitEvent = `ip_swingarm_idledefect`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            case 'os':
                this.emitEvent = `os_swingarm_idledefect`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            default:
                this.emitEvent = `os_swingarm_idledefect`;
                this.eventListen = `sna_${this.emitEvent}`;
        }

        this.state = {
            loading: true
        };
        this._isMounted = false;
    }

    specifyCurrentShift() {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth();
        let yyyy = today.getFullYear();
        let hour = today.getHours();
        let minute = today.getMinutes();
        let second = today.getSeconds();
        //shift 1: 6:00 am - 2:00 pm
        //shift 2: 2:00 am - 20:00 pm
        //shift 3: 20:00 pm - 6:00 am
        let currentTime = moment.utc([yyyy, mm, dd, hour, minute, second]).unix();
        let shift1From = moment.utc([yyyy, mm, dd, 6, 0, 0]).unix();
        let shift1To = moment.utc([yyyy, mm, dd, 14, 0, 0]).unix();
        let shift2From = shift1To;
        let shift2To = moment.utc([yyyy, mm, dd, 22, 0, 0]).unix();
        let shift3From = shift2To;
        let shift3To = moment.utc([yyyy, mm, dd + 1, 6, 0, 0]).unix();

        let result = 0;
        if (currentTime >= shift1From && currentTime < shift1To) {
            result = 1;
        } else if (currentTime >= shift2From && currentTime < shift2To) {
            result = 2;
        } else if (currentTime >= shift3From && currentTime < shift3To) {
            result = 3;
        }
        return result;
    }

    handleReturnData = (returnData) => {
        let result = [];
        let idleCycleArray = [], deffectiveArray = [];
        let currentShift = this.specifyCurrentShift();
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
        result.push(idleCycleArray);
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
        let currentShift = this.specifyCurrentShift();
        if (currentShift == 1){
            this.labelArray = ['Shift 2', 'Shift 3', 'Shift 1'];
        } else if (currentShift == 2){
            this.labelArray = ['Shift 3', 'Shift 1', 'Shift 2'];
        } else {
            this.labelArray = ['Shift 1', 'Shift 2', 'Shift 3'];
        }
    }

    componentDidMount() {
        this._isMounted = true;
        const ctx = this.canvas.getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'bar',
            data: initialData,
            options: options
        });

        this.changeLabelArray();
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
                    localStorage.setItem("totalDefectCount", totalDefectcount);
                    this.myChart.data = {
                        labels: this.labelArray,
                        datasets: [
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
                        ],
                    };
                    this.myChart.update();
                    this.setState({loading: false});
                }
            }
        });
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

export default CycleDefectStationComparison
