import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Card, CardBody, Col} from 'reactstrap';

import {GlobalFilterProps} from '../../../shared/prop-types/ReducerProps';
import {changeGlobalDateFilter} from '../../../redux/actions/globalDateFilterActions';
import DateRangePicker from "../../DateTime/component/DateRangePicker";

class ExampleCard extends Component {
    static propTypes = {
        globalDateFilter: GlobalFilterProps.isRequired,
    };

    changeGlobalDateFilter(startDate, endDate) {
        this.props.dispatch(changeGlobalDateFilter(startDate, endDate));
    }

    render() {
        let {startDate, endDate} = this.props.globalDateFilter;
        return (
            <Col md={12}>
                <Card>
                    <CardBody>
                        <DateRangePicker numWeeks={3}
                                         changeGlobalDateFilter={this.changeGlobalDateFilter.bind(this)}
                                         startDate={startDate}
                                         endDate={endDate}/>
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
