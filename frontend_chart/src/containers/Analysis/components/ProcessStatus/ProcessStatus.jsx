import React, {Component} from 'react';
import LineSummaryItem from './components/LineSummaryItem';
import GeneralSummaryItem from './components/GeneralSummaryItem';
import Singleton from "../../../../services/Socket";
import {ClipLoader} from "react-spinners";
import API from "../../../../services/api";
import {connect} from "react-redux";
import {storeProcessStatusData} from "../../../../redux/actions/downloadDataStoreActions";
import moment from "moment";

const override = `
    position: absolute;
    display:block;
    left:45%;
    top :50%;
    z-index: 100000;
`;

class ProcessStatus extends Component {
    static socket = null;
    static _isMounted = false;
    static loginData = null;
    static role = null;

    constructor(props) {
        super(props);

        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        switch (this.role) {
            case 'admin':
                this.apiUrl = 'api/os/processStatus';
                break;
            case 'ip':
                this.apiUrl = 'api/ip/processStatus';
                break;
            case 'os':
                this.apiUrl = 'api/os/processStatus';
                break;
            default:
                this.apiUrl = 'api/os/processStatus';
                break;
        }

        this.state = {
            dataArray: "",
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            let {startDate, endDate} = this.props.globalDateFilter;
            let fromTimeDevice = moment(startDate.toISOString()).unix();
            let toTimedevice   = moment(endDate.toISOString()).unix();

            let param = {
                /*"from_timedevice": fromTimeDevice,
                "to_timedevice": toTimedevice,*/
                "from_timedevice": 0,
                "to_timedevice": 0,
            };
            this.setState({
                loading: true,
            });
            API(this.apiUrl, 'POST', param)
                .then((response) => {
                    if (response.data.success) {
                        let dataArray = response.data.data;
                        this.setState({
                            dataArray: dataArray,
                            loading: false,
                        });
                    }
                })
                .catch((err) => console.log('err:', err))

        }
    }

    componentDidMount() {
        this._isMounted = true;


        let {startDate, endDate} = this.props.globalDateFilter;
        let fromTimeDevice = moment(startDate.toISOString()).unix();
        let toTimedevice   = moment(endDate.toISOString()).unix();

        let param = {
            /*"from_timedevice": fromTimeDevice,
            "to_timedevice": toTimedevice,*/
            "from_timedevice": 0,
            "to_timedevice": 0,
        };
        API(this.apiUrl, 'POST', param)
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;
                    this.setState({
                        dataArray: dataArray,
                        loading: false,
                    });
                }
            })
            .catch((err) => console.log('err:', err))
    }

    showLineItem(data, stationId) {
        let result = <LineSummaryItem stationId={stationId} avgTemp={Math.round(data.temp_avg * 100)/100}
                                      stddevTemp={Math.round(data.temp_stdev * 100)/100} avgPreparing={Math.round(data.pre_avg * 100)/100}
                                      stddevPreparing={Math.round(data.pre_stdev * 100)/100} avgCuringTime={Math.round(data.cur_avg * 100)/100}
                                      stddevCurringTime={Math.round(data.cur_stdev * 100)/100}/>;
        return result;
    }

    showGeneralItem(dataArray, spec) {
        let result = <GeneralSummaryItem spec={spec}/>;
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

            let maxAvgTemp = parseFloat(dataArray[0].temp_avg),
                maxStddevTemp = parseFloat(dataArray[0].temp_stdev),
                maxAvgPrep = parseFloat(dataArray[0].pre_avg),
                maxStddevPrep = parseFloat(dataArray[0].pre_stdev),
                maxAvgCuringTime = parseFloat(dataArray[0].cur_avg),
                maxStddevCurringTime = parseFloat(dataArray[0].cur_stdev);

            let minAvgTemp = parseFloat(dataArray[0].temp_avg),
                minStddevTemp = parseFloat(dataArray[0].temp_stdev),
                minAvgPrep = parseFloat(dataArray[0].pre_avg),
                minStddevPrep = parseFloat(dataArray[0].pre_stdev),
                minAvgCuringTime = parseFloat(dataArray[0].cur_avg),
                minStddevCurringTime = parseFloat(dataArray[0].cur_stdev);

            for (let i = 0; i < numbersOfStation; i++) {
                //for average line
                totalAvgTemp += parseFloat(dataArray[i].temp_avg);
                totalStddevTemp += parseFloat(dataArray[i].temp_stdev);
                totalAvgPrep += parseFloat(dataArray[i].pre_avg);
                totalStddevPrep += parseFloat(dataArray[i].pre_stdev);
                totalAvgCuringTime += parseFloat(dataArray[i].cur_avg);
                totalStddevCurringTime += parseFloat(dataArray[i].cur_stdev);

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

            let totalSqrDiffAvgTemp = 0,
                totalSqrStddevTemp = 0,
                totalSqrAvgPrep = 0,
                totalSqrStddevPrep = 0,
                totalSqrAvgCuringTime = 0,
                totalSqrStddevCurringTime = 0;
            for (let i = 0; i < numbersOfStation; i++) {
                totalSqrDiffAvgTemp += (parseFloat(dataArray[i].temp_avg) - avgAvgTemp) ** 2;
                totalSqrStddevTemp += (parseFloat(dataArray[i].temp_stdev) - avgStddevTemp) ** 2;
                totalSqrAvgPrep += (parseFloat(dataArray[i].pre_avg) - avgAvgPrep) ** 2;
                totalSqrStddevPrep += (parseFloat(dataArray[i].pre_stdev) - avgStddevPrep) ** 2;
                totalSqrAvgCuringTime += (parseFloat(dataArray[i].cur_avg) - avgAvgCuringTime) ** 2;
                totalSqrStddevCurringTime += (parseFloat(dataArray[i].cur_stdev) - avgStddevCurringTime) ** 2;
            }
            let stdAvgTemp = Math.sqrt(totalSqrDiffAvgTemp / numbersOfStation);
            let stdStddevTemp = Math.sqrt(totalSqrStddevTemp / numbersOfStation);
            let stdAvgPrep = Math.sqrt(totalSqrAvgPrep / numbersOfStation);
            let stdStddevPrep = Math.sqrt(totalSqrStddevPrep / numbersOfStation);
            let stdAvgCuringTime = Math.sqrt(totalSqrAvgCuringTime / numbersOfStation);
            let stdStddevCurringTime = Math.sqrt(totalSqrStddevCurringTime / numbersOfStation);

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
        return (
            <div>
                <ClipLoader
                    css={override}
                    sizeUnit={"px"}
                    size={100}
                    color={'#30D4A4'}
                    fadeIn="half"
                    fadeOut="half"
                    loading={this.state.loading}
                    margin-left={300}
                />
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
        )
    }
}

const mapStateToProps = (state) => ({
    globalDateFilter: state.globalDateFilter
});

export default connect(mapStateToProps)(ProcessStatus);
