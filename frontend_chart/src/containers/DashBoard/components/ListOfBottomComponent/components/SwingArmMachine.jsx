import React, {Component} from 'react'
import Singleton from "../../../../../services/Socket";
import {ClipLoader} from "react-spinners";
import {pluginDrawZeroValue} from "../../../../../shared/utils/plugins";

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
                var value = data.datasets[0].data[tooltipItem.index];
                var label = data.labels[tooltipItem.index];

                if (value === 0) {
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

        switch (this.role) {
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

        this.state = {
            loading: true
        };
    }

    handleReturnData = (returnData) => {
        if (returnData && returnData.length > 0) {
            returnData.map(item => {
                this.labels.push(item[0] + 'h');
                this.datasets.push(item[1]);
            });
        }
    }

    componentWillUnmount() {
        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                from_timedevice: 0,
                to_timedevice: 0,
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
            options: options,
            plugins: pluginDrawZeroValue,
        });
        if (this.role == "ip") {
            this.setState({loading: false});
        } else {
            this.socket.emit(this.emitEvent, {
                msg: {
                    event: this.eventListen,
                    from_timedevice: 0,
                    to_timedevice: 0,
                    minute: 60,
                    status: 'start'
                }
            });
            this.socket.on(this.eventListen, (response) => {
                response = JSON.parse(response);
                let dataArray = response.data;
                let returnData = JSON.parse(dataArray[0].data);
                //this.handleReturnData(returnData);
                if (returnData && returnData.length > 0) {
                    //Make sure that the length is more than 15
                    let displayLabels = ["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h", "23h", "24h"];
                    let displayDatasets = returnData[0];

                    /*if (displayDatasets && displayDatasets.length < 1) {
                        displayDatasets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    }
                    for (let i = 0; i < displayDatasets.length; i++) {
                        if (!displayDatasets[i] || displayDatasets[i] == 0) {
                            displayDatasets[i] = 0;
                        }
                    }*/
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
                        }],
                    };
                    this.myChart.update();
                    this.setState({loading: false});
                }

            });
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
