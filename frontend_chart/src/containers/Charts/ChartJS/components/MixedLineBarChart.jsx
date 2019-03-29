import React, {PureComponent} from 'react';
import 'chartjs-plugin-zoom';
import Chart from 'chart.js';
import moment from 'moment';
import {ClipLoader} from "react-spinners";
import {pluginDrawZeroLineForReportChart} from "../../../../shared/utils/plugins";

let initialData = {
    labels: [
        moment().subtract(6, "days").format('DD/MM/YYYY'),
        moment().subtract(5, "days").format('DD/MM/YYYY'),
        moment().subtract(4, "days").format('DD/MM/YYYY'),
        moment().subtract(3, "days").format('DD/MM/YYYY'),
        moment().subtract(2, "days").format('DD/MM/YYYY'),
        moment().subtract(1, "days").format('DD/MM/YYYY'),
        moment().format('DD/MM/YYYY'),
    ],
    datasets: [
        {
            label: "Empty Label",
            backgroundColor: "#FF9C64",
            data: [0, 0, 0, 0, 0, 0, 0]
        }
    ]
};

const options = {
    legend: {
        display: false,
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

const override = `
    position: absolute;
    display:block;
    left:45%;
    top: 30%;
    z-index: 100000;
`;

export default class MixedLineBarChart extends PureComponent {

    constructor(props) {
        super(props);

        this.canvas = null;

        this.state = {
            loading: true
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            let {labels, data, customTooltips, showLegend} = this.props;
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

                this.myChart.options.legend.display = !!showLegend;

                if (customTooltips) {
                    this.myChart.options.tooltips = customTooltips;
                }

                this.myChart.update();
                this.setState({loading: false});
            }
        }
    }

    componentDidMount() {
        const ctx = this.canvas.getContext('2d');
        this.myChart = new Chart(ctx, {
            type: 'bar',
            data: initialData,
            options: options,
            plugins: pluginDrawZeroLineForReportChart,
        });
    }

    render() {
        return (
            <div>
                <ClipLoader
                    css={override}
                    sizeUnit={"px"}
                    size={100}
                    color={'#30D4A4'}
                    loading={this.state.loading}
                    margin-left={300}
                />
                <canvas ref={(element) => this.canvas = element}/>
            </div>
        );
    }
}
