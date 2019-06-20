import React, {Component} from 'react';
import Singleton from "../../../../../services/Socket";
import API from "../../../../../services/api";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import {ClipLoader} from "react-spinners";
import {
    changeNumberFormat,
    specifySelectedShiftNo
} from "../../../../../shared/utils/Utilities";
import {pluginDrawZeroLine} from "../../../../../shared/utils/plugins";
import {ARTICLE_NAMES, MODEL_NAMES} from "../../../../../constants/constants";

let initialData = {
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

        if (this.role == 'ip') {
            initialData = {
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
                ],
            };
        }
    }

    handleReturnData = (returnData) => {
        let result = [];
        let idleCycleArray = [0, 0, 0], deffectiveArray = [0, 0, 0];
        if (returnData && returnData.length > 0) {
            returnData.map(item => {
                if (item) {
                    if (item[0] === 1) {
                        deffectiveArray[0] = item[1];
                        idleCycleArray[0] = item[2];
                    } else if (item[0] === 2) {
                        deffectiveArray[1] = item[1];
                        idleCycleArray[1] = item[2];
                    } else if (item[0] === 3) {
                        deffectiveArray[2] = item[1];
                        idleCycleArray[2] = item[2];
                    }
                }
            });
        }
        result.push(deffectiveArray);
        if (this.role != 'ip') {
            result.push(idleCycleArray);
        }
        return result;

    }

    displayData = (displayArray) => {
        let labelArray = ['Shift 1', 'Shift 2', 'Shift 3'];
        let dataset = {};
        if (this.role == 'ip') {
            dataset = [
                {
                    label: 'Defective',
                    backgroundColor: '#4C9EFF',
                    borderColor: '#4C9EFF',
                    borderWidth: 1,
                    //hoverBackgroundColor: '#FF6384',
                    //hoverBorderColor: '#FF6384',
                    data: displayArray[0],
                }
            ];
            this.myChart.data = {
                labels: labelArray,
                datasets: dataset
            };
            this.myChart.update();
            this.setState({loading: false});
        } else {
            let newSelectedArticle = this.props.globalArticleFilter.selectedArticle;
            let articleKey = '';
            if (newSelectedArticle) {
                articleKey = newSelectedArticle[0] === ARTICLE_NAMES.keys().next().value ? '' : newSelectedArticle[0];
            }
            let newSelectedModel = this.props.globalModelFilter.selectedModel;
            let modelName = '';
            if (newSelectedModel) {
                modelName = newSelectedModel[0] === MODEL_NAMES.keys().next().value ? '' : newSelectedModel[0];
            }

            let {startDate, endDate} = this.props.globalDateFilter;
            startDate = moment(startDate).format("YYYYMMDD");
            endDate = moment(endDate).format("YYYYMMDD");

            let param1 = {
                "from_workdate": startDate,
                "to_workdate": endDate,
                "modelname": modelName,
                "articleno": articleKey
            };
            console.log("param1: ", param1);
            API(`api/os/sap`, 'POST', param1).then((response1) => {
                console.log("response1: ", response1);
                try {
                    let responseArray = response1.data.data;
                    let sapData = [0, 0, 0];
                    responseArray.map(item => {
                        if (item.SHIFT_NO == '1') {
                            sapData[0] = item.sap;
                        } else if (item.SHIFT_NO == '2') {
                            sapData[1] = item.sap;
                        } else if (item.SHIFT_NO == '3') {
                            sapData[2] = item.sap;
                        }
                    });
                    displayArray[1][0] -= sapData[0];
                    displayArray[1][1] -= sapData[1];
                    displayArray[1][2] -= sapData[2];

                    dataset = [
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
                    ];

                    this.myChart.data = {
                        labels: labelArray,
                        datasets: dataset
                    };
                    this.myChart.update();
                    this.setState({loading: false});
                } catch (e) {
                    console.log("Error: ", e);
                }
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
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
                "istatus": this.istatus,
                "proccess": this.process,
                "shiftno": selectedShift,
                "modelname": '',
                "articleno": articleKey
            };
            this.setState({
                loading: true,
            });
            API(this.apiUrl, 'POST', param)
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

    componentDidMount() {
        const ctx = this.canvas.getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'bar',
            data: initialData,
            options: options,
            plugins: pluginDrawZeroLine
        });

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
            "istatus": this.istatus,
            "proccess": this.process,
            "shiftno": selectedShift,
            "modelname": '',
            "articleno": articleKey
        };
        API(this.apiUrl, 'POST', param)
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
    globalModelFilter: state.globalModelFilter,
});

export default connect(mapStateToProps)(CycleDefectStationComparison);
