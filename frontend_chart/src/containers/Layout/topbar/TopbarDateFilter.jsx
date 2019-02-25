import React, {Component} from 'react';
import DownIcon from 'mdi-react/ChevronDownIcon';
import {Collapse} from 'reactstrap';
import {connect} from 'react-redux';
import Clock from 'react-live-clock';
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


    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
        };
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
      }
    
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
      }
    toggle = () => {
        this.setState({collapse: !this.state.collapse});
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
