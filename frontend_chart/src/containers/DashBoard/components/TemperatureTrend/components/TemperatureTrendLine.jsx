/* eslint-disable no-underscore-dangle,react/no-did-mount-set-state */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Line} from 'react-chartjs-2';

const initialState = {
    labels: ['0', '1', '2', '3', '4', '5', '6'],
    datasets: [
        {
            label: 'Line 1',
            backgroundColor: '#449AFF',
            borderColor: '#449AFF',
            borderWidth: 1,
            hoverBackgroundColor: '#FF00FF',
            hoverBorderColor: '#FF00FF',
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            tension: 0,
        }, {
            label: 'Line 2',
            backgroundColor: '#449AFF',
            borderColor: '#449AFF',
            borderWidth: 1,
            hoverBackgroundColor: '#FF00FF',
            hoverBorderColor: '#FF00FF',
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            tension: 0,
        }, {
            label: 'Line 3',
            backgroundColor: '#449AFF',
            borderColor: '#449AFF',
            borderWidth: 1,
            hoverBackgroundColor: '#FF00FF',
            hoverBorderColor: '#FF00FF',
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            tension: 0,
        }, {
            label: 'Line 4',
            backgroundColor: '#449AFF',
            borderColor: '#449AFF',
            borderWidth: 1,
            hoverBackgroundColor: '#FF00FF',
            hoverBorderColor: '#FF00FF',
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            tension: 0,
        }, {
            label: 'Line 5',
            backgroundColor: '#449AFF',
            borderColor: '#449AFF',
            borderWidth: 1,
            hoverBackgroundColor: '#FF00FF',
            hoverBorderColor: '#FF00FF',
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            tension: 0,
        }, {
            label: 'Line 6',
            backgroundColor: '#449AFF',
            borderColor: '#449AFF',
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
            backgroundColor: '#449AFF',
            borderColor: '#449AFF',
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
                gridLines: {
                    color: 'rgb(204, 204, 204)',
                    borderDash: [3, 3],
                },
                ticks: {
                    fontColor: 'rgb(204, 204, 204)',
                },
            },
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
    }
};

class TemperatureTrendLine extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: initialState,
        };
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
                        backgroundColor: '#FFFFCC',
                        borderColor: '#FFFFCC',
                        borderWidth: 1,
                        hoverBackgroundColor: '#FF00FF',
                        hoverBorderColor: '#FF00FF',
                        data: tempData[0],
                        fill: false,
                        tension: 0,
                    }, {
                        label: 'Line 2',
                        backgroundColor: '#99FFCC',
                        borderColor: '#99FFCC',
                        borderWidth: 1,
                        hoverBackgroundColor: '#FF00FF',
                        hoverBorderColor: '#FF00FF',
                        data: tempData[1],
                        fill: false,
                        tension: 0,
                    }, {
                        label: 'Line 3',
                        backgroundColor: '#FF9900',
                        borderColor: '#FF9900',
                        borderWidth: 1,
                        hoverBackgroundColor: '#FF00FF',
                        hoverBorderColor: '#FF00FF',
                        data: tempData[2],
                        fill: false,
                        tension: 0,
                    }, {
                        label: 'Line 4',
                        backgroundColor: '#339900',
                        borderColor: '#339900',
                        borderWidth: 1,
                        hoverBackgroundColor: '#FF00FF',
                        hoverBorderColor: '#FF00FF',
                        data: tempData[3],
                        fill: false,
                        tension: 0,
                    }, {
                        label: 'Line 5',
                        backgroundColor: '#FF3366',
                        borderColor: '#FF3366',
                        borderWidth: 1,
                        hoverBackgroundColor: '#FF00FF',
                        hoverBorderColor: '#FF00FF',
                        data: tempData[4],
                        fill: false,
                        tension: 0,
                    }, {
                        label: 'Line 6',
                        backgroundColor: '#449AFF',
                        borderColor: '#449AFF',
                        borderWidth: 1,
                        hoverBackgroundColor: '#FF00FF',
                        hoverBorderColor: '#FF00FF',
                        data: tempData[5],
                        fill: false,
                        tension: 0,
                    }, {
                        label: 'Line 7',
                        backgroundColor: '#FFFF00',
                        borderColor: '#FFFF00',
                        borderWidth: 1,
                        hoverBackgroundColor: '#FF00FF',
                        hoverBorderColor: '#FF00FF',
                        data: tempData[6],
                        fill: false,
                        tension: 0,
                    }, {
                        label: 'Line 8',
                        backgroundColor: '#336666',
                        borderColor: '#336666',
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
