import React, {Component} from 'react';
import {Collapse} from 'reactstrap';
import DataExporter from "../../DataExporter/component/DataExporter";
import {ExportType} from "../../../constants/constants";
import Filter from "../../../shared/img/Filter.svg";

class TopbarFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterMenuCollapse: false,
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

    onDownloadMenuClicked = () => {
        this.setState({
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
                        <button className="btn btn-secondary">Filter: Shift</button>
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

export default TopbarFilter;
