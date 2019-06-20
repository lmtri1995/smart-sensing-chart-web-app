import React, {Component} from 'react';
import {Collapse} from 'reactstrap';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Clock from 'react-live-clock';
import {GlobalFilterProps} from '../../../shared/prop-types/ReducerProps';
import {changeGlobalDateFilter} from '../../../redux/actions/globalDateFilterActions';
import DateRangePicker from "../../DateTime/component/DateRangePicker";
import {ROUTE} from "../../../constants/constants";

class TopbarDateFilter extends Component {
    static propTypes = {
        globalDateFilter: GlobalFilterProps.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
        };
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    changeGlobalDateFilter = (startDate, endDate) => {
        this.props.dispatch(changeGlobalDateFilter(startDate, endDate));
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    toggle = () => {
        if (this.props.location.pathname !== ROUTE.Dashboard) {
            this.setState({collapse: !this.state.collapse});
        }
    };

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({collapse: false});
        }
    }

    render() {
        let {startDate, endDate} = this.props.globalDateFilter;
        return (
            <div className="topbar__filter" ref={this.setWrapperRef}>
                <button className="topbar__filter-button" onClick={this.toggle}>
                    <div className="topbar__filter-name topbar__filter-background-clock">
                        <div className="clock">
                            <Clock format="DD/MM/YYYY | HH:mm:ss" ticking={true} interval={1000}/>
                        </div>
                    </div>
                </button>
                <Collapse isOpen={this.state.collapse} className="topbar__menu-wrap">
                    <div className="topbar__menu">
                        <DateRangePicker toggleMenu={this.toggle}
                                         changeGlobalDateFilter={this.changeGlobalDateFilter.bind(this)}
                                         startDate={startDate}
                                         endDate={endDate}
                                         pathName={this.props.location.pathname}/>
                    </div>
                </Collapse>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    globalDateFilter: state.globalDateFilter
});

export default withRouter(connect(mapStateToProps)(TopbarDateFilter))
