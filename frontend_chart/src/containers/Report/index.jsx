import React, {Component} from 'react';
import DefectRate from './components/DefectRate';
import DefectRateOverview from './components/DefectRateOverview';
import ProductionRate from './components/ProductionRate';
import ProductionRateOverview from './components/ProductionRateOverview';
import {TabContent, TabPane} from 'reactstrap';
import API from "../../services/api";

class ReportPage extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1',
            dateLabels: null,
            productionRate: null,
            defectByTypeOverTime: null,
        };

        let param = {
            from_workdate: "20190216",
            to_workdate: "20190225",
        };
        API('api/os/productionRate', 'POST', param)
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;

                    let dateLabels = [], dataToShow = [];
                    let shift1 = [], shift2 = [], shift3 = [];

                    dataArray.map(currentDay => {
                        switch (currentDay['SHIFT_NO']) {
                            case '1':
                                shift1.push(currentDay['PRODUCTION_RATE']);
                                dateLabels.push(currentDay['WORK_DATE']);
                                break;
                            case '2':
                                shift2.push(currentDay['PRODUCTION_RATE']);
                                break;
                            case '3':
                                shift3.push(currentDay['PRODUCTION_RATE']);
                                break;
                        }
                    });

                    dataToShow.push(shift1, shift2, shift3);

                    console.log("DATE_LABELS_PRODUCTION_RATE", dateLabels);
                    console.log("DATA_TO_SHOW_PRODUCTION_RATE", dataToShow);

                    this.setState({
                        ...this.state,
                        dateLabels: dateLabels,
                        productionRate: dataToShow,
                    });
                }
            })
            .catch((err) => console.log('err:', err));

        API('api/os/defectByTypeOverTime', 'POST', param)
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;

                    let dateLabels = [], dataToShow = [];
                    let defectType1 = [], defectType2 = [], defectType3 = [], defectType4 = [];

                    dataArray.map(currentDay => {
                        defectType1.push(currentDay['DEFECT_COUNT1']);
                        defectType2.push(currentDay['DEFECT_COUNT2']);
                        defectType3.push(currentDay['DEFECT_COUNT3']);
                        defectType4.push(currentDay['DEFECT_COUNT4']);

                        dateLabels.push(currentDay['WORK_DATE']);
                    });

                    dataToShow.push(defectType1, defectType2, defectType3, defectType4);

                    console.log("DATE_LABELS_DEFECT_BY_TYPE", dateLabels);
                    console.log("DATA_TO_SHOW_DEFECT_BY_TYPE", dataToShow);

                    this.setState({
                        ...this.state,
                        dateLabels: dateLabels,
                        defectByTypeOverTime: dataToShow,
                    });
                }
            })
            .catch((err) => console.log('err:', err));
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

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
                                <ProductionRate/>
                            </div>
                            <div className="col-3">
                                <ProductionRateOverview/>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tabId="2">
                        <div className="row">
                            <div className="col-9">
                                <DefectRate/>
                            </div>
                            <div className="col-3">
                                <DefectRateOverview/>
                            </div>
                        </div>
                    </TabPane>
                </TabContent>
            </div>
        );
    }
}

export default ReportPage;
