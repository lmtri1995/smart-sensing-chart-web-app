import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import DownIcon from 'mdi-react/ChevronDownIcon';
import {Collapse} from 'reactstrap';
import {connect} from 'react-redux';

import {GlobalFilterProps} from '../../../shared/prop-types/ReducerProps';
import {changeGlobalFilter} from '../../../redux/actions/globalFilterActions';
import DateRangePicker from "../../DateTime/component/DateRangePicker";

class TopbarFilter extends PureComponent {
    static propTypes = {
        globalFilter: GlobalFilterProps.isRequired,
    };

    changeGlobalFilter = (startDate, endDate) => {
        this.props.dispatch(changeGlobalFilter(startDate, endDate));
    }

    toggle = () => {
        this.setState({collapse: !this.state.collapse});
    };

    constructor() {
        super();
        this.state = {
            collapse: false,
        };
    }

    render() {
        let {globalFilter} = this.props;
        console.log("GLOBAL_FILTER", globalFilter);
        return (
            <div className="topbar__filter">
                <button className="topbar__filter-button" onClick={this.toggle}>
                    <p className="topbar__filter-name">Global Filter</p>
                    <DownIcon className="topbar__icon"/>
                </button>
                {this.state.collapse && <button className="topbar__back" onClick={this.toggle}/>}
                <Collapse isOpen={this.state.collapse} className="topbar__menu-wrap">
                    <div className="topbar__menu">
                        <DateRangePicker
                            changeGlobalFilter={this.changeGlobalFilter}
                            startDate={globalFilter.startDate}
                            endDate={globalFilter.endDate}
                        />
                    </div>
                </Collapse>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    globalFilter: state.globalFilter
});

export default connect(mapStateToProps)(TopbarFilter)
