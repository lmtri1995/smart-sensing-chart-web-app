import React, {Component} from 'react';
import Singleton from "../../../../../services/Socket";
import API from "../../../../../services/api";

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

    handleReturnData = (returnData) => {
        let result = [];
        let idleCycleArray = [], deffectiveArray = [];
        if (returnData && returnData.length > 0) {
            returnData.map(item => {
                if (item) {
                    if (item[0] === 1) {
                        deffectiveArray[0] = item[1];
                        idleCycleArray[0] = item[2];
                    } else if (item[0] === 2){
                        deffectiveArray[1] = item[1];
                        idleCycleArray[1] = item[2];
                    } else if (item[0] === 3){
                        deffectiveArray[2] = item[1];
                        idleCycleArray[2] = item[2];
                    }
                }
            });
        }
        console.log("deffectiveArray: ", deffectiveArray);
        console.log("idleCycleArray: ", idleCycleArray);
        result.push(deffectiveArray);
        result.push(idleCycleArray);
        return result;

    }

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
                this.apiUrl = `api/os/defectdata`;
                this.istatus = `0`;
                this.process = 'os-Molding';
                break;
            case 'ip':
                this.apiUrl = `api/ip/defectdata`;
                this.istatus = `1`;
                this.process = 'imev';
                break;
            case 'os':
                this.apiUrl = `api/os/defectdata`;
                this.istatus = `0`;
                this.process = 'os-Molding';
                break;
            default:
                this.apiUrl = `api/os/defectdata`;
                this.istatus = `0`;
                this.process = 'os-Molding';
        }

        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        const ctx = this.canvas.getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'bar',
            data: initialData,
            options: options
        });

        let param = {
            "from_timedevice": 0,
            "to_timedevice": 0,
            "istatus": this.istatus,
            "proccess": this.process
        };
        API(this.apiUrl, 'POST', param)
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;
                    let returnData =  JSON.parse(dataArray[0].data);
                    if (returnData && returnData.length > 0) {
                        let displayArray = this.handleReturnData(returnData);
                        let labelArray = ['Shift 1', 'Shift 2', 'Shift 3'];
                        console.log("displayArray: ", displayArray);
                        this.myChart.data = {
                            labels: labelArray,
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
            })
            .catch((err) => console.log('err:', err))
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

export default CycleDefectStationComparison
