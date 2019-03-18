import React, {Component} from 'react'
import {Bar} from 'react-chartjs-2';
import Singleton from "../../../../../services/Socket";
import {ClipLoader} from "react-spinners";
import moment from "moment";
import {changeNumberFormat, specifyCurrentShift} from "../../../../../shared/utils/Utilities";
import {pluginDrawZeroValue} from "../../../../../shared/utils/plugins";

const initialData = {
    labels: ['Shift 1', 'Shift 2', 'Shift 3'],
    datasets: [
        {
            label: 'Swing Arm',
            backgroundColor: '#0CD0EB',
            borderColor: '#0CD0EB',
            borderWidth: 1,
            //hoverBackgroundColor: '#FF6384',
            //hoverBorderColor: '#FF6384',
            data: [0, 0, 0],
        },
        {
            label: 'OS Press',
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
                ticks: {
                    fontColor: '#6D6F74',
                },
                barPercentage: 0.7
            },
        ],
        yAxes: [
            {
                gridLines: {
                    color: '#6D6F744D',
                    display: true,
                    drawBorder: false,
                    zeroLineColor: '#6D6F744D',
                },
                ticks: {
                    beginAtZero: true,
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
    }
};

const override = `
    position: absolute;
    display:block;
    left:45%;
    top: 40%;
    z-index: 100000;
`;

export class SwingArmMachine extends Component {
    constructor() {
        super();

        this.canvas = null;
        this.datasets = [];
        this.labels = [];

        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        switch(this.role) {
            case 'admin':
                this.emitEvent = `os_swingarm_stationcomparison`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            case 'ip':
                this.emitEvent = `ip_swingarm_stationcomparison`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            case 'os':
                this.emitEvent = `os_swingarm_stationcomparison`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            default:
                this.emitEvent = `os_swingarm_stationcomparison`;
                this.eventListen = `sna_${this.emitEvent}`;
        }

        this.state = {
            loading: true
        };
    }

    handleReturnData = (returnData) => {
        let result = [];
        let swingArmArray = [0, 0, 0], osPessArray = [0, 0, 0];
        let currentShift = specifyCurrentShift();
        if (returnData && returnData.length > 0){
            returnData.map(item => {
                if (item) {
                    if (currentShift == 1) {//2, 3, 1
                        if (item[0] == 1) {
                            swingArmArray[2] = item[1];
                            osPessArray[2] = item[2];
                        } else if (item[0] == 2) {
                            swingArmArray[0] = item[1];
                            osPessArray[0] = item[2];
                        } else if (item[0] == 3) {
                            swingArmArray[1] = item[1];
                            osPessArray[1] = item[2];
                        }
                    } else if (currentShift == 2) {//3, 1, 2
                        if (item[0] == 1) {
                            swingArmArray[1] = item[1];
                            osPessArray[1] = item[2];
                        } else if (item[0] == 2) {
                            swingArmArray[2] = item[1];
                            osPessArray[2] = item[2];
                        } else if (item[0] == 3) {
                            swingArmArray[0] = item[1];
                            osPessArray[0] = item[2];
                        }
                    } else { //1, 2, 3
                        if (item[0] == 1) {
                            swingArmArray[0] = item[1];
                            osPessArray[0] = item[2];
                        } else if (item[0] == 2) {
                            swingArmArray[1] = item[1];
                            osPessArray[1] = item[2];
                        } else if (item[0] == 3) {
                            swingArmArray[2] = item[1];
                            osPessArray[2] = item[2];
                        }
                    }
                }
            });
        }

        result.push(swingArmArray);
        result.push(osPessArray);
        return result;

    }

    componentWillUnmount(){
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

    componentDidMount() {
        const ctx = this.canvas.getContext('2d');

        this.changeLabelArray();

        this.myChart = new Chart(ctx, {
            type: 'bar',
            data: initialData,
            options: options,
            //plugins: pluginDrawZeroValue,
        });

        if(this.role == 'os'){
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
                if (response && response.success=="true"){
                    let dataArray = response.data;

                    console.log("dataArray aaa: ", dataArray);
                    let returnData = JSON.parse(dataArray[0].data);
                    if (returnData.length > 0){
                        let displayArray = this.handleReturnData(returnData);


                        if (displayArray && displayArray.length < 1) {
                            displayArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        }

                        this.myChart.data = {
                            labels: this.labelArray,
                            datasets: [
                                {
                                    label: 'Swing Arm',
                                    backgroundColor: '#0CD0EB',
                                    borderColor: '#0CD0EB',
                                    borderWidth: 1,
                                    //hoverBackgroundColor: '#FF6384',
                                    //hoverBorderColor: '#FF6384',
                                    data: displayArray[0],
                                },
                                {
                                    label: 'Os Press',
                                    backgroundColor: '#4C9EFF',
                                    borderColor: '#4C9EFF',
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
        } else {
            this.setState({loading: false});
        }

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
                    <canvas ref={(element) => this.canvas = element} height={70} width={200}/>
                </div>
            </div>
        )
    }
}

export default SwingArmMachine
