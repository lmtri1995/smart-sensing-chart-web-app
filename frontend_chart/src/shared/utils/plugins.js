export const pluginDrawZeroValue = {
    renderZeroCompensation: function (chartInstance, d) {
        // get postion info from _view
        const view = d._view
        const context = chartInstance.chart.ctx

        // the view.x is the centeral point of the bar, so we need minus half width of the bar.
        const startX = view.x - view.width / 2
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
        const meta = chart.getDatasetMeta(0)
        // also you need get datasets to find which item is 0.
        const dataSet = chart.config.data.datasets[0].data;
        meta.data.forEach((d, index) => {
            // for the item which value is 0, reander a line.
            if(!dataSet[index]) {
                this.renderZeroCompensation(chart, d)
            }
        })
    }
}
