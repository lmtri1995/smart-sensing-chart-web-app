export const pluginDrawZeroValue = {
    renderZeroCompensation: function (chartInstance, d) {
        // get postion info from _view
        const view = d._view;
        const context = chartInstance.chart.ctx;

        // the view.x is the centeral point of the bar, so we need minus half width of the bar.
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

        console.log("chart.config.data: ", chart.config.data);
        console.log("dataSet1: ", dataSet1);
        console.log("meta.data: ", meta.data);
        meta.data.forEach((d, index) => {
            // for the item which value is 0, reander a line.
            if(!dataSet1[index]) {
                this.renderZeroCompensation(chart, d)
            }
        })
    }
};

export const pluginDrawZeroValueForSwingArmOsPress = {
    renderZeroCompensation: function (chartInstance, d, arrayNo = 0) {
        // get postion info from _view
        const view = d._view
        const context = chartInstance.chart.ctx

        // the view.x is the centeral point of the bar, so we need minus half width of the bar.
        //const startX = view.x - view.width / 2 + arrayNo * 100;
        const startX = view.x - view.width / 2;
        // common canvas API, Check it out on MDN
        context.beginPath();
        // set line color, you can do more custom settings here.
        context.strokeStyle = '#aaaaaa';
        //context.strokeStyle = 'red';
       /* console.log("view: ", view);
        console.log("view.height: ", view.height);
        console.log("chartInstance: ", chartInstance);
        console.log("d: ", d);*/
        context.moveTo(startX, this.zeroPosY);
        // draw the line!
        context.lineTo(startX + view.width, this.zeroPosY);
        // bam！ you will see the lines.
        context.stroke();
    },

    afterDatasetsDraw: function (chart, easing) {
        // get data meta, we need the location info in _view property.

        console.log("chart: ", chart);
        // also you need get datasets to find which item is 0.
        let arrayNo = 0;
        const dataSet1 = chart.config.data.datasets[arrayNo].data;
        let meta = chart.getDatasetMeta(arrayNo);

        meta.data.forEach((d, index) => {
            // for the item which value is 0, reander a line.
            if(!dataSet1[index]) {
                this.renderZeroCompensation(chart, d, arrayNo)
            }
        });

        arrayNo = 1;
        const dataSet2 = chart.config.data.datasets[arrayNo].data;
        meta = chart.getDatasetMeta(arrayNo);

        if (dataSet1 && dataSet1.length > 0 && dataSet1[0] === 0
        &&  dataSet2 && dataSet2.length > 0 && dataSet2[0] === 0){
            console.log("meta.data: ", meta.data);
            try {
                this.zeroPosY = meta.data[0]._view.y;
            } catch (e) {
                console.log("Error: ", e);
            }
        }

        meta.data.forEach((d, index) => {
            // for the item which value is 0, reander a line.
            if(!dataSet2[index]) {
                this.renderZeroCompensation(chart, d, arrayNo)
            }
        });
    }
};
