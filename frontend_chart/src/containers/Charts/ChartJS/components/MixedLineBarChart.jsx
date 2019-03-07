import React, {PureComponent} from 'react';
import 'chartjs-plugin-zoom';
import Chart from 'chart.js';
import moment from 'moment';

let initialData = {
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
            data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
            label: "Type 2",
            backgroundColor: "#46D6EA",
            data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
            label: "Type 3",
            backgroundColor: "#F575F7",
            data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
            label: "Type 4",
            backgroundColor: "#8C67F6",
            data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
            label: "Total Defect",
            borderColor: '#EB6A91',
            borderWidth: 2,
            pointRadius: 0,
            pointBorderWidth: 2,
            pointBackgroundColor: '#EBEDF1',
            pointBorderColor: '#EB6A91',
            data: [0, 0, 0, 0, 0, 0, 0],

            // Changes this dataset to become a line
            type: 'line',
            fill: false,
            tension: 0,
        }
    ]
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
                    fontColor: '#FFFFFF',
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
                    fontColor: '#868D93',
                },
            },
        ],
    },
};

export default class MixedLineBarChart extends PureComponent {

    constructor(props) {
        super(props);

        this.canvas = null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            let {labels, data, customTooltips} = this.props;
            if (labels && data && this.canvas) {
                // These don't work
                // this.myChart.data.labels = labels;
                // this.myChart.data.datasets = data;

                // These don't work either
                // this.myChart.config.data.labels = labels;
                // this.myChart.config.data.datasets = data;

                // This works
                // this.myChart.config.data = {
                //     labels: labels,
                //     datasets: data
                // };
                // This works too
                this.myChart.data = {
                    labels: labels,
                    datasets: data
                };

                if (customTooltips) {
                    this.myChart.options.tooltips = customTooltips;
                }

                this.myChart.update();
            }
        }
    }

    componentDidMount() {
        const ctx = this.canvas.getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'bar',
            data: initialData,
            options: options
        });
    }

    render() {
        return (
            <canvas ref={(element) => this.canvas = element}/>
        );
    }
}
