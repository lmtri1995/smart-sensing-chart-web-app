import React, {Component} from 'react';
import LineSummaryItem from './components/LineSummaryItem';
import GeneralSummaryItem from './components/GeneralSummaryItem';
import Singleton from "../../../../services/Socket";
import {ClipLoader} from 'react-spinners';
import {connect} from "react-redux";
import {storeProcessStatusData} from "../../../../redux/actions/downloadDataStoreActions";

const override = `
    position: absolute;
    display:block;
    left:45%;
    top :45%;
    z-index: 100000;
`;

class ProcessStatus extends Component {
    static socket = null;
    static _isMounted = false;
    static loginData = null;
    static role = null;
    static emitEvent = 'process_status';

    constructor(props) {
        super(props);

        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        switch (this.role) {
            case 'admin':
                this.emitEvent = 'os_process_status';
                this.listenEvent = 'sna_' + this.emitEvent;
                break;
            case 'ip':
                this.emitEvent = 'ip_process_status';
                this.listenEvent = 'sna_' + this.emitEvent;
                break;
            case 'os':
                this.emitEvent = 'os_process_status';
                this.listenEvent = 'sna_' + this.emitEvent;
                break;
            default:
                this.emitEvent = 'os_process_status';
                this.listenEvent = 'sna_' + this.emitEvent;
                break;
        }

        this.state = {
            dataArray: "",
            loading: true
        };
    }

