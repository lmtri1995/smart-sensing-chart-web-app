import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Bar} from 'react-chartjs-2';
import {changeGlobalFilter} from "../../../../redux/actions/globalFilterActions";
import Singleton from '../../../../services/Socket';
import moment from 'moment';
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
    zoom: {
        enabled: true,
        mode: 'xy'
    }
};

class RandomAnimatedBarsLong extends PureComponent {
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

    componentDidMount() {

        let loginData = JSON.parse(localStorage.getItem('logindata'));
        let token = loginData.token;
        let socket = Singleton.getInstance(token);

        var mDateFrom = moment.utc([2019, 0 , 2, 10, 6, 40]);
        var uDateFrom = mDateFrom.unix();
        console.log("uDateFrom: ", uDateFrom);
        var mDateTo = moment.utc([2019, 0 , 2, 10, 6, 43]);
        var uDateTo = mDateTo.unix();
        console.log("uDateTo: ", uDateTo);

        socket.on('token', function(data){
            console.log(data);
        });

        socket.emit('ip', {msg: {event: "1080",from_timedevice:0,to_timedevice:0,minute:30}});
        socket.on('1080', function(data){
            // // // console.log("ip");
            console.log("1080:---------", data);
        });
    }

    componentWillUnmount() {
        let socket = Singleton.getInstance();
        socket.removeListener('van');
    }

    render() {
        console.log("props render: ", this.props);
        return (
            <Bar height={65} data={this.state.data} options={options}/>
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
    RandomAnimatedBarsLong
)
