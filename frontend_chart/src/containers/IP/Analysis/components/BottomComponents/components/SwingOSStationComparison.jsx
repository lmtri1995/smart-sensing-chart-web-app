import React, {Component}                           from 'react'
import Singleton                                    from "../../../../../../services/Socket";
import {ClipLoader}                                 from "react-spinners";
import API                                          from "../../../../../../services/api";
import connect                                      from "react-redux/es/connect/connect";
import moment                                       from "moment";
import {pluginDrawZeroLineForSwingArmOsPress}       from "../../../../../../shared/utils/plugins";
import {changeNumberFormat, specifySelectedShiftNo} from "../../../../../../shared/utils/Utilities";
import {ARTICLE_NAMES}                              from "../../../../../../constants/constants";

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
        let result = [];
        let swingArmArray = [0, 0, 0], osPessArray = [0, 0, 0];
        console.log("returnData: ", returnData);
        if (returnData && returnData.length > 0) {
            returnData.map(item => {
                    if (item[0] == 1) {
                        swingArmArray[0] = item[1]?item[1]:0;
                        osPessArray[0] = item[2]?item[2]:0;
                    } else if (item[0] == 2) {
                        swingArmArray[1] = item[1]?item[1]:0;
                        osPessArray[1] = item[2]?item[2]:0;
                    } else if (item[0] == 3) {
                        swingArmArray[2] = item[1]?item[1]:0;
                        osPessArray[2] = item[2]?item[2]:0;
                    }

                }
            )
        }

        result.push(swingArmArray);
        result.push(osPessArray);
        return result;

    }

    componentWillUnmount() {

    }

    displayData = (displayArray) => {
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
        this.myChart.options.tooltips = {
            callbacks: {
                label: function (tooltipItem, data) {
                    var value = tooltipItem.yLabel;
                    var label = data.labels[tooltipItem.index];
                    return label + ': ' + value;
                }
            }
        };
        this.myChart.update();
        this.setState({loading: false});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            if (this.role == 'os') {
                let {startDate, endDate} = this.props.globalDateFilter;
                let fromTimeDevice = moment(startDate.toISOString()).unix();
                let toTimedevice = moment(endDate.toISOString()).unix();
                let selectedShift = this.props.globalShiftFilter.selectedShift;
                selectedShift = specifySelectedShiftNo(selectedShift);
                let newSelectedArticle = this.props.globalArticleFilter.selectedArticle;
                let articleKey = '';
                if (newSelectedArticle) {
                    articleKey = newSelectedArticle[0] === ARTICLE_NAMES.keys().next().value ? '' : newSelectedArticle[0];
                }

                let param = {
                    "from_timedevice": fromTimeDevice,
                    "to_timedevice": toTimedevice,
                    "shiftno": selectedShift,
                    "modelname": '',
                    "articleno": articleKey
                };
                this.setState({
                    loading: true,
                });
                API('api/os/stationcomparision', 'POST', param)
                    .then((response) => {
                        try {
                            let dataArray = response.data.data;
                            let returnData = JSON.parse(dataArray[0].data);
                            let displayArray = this.handleReturnData(returnData);
                            this.displayData(displayArray);
                        } catch (e) {
                            let displayArray = this.handleReturnData();
                            this.displayData(displayArray);
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
            plugins: pluginDrawZeroLineForSwingArmOsPress
        });

        if (this.role == 'os') {
            let {startDate, endDate} = this.props.globalDateFilter;
            let fromTimeDevice = moment(startDate.toISOString()).unix();
            let toTimedevice = moment(endDate.toISOString()).unix();
            let selectedShift = this.props.globalShiftFilter.selectedShift;
            selectedShift = specifySelectedShiftNo(selectedShift);

            let newSelectedArticle = this.props.globalArticleFilter.selectedArticle;
            let articleKey = '';
            if (newSelectedArticle) {
                articleKey = newSelectedArticle[0] === ARTICLE_NAMES.keys().next().value ? '' : newSelectedArticle[0];
            }

            let param = {
                "from_timedevice": fromTimeDevice,
                "to_timedevice": toTimedevice,
                "shiftno": selectedShift,
                "modelname": '',
                "articleno": articleKey
            };
            API('api/os/stationcomparision', 'POST', param)
                .then((response) => {
                    try {
                        let dataArray = response.data.data;
                        let returnData = JSON.parse(dataArray[0].data);
                        let displayArray = this.handleReturnData(returnData);
                        this.displayData(displayArray);
                    } catch (e) {
                        let displayArray = this.handleReturnData();
                        this.displayData(displayArray);
                    }
                })
                .catch((err) => console.log('err:', err))
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

const mapStateToProps = (state) => ({
    globalDateFilter: state.globalDateFilter,
    globalShiftFilter: state.globalShiftFilter,
    globalArticleFilter: state.globalArticleFilter,
});

export default connect(mapStateToProps)(SwingArmMachine);
