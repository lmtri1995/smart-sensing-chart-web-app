import React, {Component}   from 'react';
import TemperatureTrendItem from "./TemperatureTrendItem";


class TemperatureTrendTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataArray: null
        }
    }

    componentDidMount() {
    }

    showTempTable = (dataArray) => {
        let result = (<div className="row" key={'2'}>
            <div className="col-md-6">
                <TemperatureTrendItem/>
                <TemperatureTrendItem/>
                <TemperatureTrendItem/>
                <TemperatureTrendItem/>
            </div>
            <div className="col-md-6">
                <TemperatureTrendItem/>
                <TemperatureTrendItem/>
                <TemperatureTrendItem/>
                <TemperatureTrendItem/>
            </div>
        </div>);
        if (dataArray && dataArray.length > 0) {
            result = <div className="row" key={'1'}>
                <div className="col-md-6">
                    <TemperatureTrendItem tempData={dataArray[1]}/>
                    <TemperatureTrendItem tempData={dataArray[2]}/>
                    <TemperatureTrendItem tempData={dataArray[3]}/>
                    <TemperatureTrendItem tempData={dataArray[4]}/>
                </div>
                <div className="col-md-6">
                    <TemperatureTrendItem tempData={dataArray[5]}/>
                    <TemperatureTrendItem tempData={dataArray[6]}/>
                    <TemperatureTrendItem tempData={dataArray[7]}/>
                    <TemperatureTrendItem tempData={dataArray[8]}/>
                </div>
            </div>
        }
        return result;
    };

    render() {
        return (
            <div>
                {this.showTempTable(this.props.dataArray)}
            </div>
        )

    }
}

export default TemperatureTrendTable;
