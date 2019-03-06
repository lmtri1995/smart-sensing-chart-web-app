import React, {Component} from 'react';
import Singleton from "../../../../../services/Socket";
import {ClipLoader} from "react-spinners";

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
        this.labels = [];

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
    }

    handleReturnData = (returnData) => {
        let result = [];
        let idleCycleArray = [], deffectiveArray = [];
        if (returnData && returnData.length > 0) {
            returnData.map(item => {
                if (item) {
                    if (item[0] == 1) {
                        idleCycleArray.push(item[1]);
                        deffectiveArray.push(item[2]);
                    } else if (item[0] == 2) {
                        idleCycleArray.push(item[1]);
                        deffectiveArray.push(item[2]);
                    } else if (item[0] == 3) {
                        idleCycleArray.push(item[1]);
                        deffectiveArray.push(item[2]);
                    }
                }
            });
        }
        result.push(idleCycleArray);
        result.push(deffectiveArray);
        return result;
    }

    componentWillUnmount() {
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

    componentDidMount() {
        const ctx = this.canvas.getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'bar',
            data: initialData,
            options: options
        });
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
                    this.myChart.data = {
                        labels: ['Shift 1', 'Shift 2', 'Shift 3'],
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
