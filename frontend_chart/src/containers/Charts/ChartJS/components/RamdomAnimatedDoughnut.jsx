import React, {Component} from 'react';
import Chart from "chart.js";

Chart.plugins.register({
    beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
            //Get ctx from string
            let ctx = chart.chart.ctx;

            //Get options from the center object in options
            let centerConfig = chart.config.options.elements.center;
            let fontSize = centerConfig.fontSize || 32;
            let fontFamily = centerConfig.fontFamily || 'arial, sans-serif';
            let txt = centerConfig.text;
            let color = centerConfig.color || '#000';
            let sidePadding = centerConfig.sidePadding || 20;   // padding percentage of text in inner circle
            let sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);
            //Start with a base font of 20px
            ctx.font = `${fontSize}px ${fontFamily}`;

            //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
            let stringWidth = ctx.measureText(txt).width;
            let elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

            // Find out how much the font can grow in width.
            let widthRatio = elementWidth / stringWidth;
            let newFontSize = Math.floor(fontSize * widthRatio);
            let elementHeight = (chart.innerRadius * 2);    // equals diameter of inner circle

            // Pick a new font size so it will not be larger than the diameter of inner circle.
            let fontSizeToUse = Math.min(newFontSize, elementHeight);

            //Set font settings to draw it correctly.
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            let centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
            let centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
            ctx.font = `${fontSizeToUse}px ${fontFamily}`;
            ctx.fillStyle = color;

            //Draw text in center
            ctx.fillText(txt, centerX, centerY);
        }
    }
});

const initialData = {
    labels: [
        "Type 1",
        "Type 2",
        "Type 3",
        "Type 4",
    ],
    datasets: [{
        data: [138, 127, 92, 92],
        backgroundColor: [
            "#FF9C64",
            "#46D6EA",
            "#F575F7",
            "#8C67F6",
        ],
        hoverBackgroundColor: [
            "#FF9C64",
            "#46D6EA",
            "#F575F7",
            "#8C67F6",
        ]
    }]
};

const options = {
    cutoutPercentage: 62,
    elements: {
        arc: {
            borderWidth: 0, // No outline
        },
        center: {
            text: '439',
            color: '#FFFFFF', // Default is #000000
            fontSize: 32,   // Default is 32px
            fontFamily: 'Roboto', // Default is Arial, sans-serif
            sidePadding: 70, // Default is 20 (as a percentage)
        }
    },
    legend: {
        display: false,
    }
};

export default class RandomAnimatedDoughnutLong extends Component {

    constructor(props) {
        super(props);

        this.canvas = null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let data = this.props.data;
        if (data && this.canvas) {
            for (let i = 0; i < 4; ++i) {
                this.myChart.data.datasets[0].data[i] = data[0][`DEFECT_COUNT${i + 1}`];
            }
            this.myChart.update();
        }
    }

    componentDidMount() {
        if (this.canvas) {
            const ctx = this.canvas.getContext('2d');
            this.myChart = new Chart(ctx, {
                type: 'doughnut',
                data: initialData,
                options: options
            });
        }
    }

    render() {
        return (
            <canvas width={35} height={30}
                    ref={(element) => this.canvas = element}
            />
        );
    }
}
