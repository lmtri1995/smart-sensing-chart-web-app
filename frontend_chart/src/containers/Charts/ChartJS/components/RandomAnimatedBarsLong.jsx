import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {changeGlobalDateFilter} from "../../../../redux/actions/globalDateFilterActions";
import 'chartjs-plugin-zoom';
import Chart from 'chart.js';
import moment from 'moment';

const initialData = {
    labels: [
        moment().subtract(6, "days").format('YYYY/MM/DD'),
        moment().subtract(5, "days").format('YYYY/MM/DD'),
        moment().subtract(4, "days").format('YYYY/MM/DD'),
        moment().subtract(3, "days").format('YYYY/MM/DD'),
        moment().subtract(2, "days").format('YYYY/MM/DD'),
        moment().subtract(1, "days").format('YYYY/MM/DD'),
        moment().format('YYYY/MM/DD'),
    ],
    datasets: [
        {
            label: "Type 1",
            backgroundColor: "#FF9C64",
            data: [48, 26, 43, 18, 30, 34, 33]
        },
        {
            label: "Type 2",
            backgroundColor: "#46D6EA",
            data: [42, 40, 40, 48, 18, 50, 28]
        },
        {
            label: "Type 3",
            backgroundColor: "#F575F7",
            data: [9, 33, 39, 35, 32, 53, 30]
        },
        {
            label: "Type 4",
            backgroundColor: "#8C67F6",
            data: [30, 26, 28, 27, 24, 31, 40]
        },
        {
            label: "Total Defect",
            borderColor: '#EB6A91',
            borderWidth: 2,
            pointRadius: 0,
            pointBorderWidth: 2,
            pointBackgroundColor: '#EBEDF1',
            pointBorderColor: '#EB6A91',
            data: [129, 125, 150, 128, 104, 168, 131],

            // Changes this dataset to become a line
            type: 'line',
            fill: false,
            tension: 0,
        }
    ]
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
                    color: '#696F76',
                    display: true,
                    drawBorder: false,
                    zeroLineColor: '#696F76',
                },
                ticks: {
                    beginAtZero: true,
                    fontColor: 'rgb(204, 204, 204)',
                },
            },
        ],
    },
    zoom: {
        enabled: true,
        mode: 'x'
    }
};

class RandomAnimatedBarsLong extends PureComponent {

    changeGlobalDateFilter = (startDate, endDate) => {
        this.props.dispatch(changeGlobalDateFilter(startDate, endDate));
    };

    componentDidMount() {
        const ctx = this.refs.canvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: initialData,
            options: options
        });
        setInterval(() => {
            let random, totalDefect;
            for (let i = 0, length = initialData.datasets[0].data.length; i < length; ++i) {
                totalDefect = 0;
                for (let j = 0, datasetLength = initialData.datasets.length - 1; j < datasetLength; ++j) {
                    random = Math.floor(Math.random() * 100) + 1;
                    initialData.datasets[j].data[i] = random;

                    totalDefect += random;
                }
                initialData.datasets[initialData.datasets.length - 1].data[i] = totalDefect;
            }
            new Chart(ctx, {
                type: 'bar',
                data: initialData,
                options: options
            });
        }, 5000);
    }

    render() {
        return (
            <canvas ref="canvas"/>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        globalFilter: state.globalFilter,
    }
};

export default connect(mapStateToProps, null)(RandomAnimatedBarsLong)
