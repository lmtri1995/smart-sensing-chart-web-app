import React, {Component} from 'react'
import {Bar} from 'react-chartjs-2';
import Singleton from "../../../../../services/Socket";
import {ClipLoader} from "react-spinners";

const initialData = {
    labels: ['Shift 1', 'Shift 2', 'Shift 3'],
    datasets: [
        {
            label: 'Initial Data',
            backgroundColor: '#0CD0EB',
            borderColor: '#0CD0EB',
            borderWidth: 1,
            //hoverBackgroundColor: '#FF6384',
            //hoverBorderColor: '#FF6384',
            data: [0, 0, 0],
        },
        {
            label: 'Initial Data',
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
        let swingArmArray = [], osPessArray = [];
        if (returnData && returnData.length > 0){
            returnData.map(item => {
                if (item) {
                    swingArmArray.push(item[1]);
                    osPessArray.push(item[2]);
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
            if (response && response.success=="true"){
                let dataArray = response.data;
                let returnData = JSON.parse(dataArray[0].data);
                if (returnData.length > 0){
                    let displayArray = this.handleReturnData(returnData);
                    this.myChart.data = {
                        labels: ['Shift 1', 'Shift 2', 'Shift 3'],
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
