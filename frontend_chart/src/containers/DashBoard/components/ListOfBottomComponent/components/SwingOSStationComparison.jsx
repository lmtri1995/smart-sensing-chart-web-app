import React, {Component} from 'react'
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
                ticks: {
                    fontColor: 'rgb(204, 204, 204)',
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    color: 'rgb(204, 204, 204)',
                },
                ticks: {
                    fontColor: 'rgb(204, 204, 204)',
                },
            },
        ],
    },
};

export class SwingArmMachine extends Component {
    constructor() {
        super();
        this.state = {
            data: initialState,
            intervalId: null,
        };
    }

    render() {
        return (
            <div className="oee-main">
                <div className="col-12"><h4>Station Comparison</h4></div>
                <Bar height={65} data={this.state.data} options={options}/>
            </div>
        )
    }
}

export default SwingArmMachine
