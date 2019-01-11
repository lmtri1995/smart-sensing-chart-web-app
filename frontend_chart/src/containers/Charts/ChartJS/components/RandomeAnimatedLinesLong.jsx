/* eslint-disable no-underscore-dangle,react/no-did-mount-set-state */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Line} from 'react-chartjs-2';
import {changeGlobalFilter} from "../../../../redux/actions/globalFilterActions";
import Singleton from '../../../../services/Socket';
import 'chartjs-plugin-zoom';

const initialState = {
    labels: ['0', '1', '2', '3', '4', '5', '6'],
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
    fill:false,
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
    zoom:{
        enabled:true,
        mode:'xy'
    }
};

class RandomAnimatedLinesLong extends PureComponent {
    constructor() {
        super();
        this.state = {
            data: initialState,
            intervalId: null,
            startDate: null,
            endDate: null,
        };
    }

    changeGlobalFilter = (startDate, endDate) => {
        this.props.dispatch(changeGlobalFilter(startDate, endDate));
    }

    componentWillUnmount() {
        let socket = Singleton.getInstance();
        socket.removeListener('truong');
    }

    componentDidMount() {
        let loginData = JSON.parse(localStorage.getItem('logindata'));
        let token = loginData.token;
        let socket = Singleton.getInstance(token);

        /*socket.emit('ip', {msg: {event: 'truong', from_timedevice: "", to_timedevice: ""}});
        socket.on('token', (data) => {
            let tokenObject = JSON.parse(data);
            if (!tokenObject.success) {
                console.log('Token is expired');
                window.location.href = ("/logout");
            }
        });


        socket.on('truong', (data) => {
            console.log("data 87: ", data);
        });*/
    }

    render() {
        console.log("props render: ", this.props);
        return (
            <Line height={65} data={this.state.data} options={options}/>
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
    RandomAnimatedLinesLong
)
