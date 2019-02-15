import React, {Component} from 'react';
import DownIcon from 'mdi-react/ChevronDownIcon';
import {Collapse} from 'reactstrap';
import {connect} from 'react-redux';

import {GlobalFilterProps} from '../../../shared/prop-types/ReducerProps';
import {changeGlobalDateFilter} from '../../../redux/actions/globalDateFilterActions';
import DateRangePicker from "../../DateTime/component/DateRangePicker";

class TopbarDateFilter extends Component {
    static propTypes = {
        globalDateFilter: GlobalFilterProps.isRequired,
    };

    changeGlobalDateFilter = (startDate, endDate) => {
        this.props.dispatch(changeGlobalDateFilter(startDate, endDate));
    }

    toggle = () => {
        this.setState({collapse: !this.state.collapse});
    };

    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
        };
    }

    render() {
        let {startDate, endDate} = this.props.globalDateFilter;
        console.log("GLOBAL_DATE_FILTER", `startDate: ${startDate} - endDate: ${endDate}`);
        return (
            <div className="topbar__filter">
                <button className="topbar__filter-button" onClick={this.toggle}>
                    <p className="topbar__filter-name">Global Filter</p>
                    <DownIcon className="topbar__icon"/>
                </button>
                {this.state.collapse && <button className="topbar__back" onClick={this.toggle}/>}
                <Collapse isOpen={this.state.collapse} className="topbar__menu-wrap">
                    <div className="topbar__menu">
                        <DateRangePicker numWeeks={3}
                                         changeGlobalDateFilter={this.changeGlobalDateFilter.bind(this)}
                                         startDate={startDate}
                                         endDate={endDate}/>
                    </div>
                </Collapse>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    globalDateFilter: state.globalDateFilter
});

export default connect(mapStateToProps)(TopbarDateFilter)