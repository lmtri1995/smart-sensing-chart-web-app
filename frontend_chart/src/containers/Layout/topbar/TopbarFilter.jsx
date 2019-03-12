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
            filterMenuOpen: false,
            modelFilterMenuOpen: false,
            shiftFilterMenuOpen: false,
            downloadMenuOpen: false,
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
            filterMenuOpen: !this.state.filterMenuOpen
        });
    };

    onModelFilterMenuClicked = () => {
        this.setState({
            modelFilterMenuOpen: !this.state.modelFilterMenuOpen,
            shiftFilterMenuOpen: false,
            downloadMenuOpen: false,
        });
    };

    onModelItemClicked = (event) => {
        let item = event.target.innerText;
        this.setState(prevState => ({
            selectedModels: prevState.selectedModels.set(
                item,
                {
                    ...prevState.selectedModels.get(item),
                    selected: !prevState.selectedModels.get(item).selected,
                }
            )
        }));
        this.props.dispatch(
            changeGlobalModelFilter(this.state.selectedModels)
        );
    };

    onShiftFilterMenuClicked = () => {
        this.setState({
            modelFilterMenuOpen: false,
            shiftFilterMenuOpen: !this.state.shiftFilterMenuOpen,
            downloadMenuOpen: false,
        });
    };

    onShiftItemClicked = (event) => {
        let item = event.target.innerText;
        let selectedShifts = this.state.selectedShifts;
        selectedShifts.forEach((value, key) => {
            if (key !== item) {
                selectedShifts.set(key, false);
            } else {
                selectedShifts.set(key, true);
            }
        });
        this.setState({
            selectedShifts: selectedShifts
        });
        this.props.dispatch(
            changeGlobalShiftFilter(selectedShifts)
        );
    };

    onDownloadMenuClicked = () => {
        this.setState({
            modelFilterMenuOpen: false,
            shiftFilterMenuOpen: false,
            downloadMenuOpen: !this.state.downloadMenuOpen
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
                filterMenuOpen: false,
                modelFilterMenuOpen: false,
                shiftFilterMenuOpen: false,
                downloadMenuOpen: false
            });
        }
    }

    render() {
        let {location} = this.props;
        let modelList = ['N/A'];
        if (MODEL_NAMES && MODEL_NAMES.size > 0) {
            modelList.length = 0;
            MODEL_NAMES.forEach((object, name)  => {
                modelList.push(name);
            });
        }

        return (
            <div className="topbar__profile" ref={this.setWrapperRef}>
                <button className="topbar__avatar" onClick={this.onFilterMenuClicked}>
                    <img src={Filter}/>
                </button>
                <Collapse isOpen={this.state.filterMenuOpen} className="topbar__menu-wrap">
                    <div className="topbar_filter_menu">
                        {
                            location.pathname === ROUTE.Report // Only show Filter by Model & Shift Menu on Report Page
                                ? (
                                    <span>
                                        <button className="btn btn-secondary" onClick={this.onModelFilterMenuClicked}>
                                            Filter: Model <i className="fas fa-caret-down"></i>
                                        </button>
                                        <Collapse isOpen={this.state.modelFilterMenuOpen}
                                                  className="topbar__menu-wrap">
                                            <ListGroup>
                                                {
                                                    modelList.map((name, index) => {
                                                        let modelClassName = 'list-item__unchecked';
                                                        let model = this.state.selectedModels.get(name);
                                                        if (model && model.selected) {
                                                            modelClassName = 'list-item__checked';
                                                        }
                                                        return <ListGroupItem key={index}
                                                                              className={modelClassName}
                                                                              onClick={this.onModelItemClicked}>
                                                            {name}
                                                        </ListGroupItem>;
                                                    })
                                                }
                                            </ListGroup>
                                        </Collapse>
                                        <button className="btn btn-secondary" onClick={this.onShiftFilterMenuClicked}>
                                            Filter: Shift <i className="fas fa-caret-down"></i>
                                        </button>
                                        <Collapse isOpen={this.state.shiftFilterMenuOpen}
                                                  className="topbar__menu-wrap">
                                            <ListGroup>
                                                {
                                                    SHIFT_DESCRIPTIONS.map((shift, index) => {
                                                        let shiftClassName = 'list-item__unchecked';
                                                        if (this.state.selectedShifts.get(shift)) {
                                                            shiftClassName = 'list-item__checked';
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
                        <Collapse isOpen={this.state.downloadMenuOpen} className="topbar__menu-wrap">
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
