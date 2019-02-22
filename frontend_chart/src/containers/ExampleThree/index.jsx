/*
import React, { Component } from 'react'
import BarChart from './components/BarChart'
class App extends Component {
    render() {
        return (
            <div className='App'>
                <div className='App-header'>
                    <h2>d3ia dashboard</h2>
                </div>
                <div>
                    <BarChart data={[5,10,1,3]} size={[500,500]} />
                </div>
            </div>
        )
    }
}
export default App
*/
/*
import React from 'react'
import * as d3 from 'd3'
import {withFauxDOM} from 'react-faux-dom'

class MyReactComponent extends React.Component {
    componentDidMount () {
        const faux = this.props.connectFauxDOM('ccc', 'chart')
        d3.select(faux)
            .append('div')
            .html('Hello World!')
        this.props.animateFauxDOM(16);
    }

    static defaultProps = {
        chart: 'loading'
    };

    render () {
        return (
            <div>
                <h2>Here is some fancy data:</h2>
                <div className='renderedD3'>
                    {this.props.chart}
                </div>
            </div>
        )
    }
}

export default withFauxDOM(MyReactComponent)
*/
import React, { Component } from 'react'
import Dygraph from 'dygraphs';
import temperatures from './temperatures.csv';
import fs from 'fs';
import csvWriter from 'csv-write-stream';
import API from "../../services/api";
import moment from 'moment';
class App extends Component {
    static garph = null;
    /*resetZoomForGarph = _ => {
        if (this.garph){
            this.garph.resetZoom();
        }
    }*/
    render() {
        return (
            <div id='chart2'></div>
        );
    }

    // Change array of object to csv file
    // input: object with attributes:
    // data: array of object
    // filename: name that to be saved as
    downloadCSV = (args) => {
        let inputData, filename, link;

        if (args){
            inputData = args.data  || null;
        }

        if (!inputData){
            console.log("Data is null");
        } else {
            let csv = this.convertArrayOfObjectsToCSV({
                data: inputData
            });
            if (csv == null) return;

            filename = args.filename || 'export.csv';

            if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv;
            }
            inputData = encodeURI(csv);

            link = document.createElement('a');
            link.setAttribute('href', inputData);
            link.setAttribute('download', filename);
            link.click();
        }

    }


    // change array of object to String
    // input: an object with attributes:
    // data: array of object,
    // columnDelimiter,
    // lineDelimiter
    convertArrayOfObjectsToCSV = (args) => {
        //ctr: specify is it the fist element
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    componentDidMount () {


        /*this.garph = new Dygraph(
            document.getElementById('chart'),
            temperatures,
            {
                colors:["#F575F7", "#8C67F6"],
            }
        );*/

        let param = {
            idStation: 1,
            from_timedevice: 0,
            to_timedevice: 0,
            minute: 0,
        };

        let legendFormatter = (data) =>  {
            console.log("legend formatter: ================================, data: ", data, "data.xHTML: ", data.xHTML);
            if (data.x == null) return '';  // no selection
            return data.xHTML +
                data.series
                    .map(v => "a"+ "fdsafs" + v.labelHTML + ': ' + "b" + v.yHTML)  // modify as
            // needed
                    .join(' ');
        };
        API('api/os/tempTrend', 'POST', param)
            .then((response) => {
                console.log("response: ", response);
                if (response.data.success){
                    let dataArray = response.data.data;
                    console.log("dataArray: ", dataArray, "typeof: ", typeof(dataArray));
                    let displayData = JSON.parse(dataArray[0].data);
                    displayData = displayData.slice(0, 10000);//1300 - 1500
                    console.log("displayData: ", displayData, "typeof: ", typeof(displayData));

                    /*
                    OK
                    this.garph = new Dygraph(
                        document.getElementById('chart'),
                        `X,Y1
  	                    1532163461391,19.179613
                        1532163462391,20.12414
                        1532163463391,20.370108`,
                        {
                            // options go here. See http://dygraphs.com/options.html
                            legend: 'always',
                            animatedZooms: true,
                            title: 'dygraphs chart template',
                            axes : {
                                x : {
                                    valueFormatter: Dygraph.dateString_,
                                    ticker: Dygraph.dateTicker
                                }
                            }
                        }
                    );*/
                    /*var data = [
                        [1342507745, 100], [1342507746, 25], [1342507747, 200], [1342507748, 25], [1342507749, 300]
                    ];*/

                    this.garph = new Dygraph(
                        document.getElementById('chart2'),
                        displayData,
                        {
                            legend: 'follow',
                            // options go here. See http://dygraphs.com/options.html
                            //https://stackoverflow.com/questions/20234787/in-dygraphs-how-to-display-axislabels-as-text-instead-of-numbers-date
                            animatedZooms: true,
                            width:1000,
                            height: 500,
                            colors: ["#71D7BE", "#F89D9D", "#FF9C64", "#EB6A91", "#F575F7", "#8C67F6"],
                            labels: ["Time", "tempA1", "tempA2", "tempA3", "tempB1", "tempB2", "tempB3"],
                            //legendFormatter,

                            labelsSeparateLines: true,
                            //labels: ["a", "b", "c", "d", "e", "f", "g"],
                            axes : {
                                x: {
                                    drawGrid: false,
                                    valueFormatter: function(x) {
                                        return moment.unix(x).format("YYYY/MM/DD hh:mm:ss");;
                                    },
                                    axisLabelFormatter: function(x) {
                                        return moment.unix(x).format("YYYY/MM/DD  hh:mm:ss");
                                    },
                                },
                                y: {
                                    axisLineColor: '#464d54',
                                    //drawAxis: false,
                                }
                            }
                        }
                    );

                    //localStorage.setItem('test', JSON.stringify(dataArray));
                    /*this.setState({
                        dataArray: dataArray,
                    });*/
                    //this.downloadCSV({data:dataArray, filename: 'stockData.csv'});
                }
            })
            .catch((err) => console.log('err:', err))
    }
}
export default App
