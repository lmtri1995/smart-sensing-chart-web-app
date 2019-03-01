import React, {Component} from 'react';
import DefectRate from './components/DefectRate';
import DefectRateOverview from './components/DefectRateOverview';
import ProductionRate from './components/ProductionRate';
import ProductionRateOverview from './components/ProductionRateOverview';
import {TabContent, TabPane} from 'reactstrap';
import API from "../../services/api";
import moment from "moment";
import {GlobalFilterProps} from "../../shared/prop-types/ReducerProps";
import {connect} from "react-redux";

class ReportPage extends Component {
    static propTypes = {
        globalDateFilter: GlobalFilterProps.isRequired,
    };

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1',
            dateLabels: null,
            productionRate: null,
            defectByTypeOverTime: null,
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            let {startDate, endDate} = this.props.globalDateFilter;

            // Subtract 1 day because the Oracle DB is now only store Date in YYYYMMDD format without exact Time
            let param = {
                from_workdate: moment(startDate.toISOString()).format("YYYYMMDD"),
                to_workdate: moment(endDate.toISOString()).subtract(1, "days").format("YYYYMMDD"),
            };

            this.requestProductionRates(param);
            this.requestDefectByTypeOverTime(param);

        }
    }

    componentDidMount() {
        let {startDate, endDate} = this.props.globalDateFilter;

        let param = {
            from_workdate: moment(startDate.toISOString()).format("YYYYMMDD"),
            to_workdate: moment(endDate.toISOString()).subtract(1, "days").format("YYYYMMDD"),
        };

        this.requestProductionRates(param);
        this.requestDefectByTypeOverTime(param);
    }

    requestProductionRates = (param) => {
        API('api/os/productionRate', 'POST', param)
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;

                    let dateLabels = [], dataToShow = [];
                    let shift1 = [], shift2 = [], shift3 = [];
                    let averageProductionRatesByDay = [];

                    let totalProductionRateOfCurrentDay = 0, currentProductionRate = 0;
                    dataArray.map(currentDay => {
                        currentProductionRate = currentDay['PRODUCTION_RATE'];
                        // Round to 2 decimal places
                        currentProductionRate = currentProductionRate % 1 === 0
                            ? currentProductionRate
                            : Math.round(currentProductionRate * 100) / 100;

                        switch (currentDay['SHIFT_NO']) {
                            case '1':
                                shift1.push(currentProductionRate);
                                dateLabels.push(currentDay['WORK_DATE']);

                                totalProductionRateOfCurrentDay = 0;
                                totalProductionRateOfCurrentDay += currentProductionRate;
                                break;
                            case '2':
                                shift2.push(currentProductionRate);

                                totalProductionRateOfCurrentDay += currentProductionRate;
                                break;
                            case '3':
                                shift3.push(currentProductionRate);

                                totalProductionRateOfCurrentDay += currentProductionRate;

                                averageProductionRatesByDay.push(totalProductionRateOfCurrentDay / 3); // Average of 3 shifts
                                break;
                        }

                    });

                    // Colors = Shift 1 + Shift 2 + Shift 3 + Average line + Average point background color
                    let colors = ['#FF9C64', '#8C67F6', '#F575F7', '#EBEDF1', '#CCCCCC'];
                    for (let i = 1; i <= 4; ++i) {  // 3 Shifts' Production Rates + 1 Average Production Rates
                        if (i < 4) {
                            dataToShow.push(
                                {
                                    label: `Shift ${i}`,
                                    backgroundColor: colors[i - 1],
                                    data: eval(`shift${i}`)
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
                        dateLabels: dateLabels,
                        productionRate: dataToShow,
                    });
                }
            })
            .catch((err) => console.log('err:', err));
    };

    requestDefectByTypeOverTime = (param) => {
        API('api/os/defectByTypeOverTime', 'POST', param)
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;

                    let dateLabels = [], dataToShow = [];
                    let defectType1 = [], defectType2 = [], defectType3 = [], defectType4 = [];
                    let totalDefectsByDay = [];

                    let totalDefectOfCurrentDay = 0, currentDefect = 0;
                    dataArray.map(currentDay => {
                        for (let i = 1; i <= 4; ++i) {  // 4 Defect Types
                            currentDefect = currentDay[`DEFECT_COUNT${i}`];

                            eval(`defectType${i}.push(currentDefect)`);

                            totalDefectOfCurrentDay += currentDefect;
                        }
                        totalDefectsByDay.push(totalDefectOfCurrentDay);
                        totalDefectOfCurrentDay = 0;

                        dateLabels.push(currentDay['WORK_DATE']);
                    });

                    // Colors = Type 1 + Type 2 + Type 3 + Type 4 + Total Defect line + Total Defect point background color
                    let colors = ['#FF9C64', '#46D6EA', '#F575F7', '#8C67F6', '#EB6A91', '#EBEDF1'];
                    for (let i = 1; i <= 5; ++i) {  // 4 Defect Types + 1 Total Defect
                        if (i < 5) {
                            dataToShow.push(
                                {
                                    label: `Type ${i}`,
                                    backgroundColor: colors[i - 1],
                                    data: eval(`defectType${i}`)
                                }
                            );
                        } else {
                            dataToShow.push(
                                {
                                    label: 'Total Defect',
                                    borderColor: colors[i - 1],
                                    borderWidth: 2,
                                    pointRadius: 0,
                                    pointBorderWidth: 2,
                                    pointBackgroundColor: colors[i],
                                    pointBorderColor: colors[i - 1],
                                    data: totalDefectsByDay,

                                    type: 'line',
                                    fill: false,
                                    tension: 0
                                }
                            );
                        }
                    }

                    this.setState({
                        ...this.state,
                        dateLabels: dateLabels,
                        defectByTypeOverTime: dataToShow,
                    });
                }
            })
            .catch((err) => console.log('err:', err));
    };

    render() {
        return (
            <div className="container report">
                <div className="row">
                    <div className="col-10">
                        <h3>Line 1111</h3>
                    </div>
                    <div className="col-2">
                        <div className="btn-group">
                            <button type="button"
                                    className={(this.state.activeTab === '1') ? "btn btn-primary active" : "btn btn-secondary"}
                                    onClick={() => {
                                        this.toggle('1');
                                    }}
                            >Productivity
                            </button>
                            <button type="button"
                                    className={(this.state.activeTab === '2') ? "btn btn-primary active" : "btn btn-secondary"}
                                    onClick={() => {
                                        this.toggle('2');
                                    }}
                            >Defect
                            </button>
                        </div>
                    </div>
                </div>

                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <div className="row">
                            <div className="col-9">
                                <ProductionRate labels={this.state.dateLabels}
                                                productionRate={this.state.productionRate}/>
                            </div>
                            <div className="col-3">
                                <ProductionRateOverview productionRate={this.state.productionRate}/>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tabId="2">
                        <div className="row">
                            <div className="col-9">
                                <DefectRate labels={this.state.dateLabels}
                                            defectByTypeOverTime={this.state.defectByTypeOverTime}/>
                            </div>
                            <div className="col-3">
                                <DefectRateOverview defectByTypeOverTime={this.state.defectByTypeOverTime}/>
                            </div>
                        </div>
                    </TabPane>
                </TabContent>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    globalDateFilter: state.globalDateFilter
});

export default connect(mapStateToProps)(ReportPage);