    componentWillUnmount() {
        this._isMounted = false;

        //Unregister event
        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.listenEvent,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                status: 'stop'
            }
        });
        //this.socket.removeListener('sna_process_status');
    }

    componentDidMount() {
        this._isMounted = true;
        /*var mDateFrom = moment.utc([2019, 0, 2, 10, 6, 40]);
        var uDateFrom = mDateFrom.unix();
        var mDateTo = moment.utc([2019, 0, 2, 10, 6, 43]);
        var uDateTo = mDateTo.unix();*/


        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.listenEvent,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                status: 'start'
            }
        });

        this.socket.on(this.listenEvent, (data) => {
            if (this._isMounted) {
                let returnArray = JSON.parse(data);
                let dataArray = returnArray.data;
                dataArray.sort(function (a, b) {
                    if (parseFloat(a.idStation) < parseFloat(b.idStation)) {
                        return -1;
                    }
                    if (parseFloat(a.idStation) > parseFloat(b.idStation)) {
                        return 1;
                    }
                    return 0;
                });
                this.setState({
                    dataArray: dataArray,
                });
            }
        });

        /*socket.on('token', (data) => {
            let tokenObject = JSON.parse(data);
            if (!tokenObject.success) {
                console.log('Token is expired');
                window.location.href = (ROUTE.Logout);
            }
        });*/

    }

    showLineItem(data, stationId) {
        let result = <LineSummaryItem stationId={stationId} avgTemp={data.temp_avg}
                                      stddevTemp={Math.round(data.temp_stdev * 100)/100} avgPreparing={data.pre_avg}
                                      stddevPreparing={data.pre_stdev} avgCuringTime={data.cur_avg}
                                      stddevCurringTime={data.cur_stdev}/>;
        return result;
    }

    showGeneralItem(dataArray, spec) {
        let result = <GeneralSummaryItem spec={spec}/>;
        return result;
    }

    checkNull(number) {
        let result = (number === null || number === NaN) ? 0 : number;
        return result;
    }

    roundNumber(number){
        return Math.round(number * 100)/100;
    }

    showLineTable(dataArray) {
        let result = <tbody>
        <tr>
            <th>STATION No.</th>
            <th>AVG</th>
            <th>STDEV</th>
            <th>AVG</th>
            <th>STDEV</th>
            <th>AVG</th>
            <th>STDEV</th>
        </tr>
        <LineSummaryItem stationId={1} avgTemp={0} stddevTemp={0} avgPreparing={0}
                         stddevPreparing={0} avgCuringTime={0} stddevCurringTime={0}/>
        <LineSummaryItem stationId={2} avgTemp={0} stddevTemp={0} avgPreparing={0}
                         stddevPreparing={0} avgCuringTime={0} stddevCurringTime={0}/>
        <LineSummaryItem stationId={3} avgTemp={0} stddevTemp={0} avgPreparing={0}
                         stddevPreparing={0} avgCuringTime={0} stddevCurringTime={0}/>
        <LineSummaryItem stationId={4} avgTemp={0} stddevTemp={0} avgPreparing={0}
                         stddevPreparing={0} avgCuringTime={0} stddevCurringTime={0}/>
        <LineSummaryItem stationId={5} avgTemp={0} stddevTemp={0} avgPreparing={0}
                         stddevPreparing={0} avgCuringTime={0} stddevCurringTime={0}/>
        <LineSummaryItem stationId={6} avgTemp={0} stddevTemp={0} avgPreparing={0}
                         stddevPreparing={0} avgCuringTime={0} stddevCurringTime={0}/>
        <LineSummaryItem stationId={7} avgTemp={0} stddevTemp={0} avgPreparing={0}
                         stddevPreparing={0} avgCuringTime={0} stddevCurringTime={0}/>
        <LineSummaryItem stationId={8} avgTemp={0} stddevTemp={0} avgPreparing={0}
                         stddevPreparing={0} avgCuringTime={0} stddevCurringTime={0}/>
        <tr>
            <th scope="col" rowSpan="2">Processing Status</th>
            <th scope="col" colSpan="2">Temperature</th>
            <th scope="col" colSpan="2">Preparing (s)</th>
            <th scope="col" colSpan="2">Curing Time (s)</th>
        </tr>
        <tr>
            <th>AVG</th>
            <th>STDEV</th>
            <th>AVG</th>
            <th>STDEV</th>
            <th>AVG</th>
            <th>STDEV</th>
        </tr>
        <GeneralSummaryItem spec={'AVG'} data1={0} data2={0} data3={0} data4={0} data5={0}
                            data6={0}/>
        <GeneralSummaryItem spec={'MAX'} data1={0} data2={0} data3={0} data4={0} data5={0}
                            data6={0}/>
        <GeneralSummaryItem spec={'MIN'} data1={0} data2={0} data3={0} data4={0} data5={0}
                            data6={0}/>
        <GeneralSummaryItem spec={'STDEV'} data1={0} data2={0} data3={0} data4={0} data5={0}
                            data6={0}/>
        </tbody>;
        //If there is returned data
        if (dataArray.length > 0) {
            let numbersOfStation = 8;
            let totalAvgTemp = 0, totalStddevTemp = 0, totalAvgPrep = 0, totalStddevPrep = 0,
                totalAvgCuringTime = 0, totalStddevCurringTime = 0;

            let maxAvgTemp = parseFloat(this.checkNull(dataArray[0].temp_avg)),
                maxStddevTemp = parseFloat(this.checkNull(dataArray[0].temp_stdev)),
                maxAvgPrep = parseFloat(this.checkNull(dataArray[0].pre_avg)),
                maxStddevPrep = parseFloat(this.checkNull(dataArray[0].pre_stdev)),
                maxAvgCuringTime = parseFloat(this.checkNull(dataArray[0].cur_avg)),
                maxStddevCurringTime = parseFloat(this.checkNull(dataArray[0].cur_stdev));

            let minAvgTemp = parseFloat(this.checkNull(dataArray[0].temp_avg)),
                minStddevTemp = parseFloat(this.checkNull(dataArray[0].temp_stdev)),
                minAvgPrep = parseFloat(this.checkNull(dataArray[0].pre_avg)),
                minStddevPrep = parseFloat(this.checkNull(dataArray[0].pre_stdev)),
                minAvgCuringTime = parseFloat(this.checkNull(dataArray[0].cur_avg)),
                minStddevCurringTime = parseFloat(this.checkNull(dataArray[0].cur_stdev));

            for (let i = 0; i < numbersOfStation; i++) {
                //for average line
                totalAvgTemp += parseFloat(this.checkNull(dataArray[i].temp_avg));
                totalStddevTemp += parseFloat(this.checkNull(dataArray[i].temp_stdev));
                totalAvgPrep += parseFloat(this.checkNull(dataArray[i].pre_avg));
                totalStddevPrep += parseFloat(this.checkNull(dataArray[i].pre_stdev));
                totalAvgCuringTime += parseFloat(this.checkNull(dataArray[i].cur_avg));
                totalStddevCurringTime += parseFloat(this.checkNull(dataArray[i].cur_stdev));

                //for max line
                maxAvgTemp = (maxAvgTemp < parseFloat(dataArray[i].temp_avg)) ? parseFloat(dataArray[i].temp_avg) : maxAvgTemp;
                maxStddevTemp = (maxStddevTemp < parseFloat(dataArray[i].temp_stdev)) ? parseFloat(dataArray[i].temp_stdev) : maxStddevTemp;
                maxAvgPrep = (maxAvgPrep < parseFloat(dataArray[i].pre_avg)) ? parseFloat(dataArray[i].pre_avg) : maxAvgPrep;
                maxStddevPrep = (maxStddevPrep < parseFloat(dataArray[i].pre_stdev)) ? parseFloat(dataArray[i].pre_stdev) : maxStddevPrep;
                maxAvgCuringTime = (maxAvgCuringTime < parseFloat(dataArray[i].cur_avg)) ? parseFloat(dataArray[i].cur_avg) : maxAvgCuringTime;
                maxStddevCurringTime = (maxStddevCurringTime < parseFloat(dataArray[i].cur_stdev)) ? parseFloat(dataArray[i].cur_stdev) : maxStddevCurringTime;

                //for min line
                minAvgTemp = (minAvgTemp < parseFloat(dataArray[i].temp_avg)) ? minAvgTemp : parseFloat(dataArray[i].temp_avg);
                minStddevTemp = (minStddevTemp < parseFloat(dataArray[i].temp_stdev)) ? minStddevTemp : parseFloat(dataArray[i].temp_stdev);
                minAvgPrep = (minAvgPrep < parseFloat(dataArray[i].pre_avg)) ? minAvgPrep : parseFloat(dataArray[i].pre_avg);
                minStddevPrep = (minStddevPrep < parseFloat(dataArray[i].pre_stdev)) ? minStddevPrep : parseFloat(dataArray[i].pre_stdev);
                minAvgCuringTime = (minAvgCuringTime < parseFloat(dataArray[i].cur_avg)) ? minAvgCuringTime : parseFloat(dataArray[i].cur_avg);
                minStddevCurringTime = (minStddevCurringTime < parseFloat(dataArray[i].cur_stdev)) ? minStddevCurringTime : parseFloat(dataArray[i].cur_stdev);

                //for stddev line
            }

            let avgAvgTemp = totalAvgTemp / numbersOfStation;
            let avgStddevTemp = totalStddevTemp / numbersOfStation;
            let avgAvgPrep = totalAvgPrep / numbersOfStation;
            let avgStddevPrep = totalStddevPrep / numbersOfStation;
            let avgAvgCuringTime = totalAvgCuringTime / numbersOfStation;
            let avgStddevCurringTime = totalStddevCurringTime / numbersOfStation;


            //count standard deviation
            let stdAvgTemp = 0,
                stdStddevTemp = 0,
                stdAvgPrep = 0,
                stdStddevPrep = 0,
                stdAvgCuringTime = 0,
                stdStddevCurringTime = 0;

            let totalSqrDiffAvgTemp = 0,
                totalSqrStddevTemp = 0,
                totalSqrAvgPrep = 0,
                totalSqrStddevPrep = 0,
                totalSqrAvgCuringTime = 0,
                totalSqrStddevCurringTime = 0;
            for (let i = 0; i < numbersOfStation; i++) {
                totalSqrDiffAvgTemp += (parseFloat(this.checkNull(dataArray[i].temp_avg)) - avgAvgTemp) ** 2;
                totalSqrStddevTemp += (parseFloat(this.checkNull(dataArray[i].temp_stdev)) - avgStddevTemp) ** 2;
                totalSqrAvgPrep += (parseFloat(this.checkNull(dataArray[i].pre_avg)) - avgAvgPrep) ** 2;
                totalSqrStddevPrep += (parseFloat(this.checkNull(dataArray[i].pre_stdev)) - avgStddevPrep) ** 2;
                totalSqrAvgCuringTime += (parseFloat(this.checkNull(dataArray[i].cur_avg)) - avgAvgCuringTime) ** 2;
                totalSqrStddevCurringTime += (parseFloat(this.checkNull(dataArray[i].cur_stdev)) - avgStddevCurringTime) ** 2;
            }
            if (numbersOfStation > 0) {
                stdAvgTemp = Math.sqrt(totalSqrDiffAvgTemp / numbersOfStation);
                stdStddevTemp = Math.sqrt(totalSqrStddevTemp / numbersOfStation);
                stdAvgPrep = Math.sqrt(totalSqrAvgPrep / numbersOfStation);
                stdStddevPrep = Math.sqrt(totalSqrStddevPrep / numbersOfStation);
                stdAvgCuringTime = Math.sqrt(totalSqrAvgCuringTime / numbersOfStation);
                stdStddevCurringTime = Math.sqrt(totalSqrStddevCurringTime / numbersOfStation);
            }

            result = <tbody>
            <tr>
                <th>STATION No.</th>
                <th>AVG</th>
                <th>STDEV</th>
                <th>AVG</th>
                <th>STDEV</th>
                <th>AVG</th>
                <th>STDEV</th>
            </tr>
            {this.showLineItem(dataArray[0], 1)}
            {this.showLineItem(dataArray[1], 2)}
            {this.showLineItem(dataArray[2], 3)}
            {this.showLineItem(dataArray[3], 4)}
            {this.showLineItem(dataArray[4], 5)}
            {this.showLineItem(dataArray[5], 6)}
            {this.showLineItem(dataArray[6], 7)}
            {this.showLineItem(dataArray[7], 8)}
            <tr>
                <th scope="col" rowSpan="2">Processing Status</th>
                <th scope="col" colSpan="2">Temperature</th>
                <th scope="col" colSpan="2">Preparing (s)</th>
                <th scope="col" colSpan="2">Curing Time (s)</th>
            </tr>
            <tr>
                <th>AVG</th>
                <th>STDEV</th>
                <th>AVG</th>
                <th>STDEV</th>
                <th>AVG</th>
                <th>STDEV</th>
            </tr>
            <GeneralSummaryItem spec={'AVG'} data1={this.roundNumber(avgAvgTemp)} data2={this.roundNumber(avgStddevTemp)}
                                data3={this.roundNumber(avgAvgPrep)} data4={this.roundNumber(avgStddevPrep)} data5={this.roundNumber(avgAvgCuringTime)}
                                data6={this.roundNumber(avgStddevCurringTime)}/>
            <GeneralSummaryItem spec={'MAX'} data1={this.roundNumber(maxAvgTemp)} data2={this.roundNumber(maxStddevTemp)}
                                data3={this.roundNumber(maxAvgPrep)} data4={this.roundNumber(maxStddevPrep)} data5={this.roundNumber(maxAvgCuringTime)}
                                data6={this.roundNumber(maxStddevCurringTime)}/>
            <GeneralSummaryItem spec={'MIN'} data1={this.roundNumber(minAvgTemp)} data2={this.roundNumber(minStddevTemp)}
                                data3={this.roundNumber(minAvgPrep)} data4={this.roundNumber(minStddevPrep)} data5={this.roundNumber(minAvgCuringTime)}
                                data6={this.roundNumber(minStddevCurringTime)}/>
            <GeneralSummaryItem spec={'STDEV'} data1={this.roundNumber(stdAvgTemp)} data2={this.roundNumber(stdStddevTemp)}
                                data3={this.roundNumber(stdAvgPrep)} data4={this.roundNumber(stdStddevPrep)} data5={this.roundNumber(stdAvgCuringTime)}
                                data6={this.roundNumber(stdStddevCurringTime)}/>
            </tbody>;

            // Prepare to push Process Status Data to Redux Store
            let processStatusDataToDownload = {
                processingStatusLine: [],
                general: [],
            };
            for (let i = 0; i < numbersOfStation; ++i) {
                processStatusDataToDownload.processingStatusLine[i] = [];

                processStatusDataToDownload.processingStatusLine[i].push(dataArray[i]['idLine']);
                processStatusDataToDownload.processingStatusLine[i].push(dataArray[i]['idStation']);
                processStatusDataToDownload.processingStatusLine[i].push(dataArray[i]['temp_avg']);
                processStatusDataToDownload.processingStatusLine[i].push(dataArray[i]['temp_stdev']);
                processStatusDataToDownload.processingStatusLine[i].push(dataArray[i]['pre_avg']);
                processStatusDataToDownload.processingStatusLine[i].push(dataArray[i]['pre_stdev']);
                processStatusDataToDownload.processingStatusLine[i].push(dataArray[i]['cur_avg']);
                processStatusDataToDownload.processingStatusLine[i].push(dataArray[i]['cur_stdev']);
            }
            processStatusDataToDownload.general = [
                [this.roundNumber(avgAvgTemp), this.roundNumber(avgStddevTemp), this.roundNumber(avgAvgPrep), this.roundNumber(avgStddevPrep), this.roundNumber(avgAvgCuringTime), this.roundNumber(avgStddevCurringTime)],
                [this.roundNumber(maxAvgTemp), this.roundNumber(maxStddevTemp), this.roundNumber(maxAvgPrep), this.roundNumber(maxStddevPrep), this.roundNumber(maxAvgCuringTime), this.roundNumber(maxStddevCurringTime)],
                [this.roundNumber(minAvgTemp), this.roundNumber(minStddevTemp), this.roundNumber(minAvgPrep), this.roundNumber(minStddevPrep), this.roundNumber(minAvgCuringTime), this.roundNumber(minStddevCurringTime)],
                [this.roundNumber(stdAvgTemp), this.roundNumber(stdStddevTemp), this.roundNumber(stdAvgPrep), this.roundNumber(stdStddevPrep), this.roundNumber(stdAvgCuringTime), this.roundNumber(stdStddevCurringTime)],
            ];
            // Push Process Status Data to Redux Store to Export Data later
            this.props.dispatch(storeProcessStatusData(processStatusDataToDownload));
        }
        return result;
    }

    render() {
        let dataArray = this.state.dataArray;
        if (dataArray && dataArray.length > 0 && this.state.loading === true) {
            this.setState({loading: false})
        }
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
                <div className={(this.state.loading) ? "loader" : ""}>
                    <table className="table table-bordered table-dark">
                        <thead>
                        <tr>
                            <th scope="col" rowSpan="2">Processing Status</th>
                            <th scope="col" colSpan="2">Temperature</th>
                            <th scope="col" colSpan="2">Preparing (s)</th>
                            <th scope="col" colSpan="2">Curing Time (s)</th>
                        </tr>
                        </thead>
                        {this.showLineTable(dataArray)}
                    </table>
                </div>
            </div>

        )
    }
}

export default connect()(ProcessStatus);
