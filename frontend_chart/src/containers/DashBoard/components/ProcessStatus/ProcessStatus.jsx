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
                break;
            case 'ip':
                this.emitEvent = 'ip_process_status';
                break;
            case 'os':
                this.emitEvent = 'os_process_status';
                break;
            default:
                this.emitEvent = 'os_process_status';
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
                event: 'sna_process_status',
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
                event: 'sna_process_status',
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                status: 'start'
            }
        });

        this.socket.on('sna_process_status', (data) => {
            if (this._isMounted) {
                let returnArray = JSON.parse(data);
                let dataArray = returnArray.data;
                dataArray.sort(function (a, b) {
                    if (parseInt(a.idStation) < parseInt(b.idStation)) {
                        return -1;
                    }
                    if (parseInt(a.idStation) > parseInt(b.idStation)) {
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
                window.location.href = ("/logout");
            }
        });*/

    }

    showLineItem(data, stationId) {
        let result = <LineSummaryItem stationId={stationId} avgTemp={data.temp_avg}
                                      stddevTemp={data.temp_stdev} avgPreparing={data.pre_avg}
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

    showLineTable(dataArray) {
        let result = <tbody>
        <tr>
            <th></th>
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
            let avgAvgTemp = parseInt(this.checkNull(dataArray[0].temp_avg)),
                avgStddevTemp = parseInt(this.checkNull(dataArray[0].temp_stdev)),
                avgAvgPrep = parseInt(this.checkNull(dataArray[0].pre_avg)),
                avgStddevPrep = parseInt(this.checkNull(dataArray[0].pre_stdev)),
                avgAvgCuringTime = parseInt(this.checkNull(dataArray[0].cur_avg)),
                avgStddevCurringTime = parseInt(this.checkNull(dataArray[0].cur_stdev));

            let maxAvgTemp = parseInt(this.checkNull(dataArray[0].temp_avg)),
                maxStddevTemp = parseInt(this.checkNull(dataArray[0].temp_stdev)),
                maxAvgPrep = parseInt(this.checkNull(dataArray[0].pre_avg)),
                maxStddevPrep = parseInt(this.checkNull(dataArray[0].pre_stdev)),
                maxAvgCuringTime = parseInt(this.checkNull(dataArray[0].cur_avg)),
                maxStddevCurringTime = parseInt(this.checkNull(dataArray[0].cur_stdev));

            let minAvgTemp = parseInt(this.checkNull(dataArray[0].temp_avg)),
                minStddevTemp = parseInt(this.checkNull(dataArray[0].temp_stdev)),
                minAvgPrep = parseInt(this.checkNull(dataArray[0].pre_avg)),
                minStddevPrep = parseInt(this.checkNull(dataArray[0].pre_stdev)),
                minAvgCuringTime = parseInt(this.checkNull(dataArray[0].cur_avg)),
                minStddevCurringTime = parseInt(this.checkNull(dataArray[0].cur_stdev));

            for (let i = 0; i < numbersOfStation; i++) {
                //for average line
                totalAvgTemp += parseInt(this.checkNull(dataArray[i].temp_avg));
                totalStddevTemp += parseInt(this.checkNull(dataArray[i].temp_stdev));
                totalAvgPrep += parseInt(this.checkNull(dataArray[i].pre_avg));
                totalStddevPrep += parseInt(this.checkNull(dataArray[i].pre_stdev));
                totalAvgCuringTime += parseInt(this.checkNull(dataArray[i].cur_avg));
                totalStddevCurringTime += parseInt(this.checkNull(dataArray[i].cur_stdev));

                //for max line
                maxAvgTemp = (maxAvgTemp < parseInt(dataArray[i].temp_avg)) ? parseInt(dataArray[i].temp_avg) : maxAvgTemp;
                maxStddevTemp = (maxStddevTemp < parseInt(dataArray[i].temp_stdev)) ? parseInt(dataArray[i].temp_stdev) : maxStddevTemp;
                maxAvgPrep = (maxAvgPrep < parseInt(dataArray[i].pre_avg)) ? parseInt(dataArray[i].pre_avg) : maxAvgPrep;
                maxStddevPrep = (maxStddevPrep < parseInt(dataArray[i].pre_stdev)) ? parseInt(dataArray[i].pre_stdev) : maxStddevPrep;
                maxAvgCuringTime = (maxAvgCuringTime < parseInt(dataArray[i].cur_avg)) ? parseInt(dataArray[i].cur_avg) : maxAvgCuringTime;
                maxStddevCurringTime = (maxStddevCurringTime < parseInt(dataArray[i].cur_stdev)) ? parseInt(dataArray[i].cur_stdev) : maxStddevCurringTime;

                //for min line
                minAvgTemp = (minAvgTemp < parseInt(dataArray[i].temp_avg)) ? parseInt(dataArray[i].temp_avg) : minAvgTemp;
                minStddevTemp = (minStddevTemp < parseInt(dataArray[i].temp_stdev)) ? parseInt(dataArray[i].temp_stdev) : minStddevTemp;
                minAvgPrep = (minAvgPrep < parseInt(dataArray[i].pre_avg)) ? parseInt(dataArray[i].pre_avg) : minAvgPrep;
                minStddevPrep = (minStddevPrep < parseInt(dataArray[i].pre_stdev)) ? parseInt(dataArray[i].pre_stdev) : minStddevPrep;
                minAvgCuringTime = (minAvgCuringTime < parseInt(dataArray[i].cur_avg)) ? parseInt(dataArray[i].cur_avg) : minAvgCuringTime;
                minStddevCurringTime = (minStddevCurringTime < parseInt(dataArray[i].cur_stdev)) ? parseInt(dataArray[i].cur_stdev) : minStddevCurringTime;

                //for stddev line
            }
            if (numbersOfStation > 0) {
                avgAvgTemp = totalAvgTemp / numbersOfStation;
                avgStddevTemp = totalStddevTemp / numbersOfStation;
                avgAvgPrep = totalAvgPrep / numbersOfStation;
                avgStddevPrep = totalStddevPrep / numbersOfStation;
                avgAvgCuringTime = totalAvgCuringTime / numbersOfStation;
                avgStddevCurringTime = totalStddevCurringTime / numbersOfStation;
            }

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
                totalSqrDiffAvgTemp += (parseInt(this.checkNull(dataArray[i].temp_avg)) - avgAvgTemp) ** 2;
                totalSqrStddevTemp += (parseInt(this.checkNull(dataArray[i].temp_stdev)) - avgStddevTemp) ** 2;
                totalSqrAvgPrep += (parseInt(this.checkNull(dataArray[i].pre_avg)) - avgAvgPrep) ** 2;
                totalSqrStddevPrep += (parseInt(this.checkNull(dataArray[i].pre_stdev)) - avgStddevPrep) ** 2;
                totalSqrAvgCuringTime += (parseInt(this.checkNull(dataArray[i].cur_avg)) - avgAvgCuringTime) ** 2;
                totalSqrStddevCurringTime += (parseInt(this.checkNull(dataArray[i].cur_stdev)) - avgStddevCurringTime) ** 2;
            }
            if (numbersOfStation > 0) {
                stdAvgTemp = (Math.sqrt(totalSqrDiffAvgTemp / numbersOfStation)).toFixed(3);
                stdStddevTemp = (Math.sqrt(totalSqrStddevTemp / numbersOfStation)).toFixed(3);
                stdAvgPrep = (Math.sqrt(totalSqrAvgPrep / numbersOfStation)).toFixed(3);
                stdStddevPrep = (Math.sqrt(totalSqrStddevPrep / numbersOfStation)).toFixed(3);
                stdAvgCuringTime = (Math.sqrt(totalSqrAvgCuringTime / numbersOfStation)).toFixed(3);
                stdStddevCurringTime = (Math.sqrt(totalSqrStddevCurringTime / numbersOfStation)).toFixed(3);
            }

            result = <tbody>
            <tr>
                <th>0</th>
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
            <GeneralSummaryItem spec={'AVG'} data1={avgAvgTemp} data2={avgStddevTemp}
                                data3={avgAvgPrep} data4={avgStddevPrep} data5={avgAvgCuringTime}
                                data6={avgStddevCurringTime}/>
            <GeneralSummaryItem spec={'MAX'} data1={maxAvgTemp} data2={maxStddevTemp}
                                data3={maxAvgPrep} data4={maxStddevPrep} data5={maxAvgCuringTime}
                                data6={maxStddevCurringTime}/>
            <GeneralSummaryItem spec={'MIN'} data1={minAvgTemp} data2={minStddevTemp}
                                data3={minAvgPrep} data4={minStddevPrep} data5={minAvgCuringTime}
                                data6={minStddevCurringTime}/>
            <GeneralSummaryItem spec={'STDEV'} data1={stdAvgTemp} data2={stdStddevTemp}
                                data3={stdAvgPrep} data4={stdStddevPrep} data5={stdAvgCuringTime}
                                data6={stdStddevCurringTime}/>
            </tbody>;

            // Prepare to push Process Status Data to Redux Store
            let processStatusDataToDownload = {
                processingStatusLine: [],
                general: [],
            };
            for (let i = 0; i < 8; ++i) {
                processStatusDataToDownload.processingStatusLine[i] = dataArray[i];
            }
            processStatusDataToDownload.general = [
                [avgAvgTemp, avgStddevTemp, avgAvgPrep, avgStddevPrep, avgAvgCuringTime, avgStddevCurringTime],
                [maxAvgTemp, maxStddevTemp, maxAvgPrep, maxStddevPrep, maxAvgCuringTime, maxStddevCurringTime],
                [minAvgTemp, minStddevTemp, minAvgPrep, minStddevPrep, minAvgCuringTime, minStddevCurringTime],
                [stdAvgTemp, stdStddevTemp, stdAvgPrep, stdStddevPrep, stdAvgCuringTime, stdStddevCurringTime],
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
