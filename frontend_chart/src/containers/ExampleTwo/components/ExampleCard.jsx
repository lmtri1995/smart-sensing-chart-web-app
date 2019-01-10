import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Card, CardBody, Col} from 'reactstrap';

import {GlobalFilterProps} from '../../../shared/prop-types/ReducerProps';
import {changeGlobalFilter} from '../../../redux/actions/globalFilterActions';
import CustomDateRangePicker from "../../DateTime/component/CustomDateRangePicker";

class ExampleCard extends Component {
    static propTypes = {
        globalFilter: GlobalFilterProps.isRequired,
    };

    changeGlobalFilter(startDate, endDate) {
        this.props.dispatch(changeGlobalFilter(startDate, endDate));
    }

    render() {
        let {startDate, endDate} = this.props.globalFilter;
        return (
            <Col md={12}>
                <Card>
                    <CardBody>
                        <CustomDateRangePicker numWeeks={3}
                                               changeGlobalFilter={this.changeGlobalFilter.bind(this)}
                                               startDate={startDate}
                                               endDate={endDate}/>
                    </CardBody>
                </Card>
            </Col>
        );
    }
}

const mapStateToProps = (state) => ({
    globalFilter: state.globalFilter,
});

export default connect(mapStateToProps)(ExampleCard);
