import React, { Component } from 'react';
import {Collapse} from 'reactstrap';
import DataExporter from "../../DataExporter/component/DataExporter";
import {ExportType} from "../../../constants/constants";
class TopbarFilter extends Component {
    constructor() {
        super();
        this.state = {
            collapse: false,
            collapse1: false,
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
    toggle1 = () => {
        this.setState({collapse1: !this.state.collapse1});
    };
    setWrapperRef(node) {
        this.wrapperRef = node;
      }

      handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({collapse: false,collapse1:false});
        }
      }
    render() {
        return (
            <div className="topbar__profile" ref={this.setWrapperRef}>
                <button className="topbar__avatar" onClick={this.toggle}>
                <i className="fas fa-filter"></i>
                </button>
                <Collapse isOpen={this.state.collapse} className="topbar__menu-wrap">
                    <div className="topbar_filter_menu">
                        <button className="btn btn-secondary">Filter: Model</button>
                        <button  className="btn btn-secondary">Filter: Shift</button>
                        <button className="btn btn-secondary" onClick={this.toggle1}>Dropdown link <i class="fas fa-caret-down"></i></button>
                        <Collapse isOpen={this.state.collapse1} className="topbar__menu-wrap">
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