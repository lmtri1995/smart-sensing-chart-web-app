import React, {Component} from 'react'
import Singleton from "../../../../../services/Socket";
import {ClipLoader} from "react-spinners";
import API from "../../../../../services/api";

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

        switch (this.role) {
            case 'admin':
                this.apiUrl = `api/os/oeedata`;
                break;
            case 'ip':
                this.apiUrl = `api/os/oeedata`;
                break;
            case 'os':
                this.apiUrl = `api/os/oeedata`;
                break;
            default:
                this.apiUrl = `api/os/oeedata`;
        }

        this.state = {
            loading: true
        };
    }

    handleReturnData = (returnData) => {
        console.log("returnData 102: ", returnData);
        let result = [];
        let swingArmArray = [], osPessArray = [];
        if (returnData && returnData.length > 0) {
            returnData.map(item => {
                if (item) {
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
            });
        }
        result.push(swingArmArray);
        result.push(osPessArray);
        return result;

    }

    componentWillUnmount() {

    }

    componentDidMount() {
        const ctx = this.canvas.getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'bar',
            data: initialData,
            options: options
        });
        console.log("this.myChart: ", this.myChart);

        if (this.role == 'os') {
            let param = {
                "from_timedevice": 0,
                "to_timedevice": 0
            };
            API('api/os/stationcomparision', 'POST', param)
                .then((response) => {
                    console.log("response 137: ", response);
                    if (response.data.success) {
                        let dataArray = response.data.data;
                        let returnData = JSON.parse(dataArray[0].data);
                        let displayArray = this.handleReturnData(returnData);
                        console.log("displayArray: ", displayArray);
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
                })
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
