import React, {Component} from 'react';
import Chart from "chart.js";
import {ClipLoader} from "react-spinners";

Chart.plugins.register({
    beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
            //Get ctx from string
            let ctx = chart.chart.ctx;

            //Get options from the center object in options
            let centerConfig = chart.config.options.elements.center;
            let fontSize = centerConfig.fontSize || 32;
            let fontFamily = centerConfig.fontFamily || 'arial, sans-serif';
            // Txt is a string OR an array of 2 elements, 1 for each line
            // Currently, only supports array of 2 elements (2 lines of text)
            let txt = centerConfig.text.search('\n') !== -1 ? centerConfig.text.split('\n') : centerConfig.text;
            let color = centerConfig.color || '#000';
            //Start with a base font of 20px
            ctx.font = `${fontSize}px ${fontFamily}`;

            // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
            let stringWidth = 0, maxLength = 0;
            if (Array.isArray(txt)) {
                let currentWidth = 0, maxWidth = 0;
                txt.forEach(str => {
                    currentWidth = ctx.measureText(str).width;
                    maxWidth = currentWidth > maxWidth ? currentWidth : maxWidth;
                    maxLength = str.length > maxLength ? str.length : maxLength;
                });
                stringWidth = maxWidth;
            } else {    // txt is a String
                maxLength = txt.length;
                stringWidth = ctx.measureText(txt).width;
            }
            // Padding percentage of text in inner circle.
            // for every 1 more letter (initially 3 letters -> subtract by 3),
            // subtract sidePadding (initially 76) by 3 unit
            // Currently, side padding should be 76 initially
            let sidePadding = (centerConfig.sidePadding - (maxLength - 3) * 3) || (76 - (maxLength - 3) * 3);
            let sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);
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
            if (Array.isArray(txt)) {
                let scaledFontSizeToUse = 1.4 * fontSizeToUse;   // to have spacing between lines of texts
                let topBaselineToDraw = centerY;

                if (txt.length % 2 === 0) {
                    let halfNumOfTxtLines = txt.length / 2;

                    let topBaseline = centerY - (halfNumOfTxtLines * scaledFontSizeToUse);
                    topBaselineToDraw =  topBaseline + (scaledFontSizeToUse / 2);
                } else {
                    let halfNumOfTxtLines = (txt.length - 1) / 2;

                    topBaselineToDraw = centerY - (halfNumOfTxtLines * scaledFontSizeToUse);
                }
                txt.forEach((str, index) => {
                    ctx.fillText(str, centerX, topBaselineToDraw + index * scaledFontSizeToUse);
                });
            } else {    // txt is a String
                ctx.fillText(txt, centerX, centerY);
            }
        }
    }
});

const initialData = {
    labels: [
        "Type 1"
    ],
    datasets: [{
        data: [1],
        backgroundColor: [
            "#FF9C64",
        ],
        hoverBackgroundColor: [
            "#FF9C64",
        ]
    }]
};

let options = {
    cutoutPercentage: 62,
    elements: {
        arc: {
            borderWidth: 0, // No outline
        },
        center: {
            text: '0',  // initially 1 letter
            color: '#FFFFFF', // Default is #000000
            fontSize: 32,   // Default is 32px
            fontFamily: 'Roboto', // Default is Arial, sans-serif
            sidePadding: 50, // Default is 76 (as a percentage). Currently, side padding should
            // be 76.
        }
    },
    legend: {
        display: false,
        position: 'bottom',
    }
};

const override = `
    position: absolute;
    display:block;
    left:15%;
    top: 10%;
    z-index: 100000;
`;

export default class DoughnutChart extends Component {

    constructor(props) {
        super(props);

        this.canvas = null;

        this.state = {
            loading: true
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            let {labels, data, centerText, showLegend} = this.props;
            if (labels && data && this.canvas) {
                this.myChart.data = {
                    labels: labels,
                    datasets: data
                };

                this.myChart.options.legend.display = !!showLegend;

                if (centerText) {
                    this.myChart.options.elements.center.text = centerText;
                }

                this.myChart.update();
                this.setState({loading: false});
            }
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
            <div>
                <ClipLoader
                    css={override}
                    sizeUnit={"px"}
                    size={100}
                    color={'#30D4A4'}
                    loading={this.state.loading}
                    margin-left={300}
                />
                <canvas width={35} height={50}
                        ref={(element) => this.canvas = element}
                />
            </div>
        );
    }
}
