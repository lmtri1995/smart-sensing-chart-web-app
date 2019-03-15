import React, {Component} from 'react';
import LineSummaryItem from './components/LineSummaryItem';
import GeneralSummaryItem from './components/GeneralSummaryItem';
import Singleton from "../../../../services/Socket";
import {ClipLoader} from "react-spinners";
import API from "../../../../services/api";
import {connect} from "react-redux";
import {storeProcessStatusData} from "../../../../redux/actions/downloadDataStoreActions";
import moment from "moment";
import {changeNumberFormat} from "../../../../shared/utils/Utilities";

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
                this.standardCycleTimeUrl = 'api/os/std';
                break;
            case 'ip':
                this.apiUrl = 'api/ip/processStatus';
                this.standardCycleTimeUrl = 'api/ip/std';
                break;
            case 'os':
                this.apiUrl = 'api/os/processStatus';
                this.standardCycleTimeUrl = 'api/os/std';
                break;
            default:
                this.apiUrl = 'api/os/processStatus';
                this.standardCycleTimeUrl = 'api/os/std';
                break;
        }

        this.state = {
            dataArray: "",
        };

        this.standardPreparingTimeArray = [];
        this.standardCuringTimeArray = [];
        this.standardTemperatureArray = [];
        this.standardCycleTimeArray = [];
        this.stdevTemperatureArray = [];
        this.stdevPreparingTimeArray = [];
        this.stdevCuringTimeArray = [];
    }


    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.countStandardCycleTime();
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

    componentDidMount = () =>{
        this.countStandardCycleTime();
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

    countStandardCycleTime() {
        let {startDate, endDate} = this.props.globalDateFilter;
        this.standardPreparingTimeArray = [];
        this.standardCuringTimeArray = [];
        // Subtract 1 day because the Oracle DB is now only store Date in YYYYMMDD format without exact Time
        let param = {
            from_workdate: moment(startDate.toISOString()).format("YYYYMMDD"),
            to_workdate: moment(endDate.toISOString()).subtract(1, "days").format("YYYYMMDD"),
        };
        let standardCycleTime1 = 0, standardCycleTime2 = 0, standardCycleTime3 = 0,
            standardCycleTime4 = 0,
            standardCycleTime5 = 0, standardCycleTime6 = 0, standardCycleTime7 = 0,
            standardCycleTime8 = 0;
        API(this.standardCycleTimeUrl, 'POST', param).then((response) => {
            let dataArray = response.data.data;
            if (dataArray && dataArray.length > 0) {
                dataArray.map(item => {
                    //{STATION_NO: 7, STD_CURING_TM: 0, STD_TEMP: 0, STD_PREPARING_TM: 0,
                    // STD_PRESSURE: 0}
                    switch (item.STATION_NO) {
                        case 1:
                            standardCycleTime1 += item.STD_PREPARING_TM + item.STD_CURING_TM;
                            this.standardPreparingTimeArray[0] = item.STD_PREPARING_TM;
                            this.standardCuringTimeArray[0] = item.STD_CURING_TM;
                            this.standardTemperatureArray[0] = item.STD_TEMP;
                            break;
                        case 2:
                            standardCycleTime2 += item.STD_PREPARING_TM + item.STD_CURING_TM;
                            this.standardPreparingTimeArray[1] = item.STD_PREPARING_TM;
                            this.standardCuringTimeArray[1] = item.STD_CURING_TM;
                            this.standardTemperatureArray[1] = item.STD_TEMP;
                            break;
                        case 3:
                            standardCycleTime3 += item.STD_PREPARING_TM + item.STD_CURING_TM;
                            this.standardPreparingTimeArray[2] = item.STD_PREPARING_TM;
                            this.standardCuringTimeArray[2] = item.STD_CURING_TM;
                            this.standardTemperatureArray[2] = item.STD_TEMP;
                            break;
                        case 4:
                            standardCycleTime4 += item.STD_PREPARING_TM + item.STD_CURING_TM;
                            this.standardPreparingTimeArray[3] = item.STD_PREPARING_TM;
                            this.standardCuringTimeArray[3] = item.STD_CURING_TM;
                            this.standardTemperatureArray[3] = item.STD_TEMP;
                            break;
                        case 5:
                            standardCycleTime5 += item.STD_PREPARING_TM + item.STD_CURING_TM;
                            this.standardPreparingTimeArray[4] = item.STD_PREPARING_TM;
                            this.standardCuringTimeArray[4] = item.STD_CURING_TM;
                            this.standardTemperatureArray[4] = item.STD_TEMP;
                            break;
                        case 6:
                            standardCycleTime6 += item.STD_PREPARING_TM + item.STD_CURING_TM;
                            this.standardPreparingTimeArray[5] = item.STD_PREPARING_TM;
                            this.standardCuringTimeArray[5] = item.STD_CURING_TM;
                            this.standardTemperatureArray[5] = item.STD_TEMP;
                            break;
                        case 7:
                            standardCycleTime7 += item.STD_PREPARING_TM + item.STD_CURING_TM;
                            this.standardPreparingTimeArray[6] = item.STD_PREPARING_TM;
                            this.standardCuringTimeArray[6] = item.STD_CURING_TM;
                            this.standardTemperatureArray[6] = item.STD_TEMP;
                            break;
                        case 8:
                            standardCycleTime8 += item.STD_PREPARING_TM + item.STD_CURING_TM;
                            this.standardPreparingTimeArray[7] = item.STD_PREPARING_TM;
                            this.standardCuringTimeArray[7] = item.STD_CURING_TM;
                            this.standardTemperatureArray[7] = item.STD_TEMP;
                            break;
                    }
                });
                this.standardCycleTimeArray = [standardCycleTime1, standardCycleTime2, standardCycleTime3, standardCycleTime4,
                    standardCycleTime5, standardCycleTime6, standardCycleTime7, standardCycleTime8];
            }
        }).catch((err) => console.log('err:', err));



    }

    showLineItem(data, stationId) {
        let temp_stdev = this.standardTemperatureArray[stationId - 1] - data.temp_avg;
        let pre_stdev = this.standardPreparingTimeArray[stationId - 1] - data.pre_avg;
        let cur_stdev = this.standardCuringTimeArray[stationId - 1] - data.cur_avg;

        let result = <LineSummaryItem stationId={stationId} avgTemp={changeNumberFormat(data.temp_avg, '°C')}
                                      stddevTemp={changeNumberFormat(temp_stdev, '°C')} avgPreparing={changeNumberFormat(data.pre_avg)}
                                      stddevPreparing={changeNumberFormat(pre_stdev)}
                                      avgCuringTime={changeNumberFormat(data.cur_avg)}
                                      stddevCurringTime={changeNumberFormat(cur_stdev)}/>;
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
        <GeneralSummaryItem spec={'STDEV'} data1="-" data2="-" data3="-" data4="-" data5="-"
                            data6="-"/>
        </tbody>;
        //If there is returned data
        if (dataArray.length > 0) {
            let numbersOfStation = 8;
            let totalAvgTemp = 0, totalStddevTemp = 0, totalAvgPrep = 0, totalStddevPrep = 0,
                totalAvgCuringTime = 0, totalStddevCurringTime = 0;

            let maxAvgTemp = parseFloat(dataArray[0].temp_avg),
                maxStddevTemp = 0,
                maxAvgPrep = parseFloat(dataArray[0].pre_avg),
                maxStddevPrep = 0,
                maxAvgCuringTime = parseFloat(dataArray[0].cur_avg),
                maxStddevCurringTime = 0;

            let minAvgTemp = parseFloat(dataArray[0].temp_avg),
                minStddevTemp = 0,
                minAvgPrep = parseFloat(dataArray[0].pre_avg),
                minStddevPrep = 0,
                minAvgCuringTime = parseFloat(dataArray[0].cur_avg),
                minStddevCurringTime = 0;

            //Count for stdevTemperatureArray, stdevpreparingTimeArray, stdevCuringTimeArray
            for (let i = 0; i < numbersOfStation; i++){
                this.stdevTemperatureArray[i] = parseFloat(this.standardTemperatureArray[i] - dataArray[i].temp_avg);
                this.stdevPreparingTimeArray[i] = parseFloat(this.standardPreparingTimeArray[i] - dataArray[i].pre_avg);
                this.stdevCuringTimeArray[i] = parseFloat(this.standardCuringTimeArray[i] - dataArray[i].cur_avg);

                totalStddevTemp += parseFloat(this.stdevTemperatureArray[i]);
                totalStddevPrep += parseFloat(this.stdevPreparingTimeArray[i]);
                totalStddevCurringTime += parseFloat(this.stdevCuringTimeArray[i]);

                maxStddevTemp = (maxStddevTemp < parseFloat(this.stdevTemperatureArray[i])) ? parseFloat(this.stdevTemperatureArray[i]) : maxStddevTemp;
                maxStddevPrep = (maxStddevPrep < parseFloat(this.stdevPreparingTimeArray[i])) ? parseFloat(this.stdevPreparingTimeArray[i]) : maxStddevPrep;
                maxStddevCurringTime = (maxStddevCurringTime < parseFloat(dataArray[i].cur_stdev)) ? parseFloat(dataArray[i].cur_stdev) : maxStddevCurringTime;

                minStddevTemp = (minStddevTemp < parseFloat(this.stdevTemperatureArray[i])) ? minStddevTemp : parseFloat(this.stdevTemperatureArray[i]);
                minStddevPrep = (minStddevPrep < parseFloat(this.stdevPreparingTimeArray[i])) ? minStddevPrep : parseFloat(this.stdevPreparingTimeArray[i]);
                minStddevCurringTime = (minStddevCurringTime < parseFloat(this.stdevCuringTimeArray[i])) ? minStddevCurringTime : parseFloat(this.stdevCuringTimeArray[i]);
            }

            for (let i = 0; i < numbersOfStation; i++) {
                //for average line
                totalAvgTemp += parseFloat(dataArray[i].temp_avg);
                totalAvgPrep += parseFloat(dataArray[i].pre_avg);
                totalAvgCuringTime += parseFloat(dataArray[i].cur_avg);

                //for max line
                maxAvgTemp = (maxAvgTemp < parseFloat(dataArray[i].temp_avg)) ? parseFloat(dataArray[i].temp_avg) : maxAvgTemp;
                maxAvgPrep = (maxAvgPrep < parseFloat(dataArray[i].pre_avg)) ? parseFloat(dataArray[i].pre_avg) : maxAvgPrep;
                maxAvgCuringTime = (maxAvgCuringTime < parseFloat(dataArray[i].cur_avg)) ? parseFloat(dataArray[i].cur_avg) : maxAvgCuringTime;

                //for min line
                minAvgTemp = (minAvgTemp < parseFloat(dataArray[i].temp_avg)) ? minAvgTemp : parseFloat(dataArray[i].temp_avg);
                minAvgPrep = (minAvgPrep < parseFloat(dataArray[i].pre_avg)) ? minAvgPrep : parseFloat(dataArray[i].pre_avg);
                minAvgCuringTime = (minAvgCuringTime < parseFloat(dataArray[i].cur_avg)) ? minAvgCuringTime : parseFloat(dataArray[i].cur_avg);
            }
            let avgAvgTemp = totalAvgTemp / numbersOfStation;
            let avgStddevTemp = totalStddevTemp / numbersOfStation;
            let avgAvgPrep = totalAvgPrep / numbersOfStation;
            let avgStddevPrep = totalStddevPrep / numbersOfStation;
            let avgAvgCuringTime = totalAvgCuringTime / numbersOfStation;
            let avgStddevCurringTime = totalStddevCurringTime / numbersOfStation;

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
            <GeneralSummaryItem spec={'AVG'} data1={changeNumberFormat(avgAvgTemp, "°C")}
                                data2={changeNumberFormat(avgStddevTemp, "°C")}
                                data3={changeNumberFormat(avgAvgPrep)}
                                data4={changeNumberFormat(avgStddevPrep)}
                                data5={changeNumberFormat(avgAvgCuringTime)}
                                data6={changeNumberFormat(avgStddevCurringTime)}/>
            <GeneralSummaryItem spec={'MAX'} data1={changeNumberFormat(maxAvgTemp, "°C")}
                                data2={changeNumberFormat(maxStddevTemp, "°C")}
                                data3={changeNumberFormat(maxAvgPrep)} data4={(maxStddevPrep)}
                                data5={changeNumberFormat(maxAvgCuringTime)}
                                data6={changeNumberFormat(maxStddevCurringTime)}/>
            <GeneralSummaryItem spec={'MIN'}
                                data1={changeNumberFormat(minAvgTemp, "°C")}
                                data2={changeNumberFormat(minStddevTemp, "°C")}
                                data3={changeNumberFormat(minAvgPrep)} data4={changeNumberFormat(minStddevPrep)}
                                data5={changeNumberFormat(minAvgCuringTime)}
                                data6={changeNumberFormat(minStddevCurringTime)}/>
            <GeneralSummaryItem spec={'STDEV'} data1="-" data2="-"
                                data3="-" data4="-" data5="-"
                                data6="-" />
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
                processStatusDataToDownload.processingStatusLine[i].push(changeNumberFormat(dataArray[i]['temp_avg'], "°C"));
                processStatusDataToDownload.processingStatusLine[i].push(changeNumberFormat(this.stdevTemperatureArray[i], "°C"));
                processStatusDataToDownload.processingStatusLine[i].push(changeNumberFormat(dataArray[i]['pre_avg']));
                processStatusDataToDownload.processingStatusLine[i].push(changeNumberFormat(this.stdevPreparingTimeArray[i]));
                processStatusDataToDownload.processingStatusLine[i].push(changeNumberFormat(dataArray[i]['cur_avg']));
                processStatusDataToDownload.processingStatusLine[i].push(changeNumberFormat(this.stdevCuringTimeArray[i]));
            }
            processStatusDataToDownload.general = [
                [changeNumberFormat(avgAvgTemp, "°C"), changeNumberFormat(avgStddevTemp, "°C"), changeNumberFormat(avgAvgPrep), changeNumberFormat(avgStddevPrep), changeNumberFormat(avgAvgCuringTime), changeNumberFormat(avgStddevCurringTime)],
                [changeNumberFormat(maxAvgTemp, "°C"), changeNumberFormat(maxStddevTemp, "°C"), changeNumberFormat(maxAvgPrep), changeNumberFormat(maxStddevPrep), changeNumberFormat(maxAvgCuringTime), changeNumberFormat(maxStddevCurringTime)],
                [changeNumberFormat(minAvgTemp, "°C"), changeNumberFormat(minStddevTemp, "°C"), changeNumberFormat(minAvgPrep), changeNumberFormat(minStddevPrep), changeNumberFormat(minAvgCuringTime), changeNumberFormat(minStddevCurringTime)],
                ["-", "-", "-", "-", "-", "-"],
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
