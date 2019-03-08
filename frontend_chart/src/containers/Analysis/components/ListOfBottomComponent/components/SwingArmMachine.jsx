import React, {Component} from 'react'
import Singleton from "../../../../../services/Socket";
import moment from "moment";
import {ClipLoader} from "react-spinners";
import API from "../../../../../services/api";

const initialData = {
    labels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    datasets: [
        {
            label: 'Swing Arm',
            backgroundColor: '#C88FFA',
            borderColor: '#C88FFA',
            borderWidth: 1,
            //hoverBackgroundColor: '#FF6384',
            //hoverBorderColor: '#FF6384',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
    ],
};

const options = {
    responsive: true,
    legend: {
        display: true,
        position: 'bottom',
    },
    scales: {
        xAxes: [
            {
                ticks: {
                    //autoSkip: false,
                    fontColor: '#6D6F74',
                    maxRotation: 0,
                },
                barPercentage: 0.7,
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
        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        switch(this.role) {
            case 'admin':
                this.emitEvent = `os_swingarm`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            case 'ip':
                this.emitEvent = `os_swingarm`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            case 'os':
                this.emitEvent = `os_swingarm`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            default:
                this.emitEvent = `os_swingarm`;
                this.eventListen = `sna_${this.emitEvent}`;
        }

        this.labels = [];
        this.data = [];

        this.state = {
            loading: true
        };
    }

    /*handleReturnData = (returnData) => {
        if (returnData && returnData.length > 15){
            //server send 360 rows for the first time
            //handle returnData, divide into 2 child arrays: datasets, labels
            //set to this.datasets, this.labels
            //update chart
            returnData.map(item => {
                this.labels.push(moment.unix(item[0]).format("hh:mm:ss"));
                this.datasets.push(item[1]);
            });
        } else if (returnData && returnData.length >= 1) {
            //return data for last 10s => 1 record
            //insert returned record, remove 1 oldest record from this.datasets
            //update chart

            //insert the newest record
            returnData.map(item => {
                this.labels.push(moment.unix(item[0]).format("hh:mm:ss"));
                this.datasets.push(item[1]);
            });

            //remove the oldest record
            this.labels = this.labels.slice(returnData.length, this.labels.length);
            this.datasets = this.datasets.slice(returnData.length, this.datasets.length);
        }
    }*/

    handleReturnData = (returnData) => {
        this.labels = [];
        this.data = [];
        if(returnData && returnData.length > 0){
            returnData.map(item => {
                this.labels.push(item[0].split(" "));
                this.data.push(item[1]);
            });
        }
    }

    componentWillUnmount(){

    }

    componentDidMount() {
        let {startDate, endDate} = this.props;

        const ctx = this.canvas.getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'bar',
            data: initialData,
            options: options,
        })


        let param = {
            "from_timedevice": "1551490473",
            "to_timedevice": "1551749673"
        };

        if (this.role == 'ip'){
            this.setState({loading: false});
        } else {
            API('api/oee/swingarm', 'POST', param)
                .then((response) => {
                    console.log("response 139: ", response);
                    if (response.data.success) {
                        let dataArray = response.data.data;
                        let returnData = JSON.parse(dataArray[0].data);
                        this.handleReturnData(returnData);
                        this.myChart.data = {
                            labels: this.labels,
                            datasets: [{
                                label: 'Swing Arm Data',
                                backgroundColor: '#C88FFA',
                                borderColor: '#C88FFA',
                                borderWidth: 1,
                                //hoverBackgroundColor: '#FF6384',
                                //hoverBorderColor: '#FF6384',
                                data: this.data
                            }],
                        };
                        this.myChart.update();
                        this.setState({loading: false});
                    }
                })
                .catch((err) => console.log('err:', err))
        }

    }

    render() {
        return (
            <div className="oee-main">
                <div className="col-12"><h4>Swing Arm Machine</h4></div>
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
