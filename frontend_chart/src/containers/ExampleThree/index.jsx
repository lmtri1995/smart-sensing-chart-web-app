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
class App extends Component {
    static garph = null;
    resetZoomForGarph = _ => {
        if (this.garph){
            this.garph.resetZoom();
        }
    }
    render() {
        return (
            <div>
                <div id='chart'></div>
                <div>
                    <button onClick={this.resetZoomForGarph}>Reset zoom</button>
                </div>
            </div>
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
        this.garph = new Dygraph(
            document.getElementById('chart'),
            temperatures
        );
        /*API('api/os/tempTrend', 'POST')
            .then((response) => {
                console.log("response: ", response);
                if (response.data.success){
                    let dataArray = response.data.data;
                    console.log("dataArray: ", dataArray);
                    /!*this.setState({
                        dataArray: dataArray,
                    });*!/
                    this.downloadCSV({data:dataArray, filename: 'stockData.csv'});
                }
            })
            .catch((err) => console.log('err:', err))*/
    }
}
export default App
