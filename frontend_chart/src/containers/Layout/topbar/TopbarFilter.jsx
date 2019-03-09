import React, {Component} from 'react';
import {Collapse, ListGroup, ListGroupItem} from 'reactstrap';
import DataExporter from "../../DataExporter/component/DataExporter";
import {ExportType, SHIFT_DESCRIPTIONS} from "../../../constants/constants";
import Filter from "../../../shared/img/Filter.svg";
import {connect} from "react-redux";

class TopbarFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterMenuCollapse: false,
            shiftFilterMenuCollapse: false,
            downloadCollapse: false,
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

    onDownloadMenuClicked = () => {
        this.setState({
            shiftFilterMenuCollapse: false,
            downloadCollapse: !this.state.downloadCollapse
        });
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
        return (
            <div className="topbar__profile" ref={this.setWrapperRef}>
                <button className="topbar__avatar" onClick={this.onFilterMenuClicked}>
                    <img src={Filter}/>
                </button>
                <Collapse isOpen={this.state.filterMenuCollapse} className="topbar__menu-wrap">
                    <div className="topbar_filter_menu">
                        <button className="btn btn-secondary">Filter: Model</button>
                        <button className="btn btn-secondary" onClick={this.onShiftFilterMenuClicked}>
                            Filter: Shift <i className="fas fa-caret-down"></i>
                        </button>
                        <Collapse isOpen={this.state.shiftFilterMenuCollapse} className="topbar__menu-wrap">
                            <ListGroup>
                                {
                                    SHIFT_DESCRIPTIONS.map(shift =>
                                        <ListGroupItem>
                                            {shift}
                                        </ListGroupItem>
                                    )
                                }
                            </ListGroup>
                        </Collapse>
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

export default connect()(TopbarFilter);
