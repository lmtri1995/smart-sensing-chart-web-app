import React, {Component} from 'react'
import Singleton from "../../../../../services/Socket";
import moment from "moment";
import {ClipLoader} from "react-spinners";
import API from "../../../../../services/api";
import connect from "react-redux/es/connect/connect";

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
    tooltips: {
        callbacks: {
            label: function (tooltipItem, data) {
                var value = data.datasets[0].data[tooltipItem.index];
                var label = data.labels[tooltipItem.index];

                if (value === 0.5) {
                    value = 0;
                }

                return label + ': ' + value;
            }
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
        if (returnData && returnData.length > 0){
            returnData.map(item => {
                this.labels.push(item[0] + 'h');
                this.datasets.push(item[1]);
            });
        }
    }

    componentWillUnmount(){

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            if (this.role == 'os'){
                this.setState({loading: true});
                let {startDate, endDate} = this.props.globalDateFilter;
                let fromTimeDevice = moment(startDate.toISOString()).unix();
                let toTimedevice   = moment(endDate.toISOString()).unix();

                let param = {
                    "from_timedevice": fromTimeDevice,
                    "to_timedevice": toTimedevice
                };
                API('api/os/swingarm', 'POST', param)
                    .then((response) => {
                        if (response && response.data){
                            let dataArray = response.data.data;
                            if (dataArray && dataArray.length > 0){
                                let returnData = JSON.parse(dataArray[0].data);
                                if (returnData && returnData.length > 0) {
                                    let displayLabels = ["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h", "23h", "24h"];
                                    let displayDatasets = returnData[0];
                                    if (displayDatasets.length < 1) {
                                        displayDatasets = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
                                    }
                                    for (let i = 0; i < displayDatasets.length; i++) {
                                        if (!displayDatasets[i] || displayDatasets[i] == 0) {
                                            displayDatasets[i] = 0.5;
                                        }
                                    }
                                    console.log("displayDatasets: ", displayDatasets);
                                    this.myChart.data = {
                                        labels: displayLabels,
                                        datasets: [{
                                            label: 'Swing Arm Data',
                                            backgroundColor: '#C88FFA',
                                            borderColor: '#C88FFA',
                                            borderWidth: 1,
                                            //hoverBackgroundColor: '#FF6384',
                                            //hoverBorderColor: '#FF6384',
                                            data: displayDatasets
                                        }]
                                    };
                                    this.myChart.update();
                                    this.setState({loading: false});
                                }
                            }
                        } else {
                            let displayLabels = ["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h", "23h", "24h"];
                            let displayDatasets = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
                            this.myChart.data = {
                                labels: displayLabels,
                                datasets: [{
                                    label: 'Swing Arm Data',
                                    backgroundColor: '#C88FFA',
                                    borderColor: '#C88FFA',
                                    borderWidth: 1,
                                    //hoverBackgroundColor: '#FF6384',
                                    //hoverBorderColor: '#FF6384',
                                    data: displayDatasets
                                }]
                            };
                            this.myChart.update();
                            this.setState({loading: false});
                        }
                    })
                    .catch((err) => console.log('err:', err))
            }
        }
    }

    componentDidMount() {
        const ctx = this.canvas.getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'bar',
            data: initialData,
            options: options,
        })

        if (this.role == 'ip'){
            this.setState({loading: false});
        } else {
            let {startDate, endDate} = this.props.globalDateFilter;
            let fromTimeDevice = moment(startDate.toISOString()).unix();
            let toTimedevice   = moment(endDate.toISOString()).unix();

            let param = {
                "from_timedevice": fromTimeDevice,
                "to_timedevice": toTimedevice
            };
            API('api/os/swingarm', 'POST', param)
                .then((response) => {
                    if (response && response.data){
                        let dataArray = response.data.data;
                        if (dataArray && dataArray.length > 0){
                            let returnData = JSON.parse(dataArray[0].data);
                            if (returnData && returnData.length > 0) {
                                let displayLabels = ["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h", "23h", "24h"];
                                let displayDatasets = returnData[0];
                                this.myChart.data = {
                                    labels: displayLabels,
                                    datasets: [{
                                        label: 'Swing Arm Data',
                                        backgroundColor: '#C88FFA',
                                        borderColor: '#C88FFA',
                                        borderWidth: 1,
                                        //hoverBackgroundColor: '#FF6384',
                                        //hoverBorderColor: '#FF6384',
                                        data: displayDatasets
                                    }]
                                };
                                this.myChart.update();
                                this.setState({loading: false});
                            }
                        }
                    } else {
                        let displayLabels = ["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h", "23h", "24h"];
                        let displayDatasets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        this.myChart.data = {
                            labels: displayLabels,
                            datasets: [{
                                label: 'Swing Arm Data',
                                backgroundColor: '#C88FFA',
                                borderColor: '#C88FFA',
                                borderWidth: 1,
                                //hoverBackgroundColor: '#FF6384',
                                //hoverBorderColor: '#FF6384',
                                data: displayDatasets
                            }]
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


const mapStateToProps = (state) => ({
    globalDateFilter: state.globalDateFilter
});

export default connect(mapStateToProps)(SwingArmMachine);
