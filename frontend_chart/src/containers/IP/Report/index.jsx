import React, {Component}                             from 'react';
import DefectRate                                     from './components/DefectRate';
import DefectRateOverview                             from './components/DefectRateOverview';
import ProductionRate                                 from './components/ProductionRate';
import ProductionRateOverview                         from './components/ProductionRateOverview';
import {TabContent, TabPane}                          from 'reactstrap';
import API                                            from "../../../services/api";
import moment                                         from "moment";
import {GlobalFilterProps}                            from "../../../shared/prop-types/ReducerProps";
import {connect}                                      from "react-redux";
import {
    ARTICLE_NAMES,
    DEFECT_COLORS,
    IP_DEFECT_NAME,
    OS_DEFECT_NAME,
    REPORT_CONTAINER_ID,
    REPORT_DEFECT_RATE_ID,
    REPORT_PRODUCTION_RATE_ID,
    REPORT_TABS,
    SHIFT_OPTIONS
}                                                     from "../../../constants/constants";
import {storeDefectRateData, storeProductionRateData} from "../../../redux/actions/downloadDataStoreActions";
import {changeReportSelectedTab}                      from "../../../redux/actions/reportSelectedTabActions";

class ReportPage extends Component {
    static propTypes = {
        globalDateFilter: GlobalFilterProps.isRequired,
    };

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: REPORT_TABS[0],
            productionRateDateLabels: null,
            productionRate: null,
            targetProduction: null,
            actualProduction: null,
            productionRateLoading: true,
            defectRateDateLabels: null,
            defectByTypeOverTime: null,
            defectRateLoading: true,
        };

        this.productionRateDataToDownload = null;
        this.defectRateDataToDownload = null;

        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;

        this.lineCode = '4B01';
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
            switch (tab) {
                case REPORT_TABS[0]:
                    this.props.dispatch(changeReportSelectedTab(REPORT_TABS[0]));
                    this.props.dispatch(storeProductionRateData(this.productionRateDataToDownload));
                    this.props.dispatch(storeDefectRateData(null));
                    break;
                case REPORT_TABS[1]:
                    this.props.dispatch(changeReportSelectedTab(REPORT_TABS[1]));
                    this.props.dispatch(storeProductionRateData(null));
                    this.props.dispatch(storeDefectRateData(this.defectRateDataToDownload));
                    break;
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state !== prevState) {
            switch (this.state.activeTab) {
                case REPORT_TABS[0]:
                    this.props.dispatch(storeProductionRateData(this.productionRateDataToDownload));
                    this.props.dispatch(storeDefectRateData(null));
                    break;
                case REPORT_TABS[1]:
                    this.props.dispatch(storeProductionRateData(null));
                    this.props.dispatch(storeDefectRateData(this.defectRateDataToDownload));
                    break;
            }
        }
        if (this.props !== prevProps) {
            let {startDate, endDate} = this.props.globalDateFilter;

            let startMoment = moment(startDate.toISOString());
            let endMoment = moment(endDate.toISOString());

            // If Date Range > 7 days => subtract endDate => Max Date Range is 7 days
            if (endMoment.diff(startMoment, "days") > 6) {
                let tempEndMoment = moment(endMoment);
                startMoment = moment(tempEndMoment.subtract(7, "days"));
            }

            let articleName = this.props.globalArticleFilter.selectedArticle[0] === ARTICLE_NAMES.keys().next().value
                ? ''
                : this.props.globalArticleFilter.selectedArticle[0];
            // Subtract 1 day because the Oracle DB is now only store Date in YYYYMMDD format without exact Time
            let productionRatesParam = {
                from_workdate: startMoment.format("YYYYMMDD"),
                // Copy endMoment to new moment object to prevent from affecting original endMoment object
                // when subtracting 1 day
                // => Wrong request params for Defect Rate below
                to_workdate: moment(endMoment).subtract(1, "days").format("YYYYMMDD"),
                model_name: this.props.globalModelFilter.selectedModel[1].key,
                article_no: articleName,
            };

            let shiftNo;
            switch (this.props.globalShiftFilter.selectedShift) {
                case SHIFT_OPTIONS[0]:
                    shiftNo = '';
                    break;
                case SHIFT_OPTIONS[1]:
                    shiftNo = 1;
                    break;
                case SHIFT_OPTIONS[2]:
                    shiftNo = 2;
                    break;
                case SHIFT_OPTIONS[3]:
                    shiftNo = 3;
                    break;
                default:
                    shiftNo = '';
                    break;
            }
            let defectRatesParam = shiftNo
                ? {
                    shift_no: shiftNo,
                    from_workdate: startMoment.format("YYYYMMDD"),
                    to_workdate: moment(endMoment).subtract(1, "days").format("YYYYMMDD"),
                }
                : {
                    from_workdate: startMoment.format("YYYYMMDD"),
                    to_workdate: moment(endMoment).subtract(1, "days").format("YYYYMMDD"),
                };

            this.requestProductionRates(productionRatesParam);
            this.requestDefectByTypeOverTime(defectRatesParam);
        }
    }

    componentDidMount() {
        let {startDate, endDate} = this.props.globalDateFilter;

        // Subtract 1 day because the Oracle DB is now only store Date in YYYYMMDD format without exact Time
        let param = {
            from_workdate: moment(startDate.toISOString()).format("YYYYMMDD"),
            to_workdate: moment(endDate.toISOString()).subtract(1, "days").format("YYYYMMDD"),
        };

        this.requestProductionRates(param);
        this.requestDefectByTypeOverTime(param);
    }

    requestProductionRates = (param) => {
        let link = 'ip';
        API(`api/${link}/productionRate`, 'POST', param)
            .then((response) => {
                // No need to check if(response.data.success)
                // For Model Filter to work
                // Because if response.data.success === false
                // => response.data.data = []   Empty Array
                let dataArray = response.data.data;

                let {from_workdate, to_workdate} = param;
                let startMoment = moment(from_workdate, "YYYYMMDD");
                let endMoment = moment(to_workdate, "YYYYMMDD");

                let dateLabelsAndProductionRatesMap = new Map();
                while (startMoment.isSameOrBefore(endMoment)) {
                    // array of 3 (zero) elements for 3 production rates of 3 shifts each day
                    dateLabelsAndProductionRatesMap.set(
                        startMoment.format('DD/MM/YYYY'),
                        {
                            productionRate: [0, 0, 0],
                            targetProduction: [0, 0, 0],
                            actualProduction: [0, 0, 0],
                        }
                    );

                    startMoment = startMoment.add(1, "days");
                }

                let shiftDataOfCurrentDay, currentProductionRate = 0;
                let currentDayTargetProductions;
                let currentDayActualProductions;
                dataArray.map(currentData => {
                    currentProductionRate = currentData['PRODUCTION_RATE'];
                    // Round to 2 decimal places
                    currentProductionRate = currentProductionRate % 1 === 0
                        ? currentProductionRate
                        : Math.round(currentProductionRate * 100) / 100;

                    switch (currentData['SHIFT_NO']) {
                        case '1':
                            shiftDataOfCurrentDay = dateLabelsAndProductionRatesMap
                                .get(currentData['WORK_DATE'])
                                .productionRate;
                            currentDayTargetProductions = dateLabelsAndProductionRatesMap
                                .get(currentData['WORK_DATE'])
                                .targetProduction;
                            currentDayActualProductions = dateLabelsAndProductionRatesMap
                                .get(currentData['WORK_DATE'])
                                .actualProduction;

                            shiftDataOfCurrentDay[0] = currentProductionRate;
                            currentDayTargetProductions[0] = currentData['TARGET_QTY'];
                            currentDayActualProductions[0] = currentData['ACTUAL_QTY'];

                            dateLabelsAndProductionRatesMap.set(
                                currentData['WORK_DATE'],
                                {
                                    productionRate: shiftDataOfCurrentDay,
                                    targetProduction: currentDayTargetProductions,
                                    actualProduction: currentDayActualProductions,
                                }
                            );
                            break;
                        case '2':
                            shiftDataOfCurrentDay = dateLabelsAndProductionRatesMap
                                .get(currentData['WORK_DATE'])
                                .productionRate;
                            currentDayTargetProductions = dateLabelsAndProductionRatesMap
                                .get(currentData['WORK_DATE'])
                                .targetProduction;
                            currentDayActualProductions = dateLabelsAndProductionRatesMap
                                .get(currentData['WORK_DATE'])
                                .actualProduction;

                            shiftDataOfCurrentDay[1] = currentProductionRate;
                            currentDayTargetProductions[1] = currentData['TARGET_QTY'];
                            currentDayActualProductions[1] = currentData['ACTUAL_QTY'];

                            dateLabelsAndProductionRatesMap.set(
                                currentData['WORK_DATE'],
                                {
                                    productionRate: shiftDataOfCurrentDay,
                                    targetProduction: currentDayTargetProductions,
                                    actualProduction: currentDayActualProductions,
                                }
                            );
                            break;
                        case '3':
                            shiftDataOfCurrentDay = dateLabelsAndProductionRatesMap
                                .get(currentData['WORK_DATE'])
                                .productionRate;
                            currentDayTargetProductions = dateLabelsAndProductionRatesMap
                                .get(currentData['WORK_DATE'])
                                .targetProduction;
                            currentDayActualProductions = dateLabelsAndProductionRatesMap
                                .get(currentData['WORK_DATE'])
                                .actualProduction;

                            shiftDataOfCurrentDay[2] = currentProductionRate;
                            currentDayTargetProductions[2] = currentData['TARGET_QTY'];
                            currentDayActualProductions[2] = currentData['ACTUAL_QTY'];

                            dateLabelsAndProductionRatesMap.set(
                                currentData['WORK_DATE'],
                                {
                                    productionRate: shiftDataOfCurrentDay,
                                    targetProduction: currentDayTargetProductions,
                                    actualProduction: currentDayActualProductions,
                                }
                            );
                            break;
                    }
                });

                let dateLabels = [];
                let productionRatesShift1 = [], productionRatesShift2 = [], productionRatesShift3 = [];
                let averageProductionRate = 0, averageProductionRatesByDay = [];

                let targetProductionsShift1 = [], targetProductionsShift2 = [], targetProductionsShift3 = [];
                let targetProductions = [];

                let actualProductionsShift1 = [], actualProductionsShift2 = [], actualProductionsShift3 = [];
                let actualProductions = [];

                let productionRateDataToDownload = [];
                dateLabelsAndProductionRatesMap.forEach((shiftData, date) => {
                    dateLabels.push(date);

                    productionRatesShift1.push(shiftData.productionRate[0]);
                    productionRatesShift2.push(shiftData.productionRate[1]);
                    productionRatesShift3.push(shiftData.productionRate[2]);

                    targetProductionsShift1.push(shiftData.targetProduction[0]);
                    targetProductionsShift2.push(shiftData.targetProduction[1]);
                    targetProductionsShift3.push(shiftData.targetProduction[2]);

                    actualProductionsShift1.push(shiftData.actualProduction[0]);
                    actualProductionsShift2.push(shiftData.actualProduction[1]);
                    actualProductionsShift3.push(shiftData.actualProduction[2]);

                    averageProductionRate = (
                        shiftData.productionRate[0] +
                        shiftData.productionRate[1] +
                        shiftData.productionRate[2]
                    ) / 3;

                    averageProductionRate = averageProductionRate % 1 !== 0
                        ? Math.round(averageProductionRate * 100) / 100
                        : averageProductionRate;

                    averageProductionRatesByDay.push(averageProductionRate);    // Average of 3 shifts

                    productionRateDataToDownload.push([
                        date,
                        // Shift 1
                        shiftData.targetProduction[0],
                        shiftData.actualProduction[0],
                        shiftData.productionRate[0],
                        // Shift 2
                        shiftData.targetProduction[1],
                        shiftData.actualProduction[1],
                        shiftData.productionRate[1],
                        // Shift 3
                        shiftData.targetProduction[2],
                        shiftData.actualProduction[2],
                        shiftData.productionRate[2],
                        // Average by date
                        averageProductionRate,
                    ]);
                });
                targetProductions.push(targetProductionsShift1, targetProductionsShift2, targetProductionsShift3);
                actualProductions.push(actualProductionsShift1, actualProductionsShift2, actualProductionsShift3);
                productionRateDataToDownload.push([
                    "", // This cell in Excel and PDF is for "SUMMARY" string
                    // Shift 1
                    targetProductionsShift1.reduce((acc, curVal) => acc + curVal, 0),   // Total Target
                    actualProductionsShift1.reduce((acc, curVal) => acc + curVal, 0),   // Total Actual
                    productionRatesShift1.reduce((acc, curVal) => acc + curVal, 0) / productionRatesShift1.length,  // Average Production Rate
                    // Shift 2
                    targetProductionsShift2.reduce((acc, curVal) => acc + curVal, 0),   // Total Target
                    actualProductionsShift2.reduce((acc, curVal) => acc + curVal, 0),   // Total Actual
                    productionRatesShift2.reduce((acc, curVal) => acc + curVal, 0) / productionRatesShift2.length,  // Average Production Rate
                    // Shift 3
                    targetProductionsShift3.reduce((acc, curVal) => acc + curVal, 0),   // Total Target
                    actualProductionsShift3.reduce((acc, curVal) => acc + curVal, 0),   // Total Actual
                    productionRatesShift3.reduce((acc, curVal) => acc + curVal, 0) / productionRatesShift3.length,  // Average Production Rate
                    // Average of All Production Rates in current Date Range
                    averageProductionRatesByDay.reduce((acc, curVal) => acc + curVal, 0) / averageProductionRatesByDay.length,
                ]);

                let dataToShow = [];
                // Colors = Shift 1 + Shift 2 + Shift 3 + Average line + Average point background color
                let colors = ['#FF9C64', '#8C67F6', '#F575F7', '#EBEDF1', '#CCCCCC'];
                for (let i = 1; i <= 4; ++i) {  // 3 Shifts' Production Rates + 1 Average Production Rates
                    if (i < 4) {
                        dataToShow.push(
                            {
                                label: SHIFT_OPTIONS[i],
                                backgroundColor: colors[i - 1],
                                data: eval(`productionRatesShift${i}`)
                            }
                        );
                    } else {
                        dataToShow.push(
                            {
                                label: 'Average',
                                borderColor: colors[i - 1],
                                borderWidth: 2,
                                pointRadius: 0,
                                pointBorderWidth: 2,
                                pointBackgroundColor: colors[i],
                                pointBorderColor: colors[i - 1],
                                data: averageProductionRatesByDay,

                                type: 'line',
                                fill: false,
                                tension: 0
                            }
                        );
                    }
                }

                this.setState({
                    ...this.state,
                    productionRateDateLabels: dateLabels,
                    productionRate: dataToShow,
                    targetProduction: targetProductions,
                    actualProduction: actualProductions,
                    productionRateLoading: false,
                });

                this.productionRateDataToDownload = productionRateDataToDownload;
            })
            .catch((err) => console.log('err:', err));
    };

    requestDefectByTypeOverTime = (param) => {
        let link = 'ip';
        let defectTypes = IP_DEFECT_NAME;

        API(`api/${link}/defectByTypeOverTime`, 'POST', param)
            .then((response) => {
                // No need to check if(response.data.success)
                // For Model Filter to work
                // Because if response.data.success === false
                // => response.data.data = []   Empty Array

                let dataArray;
                if (response && response.data && response.data.data) {
                    dataArray = response.data.data;
                } else {
                    dataArray = null;
                }

                let {from_workdate, to_workdate} = param;
                let startMoment = moment(from_workdate, "YYYYMMDD");
                let endMoment = moment(to_workdate, "YYYYMMDD");

                let dateLabelsAndDefectRatesMap = new Map();
                while (startMoment.isSameOrBefore(endMoment)) {
                    // array of 4 (zero) elements for 4 defect rates of 4 shifts each day
                    dateLabelsAndDefectRatesMap.set(
                        startMoment.format('DD/MM/YYYY'),
                        [0, 0, 0, 0, 0, 0, 0, 0, 0]
                    );

                    startMoment = startMoment.add(1, "days");
                }

                if (dataArray) {
                    let defectRatesOfCurrentDay;
                    dataArray.map(currentDay => {
                        defectRatesOfCurrentDay = dateLabelsAndDefectRatesMap.get(currentDay['WORK_DATE']);

                        defectRatesOfCurrentDay[0] += currentDay['DEFECT_COUNT1'];
                        defectRatesOfCurrentDay[1] += currentDay['DEFECT_COUNT2'];
                        defectRatesOfCurrentDay[2] += currentDay['DEFECT_COUNT3'];
                        defectRatesOfCurrentDay[3] += currentDay['DEFECT_COUNT4'];
                        defectRatesOfCurrentDay[4] += currentDay['DEFECT_COUNT5'];
                        defectRatesOfCurrentDay[5] += currentDay['DEFECT_COUNT6'];
                        defectRatesOfCurrentDay[6] += currentDay['DEFECT_COUNT7'];
                        defectRatesOfCurrentDay[7] += currentDay['DEFECT_COUNT8'];
                        defectRatesOfCurrentDay[8] += currentDay['DEFECT_COUNT9'];

                        dateLabelsAndDefectRatesMap.set(currentDay['WORK_DATE'], defectRatesOfCurrentDay);
                    });
                }

                let dateLabels = [];
                let defectType1 = [], defectType2 = [], defectType3 = [], defectType4 = [],
                    defectType5 = [], defectType6 = [], defectType7 = [], defectType8 = [],
                    defectType9 = [];
                let totalDefectsByDay = [];

                let defectRateDataToDownload = [];
                dateLabelsAndDefectRatesMap.forEach((defectRates, date) => {
                    dateLabels.push(date);

                    defectType1.push(defectRates[0]);
                    defectType2.push(defectRates[1]);
                    defectType3.push(defectRates[2]);
                    defectType4.push(defectRates[3]);
                    defectType5.push(defectRates[4]);
                    defectType6.push(defectRates[5]);
                    defectType7.push(defectRates[6]);
                    defectType8.push(defectRates[7]);
                    defectType9.push(defectRates[8]);

                    totalDefectsByDay.push(
                        defectRates[0] + defectRates[1] + defectRates[2] + defectRates[3] +
                        defectRates[4] + defectRates[5] + defectRates[6] + defectRates[7] +
                        defectRates[8]
                    );

                    defectRateDataToDownload.push([
                        date,
                        // Defect Count of Type 1
                        defectRates[0],
                        // Defect Count of Type 2
                        defectRates[1],
                        // Defect Count of Type 3
                        defectRates[2],
                        // Defect Count of Type 4
                        defectRates[3],
                        // Defect Count of Type 5
                        defectRates[4],
                        // Defect Count of Type 6
                        defectRates[5],
                        // Defect Count of Type 7
                        defectRates[6],
                        // Defect Count of Type 8
                        defectRates[7],
                        // Defect Count of Type 9
                        defectRates[8],
                        // Total Count by Day
                        defectRates[0] + defectRates[1] + defectRates[2] + defectRates[3] +
                        defectRates[4] + defectRates[5] + defectRates[6] + defectRates[7] +
                        defectRates[8],
                    ]);
                });
                defectRateDataToDownload.push([
                    "", // This cell in Excel and PDF is for "TOTAL COUNT BY TYPE" string
                    defectType1.reduce((acc, curVal) => acc + curVal, 0),   // Total Count by Type 1
                    defectType2.reduce((acc, curVal) => acc + curVal, 0),   // Total Count by Type 2
                    defectType3.reduce((acc, curVal) => acc + curVal, 0),   // Total Count by Type 3
                    defectType4.reduce((acc, curVal) => acc + curVal, 0),   // Total Count by Type 4
                    defectType5.reduce((acc, curVal) => acc + curVal, 0),   // Total Count by Type 5
                    defectType6.reduce((acc, curVal) => acc + curVal, 0),   // Total Count by Type 6
                    defectType7.reduce((acc, curVal) => acc + curVal, 0),   // Total Count by Type 7
                    defectType8.reduce((acc, curVal) => acc + curVal, 0),   // Total Count by Type 8
                    defectType9.reduce((acc, curVal) => acc + curVal, 0),   // Total Count by Type 9
                    // Total Count of All Types in current Date Range
                    totalDefectsByDay.reduce((acc, curVal) => acc + curVal, 0),
                ]);

                let dataToShow = [];
                for (let i = 1; i <= 10; ++i) {  // 9 Defect Types + 1 Total Defect
                    if (i < 10) {
                        dataToShow.push(
                            {
                                label: defectTypes[i - 1],
                                backgroundColor: DEFECT_COLORS[i - 1],
                                data: eval(`defectType${i}`)
                            }
                        );
                    } else {
                        dataToShow.push(
                            {
                                label: 'Total Defects',
                                borderColor: DEFECT_COLORS[i - 1],
                                borderWidth: 2,
                                pointRadius: 0,
                                pointBorderWidth: 2,
                                pointBackgroundColor: DEFECT_COLORS[i],
                                pointBorderColor: DEFECT_COLORS[i - 1],
                                data: totalDefectsByDay,

                                type: 'line',
                                fill: false,
                                tension: 0
                            }
                        );
                    }
                }

                let isAllZero = true;
                for (let i = dataToShow.length - 2; i >= 0; --i) {
                    isAllZero = true;

                    dataToShow[i].data.forEach(val => val > 0 ? isAllZero = false : null);

                    if (isAllZero) {
                        dataToShow.splice(i, 1);
                    }
                }

                this.setState({
                    ...this.state,
                    defectRateDateLabels: dateLabels,
                    defectByTypeOverTime: dataToShow,
                    defectRateLoading: false,
                });

                this.defectRateDataToDownload = defectRateDataToDownload;
            })
            .catch((err) => console.log('err:', err));
    };

    render() {
        return (
            <div className="container report" id={REPORT_CONTAINER_ID}>
                <div className="row">
                    <div className="col-10">
                        <h3>Line {this.lineCode}</h3>
                    </div>
                    <div className="col-2">
                        <div className="btn-group">
                            <button type="button"
                                    className={(this.state.activeTab === REPORT_TABS[0]) ? "btn btn-primary active" : "btn btn-secondary"}
                                    onClick={() => {
                                        this.toggle(REPORT_TABS[0]);
                                    }}
                            >Productivity
                            </button>
                            <button type="button"
                                    className={(this.state.activeTab === REPORT_TABS[1]) ? "btn btn-primary active" : "btn btn-secondary"}
                                    onClick={() => {
                                        this.toggle(REPORT_TABS[1]);
                                    }}
                            >Defect
                            </button>
                        </div>
                    </div>
                </div>

                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <div className="row" id={REPORT_PRODUCTION_RATE_ID}>
                            <div className="col-9">
                                <ProductionRate labels={this.state.productionRateDateLabels}
                                                productionRate={this.state.productionRate}
                                                targetProduction={this.state.targetProduction}
                                                actualProduction={this.state.actualProduction}/>
                            </div>
                            <div className="col-3">
                                <ProductionRateOverview productionRate={this.state.productionRate}
                                                        actualProduction={this.state.actualProduction}
                                                        loading={this.state.productionRateLoading}/>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tabId="2">
                        <div className="row" id={REPORT_DEFECT_RATE_ID}>
                            <div className="col-9">
                                <DefectRate labels={this.state.defectRateDateLabels}
                                            defectByTypeOverTime={this.state.defectByTypeOverTime}/>
                            </div>
                            <div className="col-3">
                                <DefectRateOverview defectByTypeOverTime={this.state.defectByTypeOverTime}
                                                    loading={this.state.defectRateLoading}/>
                            </div>
                        </div>
                    </TabPane>
                </TabContent>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    reportSelectedTab: state.reportSelectedTab,
    globalDateFilter: state.globalDateFilter,
    globalModelFilter: state.globalModelFilter,
    globalArticleFilter: state.globalArticleFilter,
    globalShiftFilter: state.globalShiftFilter,
});

export default connect(mapStateToProps)(ReportPage);
