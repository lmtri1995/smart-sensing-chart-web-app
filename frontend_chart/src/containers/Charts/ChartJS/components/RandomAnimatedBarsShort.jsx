/* eslint-disable no-underscore-dangle,react/no-did-mount-set-state */
import React, {PureComponent} from 'react';
import {Bar} from 'react-chartjs-2';
import Singleton from "../../../../services/Socket";
import moment from "moment";

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

class RandomAnimatedBarsShort extends PureComponent {
    constructor() {
        super();
        this.state = {
            data: initialState,
            intervalId: null,
        };
    }

    componentDidMount() {

    ////////////////////////////////////////////////
        ////Test 2 diff emits
        let loginData = JSON.parse(localStorage.getItem('logindata'));
        let token = loginData.token;
        let socket = Singleton.getInstance(token);

        var mDateFrom = moment.utc([2019, 0 , 2, 10, 6, 40]);
        var uDateFrom = mDateFrom.unix();
        console.log("uDateFrom: ", uDateFrom);
        var mDateTo = moment.utc([2019, 0 , 2, 10, 6, 43]);
        var uDateTo = mDateTo.unix();
        console.log("uDateTo: ", uDateTo);
        socket.emit('ip', {msg: {event: 'tri', from_timedevice: "", to_timedevice: "", minute: 30}});

        socket.on('tri', (data) => {
            console.log("data 112: ", data);
            console.log("typeof data: ", typeof(data));
        });
        /*socket.emit('ClientName','trile');
        socket.on("FromAPI", data => {
            console.log(data)
           // this.setState({ response: data.toString() })
        });*/

        socket.on('token', (data) => {
            let tokenObject = JSON.parse(data);
            if (!tokenObject.success) {
                console.log('Token is expired');
                window.location.href = ("/logout");
            }
        });
        //End of testing
        /////////////////////////

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
            <Bar data={this.state.data} options={options}/>
        );
    }
}

export default RandomAnimatedBarsShort;
