/* eslint-disable no-underscore-dangle,react/no-did-mount-set-state */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Chart,Line} from 'react-chartjs-2';
import zoom from "chartjs-plugin-zoom";
const initialState = {
    labels: ['0', '1', '2', '3', '4', '5', '6'],
    datasets: [
        {
            label: 'Line 1',
            backgroundColor: '#71D7BE',
            borderColor: '#71D7BE',
            borderWidth: 1,
            hoverBackgroundColor: '#FF00FF',
            hoverBorderColor: '#FF00FF',
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            tension: 0,
        }, {
            label: 'Line 2',
            backgroundColor: '#F89D9D',
            borderColor: '#F89D9D',
            borderWidth: 1,
            hoverBackgroundColor: '#FF00FF',
            hoverBorderColor: '#FF00FF',
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            tension: 0,
        }, {
            label: 'Line 3',
            backgroundColor: '#FF9C64',
            borderColor: '#FF9C64',
            borderWidth: 1,
            hoverBackgroundColor: '#FF00FF',
            hoverBorderColor: '#FF00FF',
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            tension: 0,
        }, {
            label: 'Line 4',
            backgroundColor: '#EB6A91',
            borderColor: '#EB6A91',
            borderWidth: 1,
            hoverBackgroundColor: '#FF00FF',
            hoverBorderColor: '#FF00FF',
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            tension: 0,
        }, {
            label: 'Line 5',
            backgroundColor: '#F575F7',
            borderColor: '#F575F7',
            borderWidth: 1,
            hoverBackgroundColor: '#FF00FF',
            hoverBorderColor: '#FF00FF',
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            tension: 0,
        }, {
            label: 'Line 6',
            backgroundColor: '#8C67F6',
            borderColor: '#8C67F6',
            borderWidth: 1,
            hoverBackgroundColor: '#FF00FF',
            hoverBorderColor: '#FF00FF',
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            tension: 0,
        }, {
            label: 'Line 7',
            backgroundColor: '#449AFF',
            borderColor: '#449AFF',
            borderWidth: 1,
            hoverBackgroundColor: '#FF00FF',
            hoverBorderColor: '#FF00FF',
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            tension: 0,
        }, {
            label: 'Line 8',
            backgroundColor: '#46D6EA',
            borderColor: '#46D6EA',
            borderWidth: 1,
            hoverBackgroundColor: '#FF00FF',
            hoverBorderColor: '#FF00FF',
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            tension: 0,
        }
    ],

};

const options = {
    legend: {
        position: 'bottom',
    },
    fill: false,
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: 'HH:mm',
                    // round: 'day'
                    tooltipFormat: 'h:mm:ss'
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Date'
                },
                ticks: {
                    maxRotation: 0
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    color: 'rgb(204, 204, 204)',
                    borderDash: [3, 3],
                },
                ticks: {
                    fontColor: 'rgb(204, 204, 204)',
                },
            },
        ],
    },
    zoom: {
        enabled: true,
        drag: true,
        mode: 'x',
        limits: {
            max: 10,
            min: 0.5
        }
    }
};

class TemperatureTrendLine extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: initialState,
        };
    }
    static getDerivedStateFromProps(props, state){
        Chart.plugins.register(zoom)
        return null;
    }
    render() {
        let {tempData} = this.props;
        let {data} = this.state;
        if (tempData && tempData.length > 0) {
            let updatedData = {
                labels: ['0', '1', '2', '3', '4', '5', '6'],
                datasets: [
                    {
                        label: 'Line 1',
                        backgroundColor: '#71D7BE',
                        borderColor: '#71D7BE',
                        borderWidth: 1,
                        hoverBackgroundColor: '#FF00FF',
                        hoverBorderColor: '#FF00FF',
                        data: tempData[0],
                        fill: false,
                        tension: 0,
                    }, {
                        label: 'Line 2',
                        backgroundColor: '#F89D9D',
                        borderColor: '#F89D9D',
                        borderWidth: 1,
                        hoverBackgroundColor: '#FF00FF',
                        hoverBorderColor: '#FF00FF',
                        data: tempData[1],
                        fill: false,
                        tension: 0,
                    }, {
                        label: 'Line 3',
                        backgroundColor: '#FF9C64',
                        borderColor: '#FF9C64',
                        borderWidth: 1,
                        hoverBackgroundColor: '#FF00FF',
                        hoverBorderColor: '#FF00FF',
                        data: tempData[2],
                        fill: false,
                        tension: 0,
                    }, {
                        label: 'Line 4',
                        backgroundColor: '#EB6A91',
                        borderColor: '#EB6A91',
                        borderWidth: 1,
                        hoverBackgroundColor: '#FF00FF',
                        hoverBorderColor: '#FF00FF',
                        data: tempData[3],
                        fill: false,
                        tension: 0,
                    }, {
                        label: 'Line 5',
                        backgroundColor: '#F575F7',
                        borderColor: '#F575F7',
                        borderWidth: 1,
                        hoverBackgroundColor: '#FF00FF',
                        hoverBorderColor: '#FF00FF',
                        data: tempData[4],
                        fill: false,
                        tension: 0,
                    }, {
                        label: 'Line 6',
                        backgroundColor: '#8C67F6',
                        borderColor: '#8C67F6',
                        borderWidth: 1,
                        hoverBackgroundColor: '#FF00FF',
                        hoverBorderColor: '#FF00FF',
                        data: tempData[5],
                        fill: false,
                        tension: 0,
                    }, {
                        label: 'Line 7',
                        backgroundColor: '#449AFF',
                        borderColor: '#449AFF',
                        borderWidth: 1,
                        hoverBackgroundColor: '#FF00FF',
                        hoverBorderColor: '#FF00FF',
                        data: tempData[6],
                        fill: false,
                        tension: 0,
                    }, {
                        label: 'Line 8',
                        backgroundColor: '#46D6EA',
                        borderColor: '#46D6EA',
                        borderWidth: 1,
                        hoverBackgroundColor: '#FF00FF',
                        hoverBorderColor: '#FF00FF',
                        data: tempData[7],
                        fill: false,
                        tension: 0,
                    }
                ],
            };
            data = updatedData;
        }
        return (
            <Line height={65} data={data} options={options}/>
        );
    }
}

const mapStateToProps = state => {
    return {
        globalFilter: state.globalFilter,
        socket: state.login.socket,
    }
}

export default connect(mapStateToProps, null)(
    TemperatureTrendLine
)
