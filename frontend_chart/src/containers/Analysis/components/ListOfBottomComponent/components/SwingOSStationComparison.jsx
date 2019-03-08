import React, {Component} from 'react'
import {Bar} from 'react-chartjs-2';
import Singleton from "../../../../../services/Socket";
import {ClipLoader} from "react-spinners";

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
            data: [1, 2, 3],
        },
        {
            label: 'OS Press',
            backgroundColor: '#4C9EFF',
            borderColor: '#4C9EFF',
            borderWidth: 1,
            //hoverBackgroundColor: '#FF6384',
            //hoverBorderColor: '#FF6384',
            data: [6, 5, 4],
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
                this.emitEvent = `os_swingarm_stationcomparison`;
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

    }

    componentDidMount() {
        const ctx = this.canvas.getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'bar',
            data: initialData,
            options: options
        });
    }

    render() {
        return (
            <div className="oee-main">
                <div className="col-12"><h4>Station Comparison</h4></div>
                <div>
                    <canvas ref={(element) => this.canvas = element} height={70} width={200}/>
                </div>
            </div>
        )
    }
}

export default SwingArmMachine
