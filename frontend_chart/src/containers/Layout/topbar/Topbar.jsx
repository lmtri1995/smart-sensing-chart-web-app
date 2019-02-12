import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from './TopbarProfile';
import TopbarFilter from "./TopbarFilter";
import Clock from 'react-live-clock';
import DataExporter from "../../DataExporter/component/DataExporter";
import {ExportType} from "../../../constants/constants";

class Topbar extends Component {
    static propTypes = {
        changeMobileSidebarVisibility: PropTypes.func.isRequired,
        changeSidebarVisibility: PropTypes.func.isRequired,
    };

    render() {

        const {changeMobileSidebarVisibility, changeSidebarVisibility} = this.props;

        return (
            <div className="topbar">
                <div className="topbar__wrapper">
                    <div className="topbar__left">
                        <TopbarSidebarButton
                            changeMobileSidebarVisibility={changeMobileSidebarVisibility}
                            changeSidebarVisibility={changeSidebarVisibility}
                        />
                        <Link className="topbar__logo" to="/dashboard_default"/>
                    </div>
                    <div className="topbar__right">
                        <DataExporter exportType={ExportType.EXCEL}/>
                        <DataExporter exportType={ExportType.PDF}/>
                        <DataExporter exportType={ExportType.PNG}/>
                        <div className="clock">
                            <Clock format="DD/MM/YYYY | HH:mm:ss" ticking={true} interval={1000}/>
                        </div>
                        <TopbarFilter/>
                        <TopbarProfile/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Topbar;
