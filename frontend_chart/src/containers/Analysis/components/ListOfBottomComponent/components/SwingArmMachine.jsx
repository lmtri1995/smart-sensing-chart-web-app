import React, {Component} from 'react'
import Singleton from "../../../../../services/Socket";
import moment from "moment";
import {ClipLoader} from "react-spinners";
import API from "../../../../../services/api";
import connect from "react-redux/es/connect/connect";
import {pluginDrawZeroValue} from "../../../../../shared/utils/plugins";
import {changeNumberFormat} from "../../../../../shared/utils/Utilities";

const initialData = {
    labels: ["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h", "23h", "24h"],
    datasets: [
        {
            label: 'Swing Arm',
            backgroundColor: '#C88FFA',
            borderColor: '#C88FFA',
            borderWidth: 1,
            //hoverBackgroundColor: '#FF6384',
            //hoverBorderColor: '#FF6384',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
                    callback: function(label, index, labels) {
                        if (label.toString().includes('h')){
                            return label;
                        } else {
                            return moment.unix(label).format("DD/MM/YYYY");
                        }
                    }
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

        this.flag = 'H';
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

    componentWillUnmount(){

    }

    isFilterByHourOrDate = (fromTime, toTime) => {
        let result = 'H';
        if (fromTime && toTime){
            let diff = moment(toTime).diff(moment(fromTime), 'days');
            if (diff > 1){
                result = 'D';
            }
        }
        return result;
    }

    initDateBetweenLabelArray = (fromTime, toTime) => {
        let dateArray = new Array(),
            fromDate = new Date(fromTime),
            toDate = new Date(toTime);
            toDate.setDate(toDate.getDate() - 1);
        while (fromDate <= toDate) {
            dateArray.push(moment(fromDate).unix());
            fromDate.setDate(fromDate.getDate() + 1);
        }
        this.labels = dateArray;
    }

    initHourLabelArray = _ => {
        this.labels = ["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h", "23h", "24h"];
    }

    initDataArray = _ => {
        this.data = [];
        for (let i = 0; i < this.labels.length; i++){
            this.data.push(0);
        }
    }

    initArrayForLabelAndData = (flag = 'H', fromTime, toTime) => {
        switch (flag) {
            case 'H':
                this.labelArray = this.initHourLabelArray();
                break;
            case 'D':
                this.labelArray = this.initDateBetweenLabelArray(fromTime, toTime);
                break;
        }
        this.initDataArray();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            if (this.role == 'os'){
                this.setState({loading: true});
                let {startDate, endDate} = this.props.globalDateFilter;

                this.flag = this.isFilterByHourOrDate(startDate, endDate);
                this.initArrayForLabelAndData(this.flag, startDate, endDate);

                let fromTimeDevice = moment(startDate.toISOString()).unix();
                let toTimedevice   = moment(endDate.toISOString()).unix();

                let param = {
                    "from_timedevice": fromTimeDevice,
                    "to_timedevice": toTimedevice,
                    "flag": this.flag
                };
                console.log("param: ", param);
                API('api/os/swingarm', 'POST', param)
                    .then((response) => {
                        if (response && response.data){
                            let dataArray = response.data.data;
                            if (dataArray && dataArray.length > 0){
                                let returnData = JSON.parse(dataArray[0].data);
                                if (returnData && returnData.length > 0) {
                                    this.handleDisplayArray(returnData);

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
                                        }]
                                    };
                                    this.myChart.update();
                                    this.setState({loading: false});
                                }
                            } else {
                                this.handleFailedReturn();
                            }
                        } else {
                            this.handleFailedReturn();
                        }
                    })
                    .catch((err) => console.log('err:', err))
            }
        }
    }

    handleFailedReturn = () => {
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
            }]
        };
        this.myChart.update();
        this.setState({loading: false});
    }

    handleDisplayArray = (returnData) => {
        for (let i = 0; i < this.labels.length; i++){
            for (let j = 0; j < returnData.length; j++){
                if(moment.unix(this.labels[i]).format("DDMMYYYY") == moment.unix(returnData[j][0]).format("DDMMYYYY")){
                    this.data[i] = parseFloat(returnData[j][1]);
                }
            }
        }
    }
    
    componentDidMount() {
        const ctx = this.canvas.getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'bar',
            data: initialData,
            options: options,
            plugins: pluginDrawZeroValue,
        });

        if (this.role == 'ip'){
            this.setState({loading: false});
        } else {
            let {startDate, endDate} = this.props.globalDateFilter;

            this.flag = this.isFilterByHourOrDate(startDate, endDate);
            this.initArrayForLabelAndData(this.flag, startDate, endDate);

            let fromTimeDevice = moment(startDate.toISOString()).unix();
            let toTimedevice   = moment(endDate.toISOString()).unix();

            let param = {
                "from_timedevice": fromTimeDevice,
                "to_timedevice": toTimedevice,
                flag: this.flag
            };
            console.log("param: ", param);
            API('api/os/swingarm', 'POST', param)
                .then((response) => {
                    console.log("response 314: ", response);
                    if (response && response.data){
                        let dataArray = response.data.data;
                        if (dataArray && dataArray.length > 0){
                            let returnData = JSON.parse(dataArray[0].data);
                            if (returnData && returnData.length > 0) {
                                this.handleDisplayArray(returnData);
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
                                    }]
                                };
                                this.myChart.update();
                                this.setState({loading: false});
                            }
                        } else {
                            this.handleFailedReturn();
                        }
                    } else {
                        this.handleFailedReturn();
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
