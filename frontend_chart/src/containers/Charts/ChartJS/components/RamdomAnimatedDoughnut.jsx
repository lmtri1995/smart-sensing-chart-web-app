import React, {Component} from 'react';
import {Doughnut} from 'react-chartjs-2';

// some of this code is a variation on https://jsfiddle.net/cmyker/u6rr5moq/
var originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
    draw: function () {
        originalDoughnutDraw.apply(this, arguments);

        var chart = this.chart.chart;
        var ctx = chart.ctx;
        var width = chart.width;
        var height = chart.height;

        var fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em Verdana";
        ctx.textBaseline = "middle";

        var text = chart.config.data.text,
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;

        ctx.fillText(text, textX, textY);
    }
});

const data = {
    labels: [
        'Red',
        'Yellow'
    ],
    datasets: [{
        data: [50, 100],
        backgroundColor: [
            '#36A2EB',
            '#FFCE56'
        ],
        hoverBackgroundColor: [
            '#36A2EB',
            '#FFCE56'
        ]
    }],
    text: '23%'
};
const options = {
    cutoutPercentage: 80,
    legend: {
        display: false
    },
    zoom: {
        enabled: true,
        mode: 'xy'
    }
};

class RandomAnimatedDoughnutLong extends Component {

    componentDidMount() {
        const ctx = this.refs.canvas.getContext('2d');
        let myChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: options
        });
    }

    render() {
        return (
            <canvas ref="canvas" width={35} height={30}/>
        );
    }
}

export default RandomAnimatedDoughnutLong;
