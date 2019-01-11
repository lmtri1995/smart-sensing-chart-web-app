import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Card, CardBody, Col} from 'reactstrap';

import {GlobalFilterProps} from '../../../shared/prop-types/ReducerProps';
import {changeAnalysisDateFilter} from '../../../redux/actions/globalDateFilterActions';
import DateRangePicker from "../../DateTime/component/DateRangePicker";

class ExampleCard extends Component {
    static propTypes = {
        globalDateFilter: GlobalFilterProps.isRequired,
    };

    changeAnalysisDateFilter(startDate, endDate) {
        this.props.dispatch(changeAnalysisDateFilter(startDate, endDate));
    }

    render() {
        let {startDateAnalysis, endDateAnalysis} = this.props.globalDateFilter;
        return (
            <Col md={12}>
                <Card>
                    <CardBody>
                        <DateRangePicker numWeeks={3}
                                         changeGlobalDateFilter={this.changeAnalysisDateFilter.bind(this)}
                                         startDate={startDateAnalysis}
                                         endDate={endDateAnalysis}/>
                    </CardBody>
                </Card>
            </Col>
        );
    }
}

const mapStateToProps = (state) => ({
    globalDateFilter: state.globalDateFilter,
});

export default connect(mapStateToProps)(ExampleCard);
