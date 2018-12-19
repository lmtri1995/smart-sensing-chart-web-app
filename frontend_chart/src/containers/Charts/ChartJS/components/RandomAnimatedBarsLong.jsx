/* eslint-disable no-underscore-dangle,react/no-did-mount-set-state */
import React, {PureComponent} from 'react';
import {Bar} from 'react-chartjs-2';

const initialState = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: '#FF6384',
            borderColor: '#FF6384',
            borderWidth: 1,
            hoverBackgroundColor: '#FF6384',
            hoverBorderColor: '#FF6384',
            data: [65, 59, 80, 81, 56, 55, 45],
        },
    ],
};

const options = {
    legend: {
        position: 'bottom',
    },
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
    },
};

class RandomAnimatedBarsLong extends PureComponent {
    constructor() {
        super();
        this.state = {
            data: initialState,
            intervalId: null,
        };
    }

    componentDidMount() {
        const _this = this;

        const intervalId = setInterval(() => {
            const oldDataSet = _this.state.data.datasets[0];
            const newData = [];

            for (let x = 0; x < _this.state.data.labels.length; x += 1) {
                newData.push(Math.floor(Math.random() * 100));
            }

            const newDataSet = {
                ...oldDataSet,
            };

            newDataSet.data = newData;

            const newState = {
                ...initialState,
                data: {
                    datasets: [newDataSet],
                    labels: _this.state.data.labels,
                },
            };

            _this.setState(newState);
        }, 4000);

        this.setState({intervalId});
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    render() {
        return (
            <Bar height={65} data={this.state.data} options={options}/>
        );
    }
}

export default RandomAnimatedBarsLong;
