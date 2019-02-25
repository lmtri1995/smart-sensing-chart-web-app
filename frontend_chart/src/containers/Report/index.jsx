import React, {Component} from 'react';
import DefectRate from './components/DefectRate';
import DefectRateOverview from './components/DefectRateOverview';
import ProductionRate from './components/ProductionRate';
import ProductionRateOverview from './components/ProductionRateOverview';
import {TabContent, TabPane} from 'reactstrap';

class ReportPage extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1'
        };
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
            // <div className="container report">
            //         <div className="row">

            //             <div className="col-10">
            //                 <h3>Line 1111</h3>
            //             </div>
            //             <div className="col-2">
            //                 <div class="btn-group" >
            //                     <button type="button" class="btn btn-primary">Productivity</button>
            //                     <button type="button" class="btn btn-secondary">Defect</button>
            //                 </div>
            //             </div>

            //         </div>
            //         <div className="row">

            //             <div className="col-9">
            //             <DefectRate />
            //             </div>
            //             <div className="col-3">
            //             <DefectRateOverview />
            //             </div>
            //         </div>
            // </div>
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
