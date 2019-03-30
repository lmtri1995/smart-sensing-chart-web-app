export const pluginDrawZeroLine = {
    renderZeroCompensation: function (chartInstance, d) {
        // get position info from _view
        const view = d._view;
        const context = chartInstance.chart.ctx;

        // the view.x is the central point of the bar, so we need minus half width of the bar.
        const startX = view.x - view.width / 2;
        // common canvas API, Check it out on MDN
        context.beginPath();
        // set line color, you can do more custom settings here.
        context.strokeStyle = '#aaaaaa';
        //context.strokeStyle = 'red';
        context.moveTo(startX, view.y);
        // draw the line!
        context.lineTo(startX + view.width, view.y);
        // bam！ you will see the lines.
        context.stroke();
    },

    afterDatasetsDraw: function (chart, easing) {
        // get data meta, we need the location info in _view property.
        const meta = chart.getDatasetMeta(0);
        // also you need get datasets to find which item is 0.
        const dataSet1 = chart.config.data.datasets[0].data;

        meta.data.forEach((d, index) => {
            // for the item which value is 0, render a line.
            if (!dataSet1[index]) {
                this.renderZeroCompensation(chart, d)
            }
        })
    }
};

export const pluginDrawZeroLineForSwingArmOsPress = {
    renderZeroCompensation: function (chartInstance, d) {
        // get position info from _view
        const view = d._view;
        const context = chartInstance.chart.ctx;

        // the view.x is the central point of the bar, so we need minus half width of the bar.
        //const startX = view.x - view.width / 2 + arrayNo * 100;
        const startX = view.x - view.width / 2;
        // common canvas API, Check it out on MDN
        context.beginPath();
        // set line color, you can do more custom settings here.
        context.strokeStyle = '#aaaaaa';
        //context.strokeStyle = 'red';
        context.moveTo(startX, this.zeroPosY);
        // draw the line!
        context.lineTo(startX + view.width, this.zeroPosY);
        // bam！ you will see the lines.
        context.stroke();
    },

    afterDatasetsDraw: function (chart, easing) {
        // get data meta, we need the location info in _view property.
        // also you need get datasets to find which item is 0.
        let arrayNo = 0;
        const dataSet1 = chart.config.data.datasets[arrayNo].data;
        let meta = chart.getDatasetMeta(arrayNo);

        meta.data.forEach((d, index) => {
            // for the item which value is 0, render a line.
            if (!dataSet1[index]) {
                this.renderZeroCompensation(chart, d)
            }
        });

        arrayNo = 1;
        const dataSet2 = chart.config.data.datasets[arrayNo].data;
        meta = chart.getDatasetMeta(arrayNo);

        if (dataSet1 && dataSet1.length > 0 && dataSet1[0] === 0
            && dataSet2 && dataSet2.length > 0 && dataSet2[0] === 0) {
            try {
                this.zeroPosY = meta.data[0]._view.y;
            } catch (e) {
                console.log("Error: ", e);
            }
        }

        meta.data.forEach((d, index) => {
            // for the item which value is 0, render a line.
            if (!dataSet2[index]) {
                this.renderZeroCompensation(chart, d)
            }
        });
    }
};

export const pluginDrawZeroLineForReportChart = {
    renderZeroCompensation: function (chartInstance, chartElement) {
        // get position info from _view
        const view = chartElement._view;
        const context = chartInstance.chart.ctx;

        // the view.x is the central point of the bar, so we need minus half width of the bar.
        const startX = view.x - view.width / 2;

        // set line color, you can do more custom settings here.
        context.strokeStyle = '#aaaaaa';

        // common canvas API, Check it out on MDN
        context.beginPath();

        context.moveTo(startX, this.zeroPosY);
        // draw the line!
        context.lineTo(startX + view.width, this.zeroPosY);
        // bam！ you will see the lines.
        context.stroke();
    },

    afterDatasetsDraw: function (chart, easing) {
        // get meta data, we need the location info in _view property.
        let meta = null;
        chart.config.data.datasets.forEach((curDataset, datasetIndex, datasets) => {
            meta = chart.getDatasetMeta(datasetIndex);
            if (datasetIndex < datasets.length - 1) {
                try {
                    for (let i = 0; i < curDataset.data.length; ++i) {
                        if (curDataset.data[i] === 0) {
                            this.zeroPosY = meta.data[i]._view.y;
                            break;
                        }
                    }
                } catch (e) {
                    console.log("Error: ", e);
                }
            }
            meta.data.forEach((chartElement, index) => {
                // for the item which value is 0, render a line.
                if (curDataset.data[index] === 0) {
                    this.renderZeroCompensation(chart, chartElement);
                }
            });
        });
    }
};
