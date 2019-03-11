import React, {Component} from 'react';
import {Collapse, ListGroup, ListGroupItem} from 'reactstrap';
import DataExporter from "../../DataExporter/component/DataExporter";
import {ExportType, MODEL_NAMES, ROUTE, SHIFT_DESCRIPTIONS} from "../../../constants/constants";
import Filter from "../../../shared/img/Filter.svg";
import {connect} from "react-redux";
import {changeGlobalShiftFilter} from "../../../redux/actions/globalShiftFilterActions";
import {withRouter} from "react-router-dom";
import API from "../../../services/api";
import {changeGlobalModelFilter} from "../../../redux/actions/globalModelFilterActions";

class TopbarFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterMenuCollapse: false,
            shiftFilterMenuCollapse: false,
            downloadCollapse: false,
            selectedModels: props.globalModelFilter.selectedModels,
            selectedShifts: props.globalShiftFilter.selectedShifts,
        };
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

        this.requestModelTypesForFiltering();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    onFilterMenuClicked = () => {
        this.setState({
            filterMenuCollapse: !this.state.filterMenuCollapse
        });
    };

    onShiftFilterMenuClicked = () => {
        this.setState({
            shiftFilterMenuCollapse: !this.state.shiftFilterMenuCollapse,
            downloadCollapse: false,
        });
    };

    onShiftItemClicked = (event) => {
        let item = event.target.innerText;
        this.setState(prevState => ({
            selectedShifts: prevState.selectedShifts.set(item, !prevState.selectedShifts.get(item))
        }));
        this.props.dispatch(
            changeGlobalShiftFilter(this.state.selectedShifts)
        );
    };

    onDownloadMenuClicked = () => {
        this.setState({
            shiftFilterMenuCollapse: false,
            downloadCollapse: !this.state.downloadCollapse
        });
    };

    requestModelTypesForFiltering = () => {
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;

        let link = 'ip';
        switch (this.role) {
            case 'admin':
                link = 'os';
                break;
            case 'ip':
                link = 'ip';
                break;
            case 'os':
                link = 'os';
                break;
        }
        API(`api/${link}/modelName`, 'POST', {})
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;

                    if (dataArray) {
                        MODEL_NAMES.clear();

                        dataArray.forEach(element => {
                            MODEL_NAMES.set(
                                element.value,
                                {
                                    key: element.key,
                                    selected: true,
                                }
                            );
                        });

                        this.setState({
                            selectedModels: MODEL_NAMES,
                        });

                        this.props.dispatch(changeGlobalModelFilter(MODEL_NAMES));
                    }
                }
            })
            .catch((err) => console.log('err: ', err));
    };

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({
                filterMenuCollapse: false,
                shiftFilterMenuCollapse: false,
                downloadCollapse: false
            });
        }
    }

    render() {
        let {location} = this.props;

        return (
            <div className="topbar__profile" ref={this.setWrapperRef}>
                <button className="topbar__avatar" onClick={this.onFilterMenuClicked}>
                    <img src={Filter}/>
                </button>
                <Collapse isOpen={this.state.filterMenuCollapse} className="topbar__menu-wrap">
                    <div className="topbar_filter_menu">
                        {
                            location.pathname === ROUTE.Report // Only show Filter by Model & Shift Menu on Report Page
                                ? (
                                    <span>
                                        <button className="btn btn-secondary">Filter: Model</button>
                                        <button className="btn btn-secondary" onClick={this.onShiftFilterMenuClicked}>
                                            Filter: Shift <i className="fas fa-caret-down"></i>
                                        </button>
                                        <Collapse isOpen={this.state.shiftFilterMenuCollapse}
                                                  className="topbar__menu-wrap">
                                            <ListGroup>
                                                {
                                                    SHIFT_DESCRIPTIONS.map((shift, index) => {
                                                        let shiftClassName = 'list-group__unchecked';
                                                        if (this.state.selectedShifts.get(shift)) {
                                                            shiftClassName = 'list-group__checked';
                                                        }
                                                        return <ListGroupItem key={index}
                                                                              className={shiftClassName}
                                                                              onClick={this.onShiftItemClicked}>
                                                            {shift}
                                                        </ListGroupItem>;
                                                    })
                                                }
                                            </ListGroup>
                                        </Collapse>
                                    </span>
                                )
                                : null
                        }
                        <button className="btn btn-secondary" onClick={this.onDownloadMenuClicked}>
                            Download <i className="fas fa-caret-down"></i>
                        </button>
                        <Collapse isOpen={this.state.downloadCollapse} className="topbar__menu-wrap">
                            <div className="col-12">
                                <DataExporter exportType={ExportType.EXCEL}/>
                                <DataExporter exportType={ExportType.PDF}/>
                                <DataExporter exportType={ExportType.PNG}/>
                            </div>
                        </Collapse>
                    </div>
                </Collapse>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    globalModelFilter: state.globalModelFilter,
    globalShiftFilter: state.globalShiftFilter,
});

export default withRouter(connect(mapStateToProps)(TopbarFilter));
