import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from './TopbarProfile';
import TopbarDateFilter from "./TopbarDateFilter";
import TopbarFilter from "./TopbarFilter";
import TopbarNotification from "./TopbarNotification";
import TopbarFullScreen from "./TopbarFullScreen";
class Topbar extends Component {
    static propTypes = {
        changeMobileSidebarVisibility: PropTypes.func.isRequired,
        changeSidebarVisibility: PropTypes.func.isRequired,
    };
    click=()=>{
        this.props.goFull()
    }
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
                        <Link className="topbar__logo" to='/'/>
                    </div>
                    <div className="topbar__right">
                        
                        <TopbarDateFilter/>
                        <TopbarFilter />
                        <TopbarNotification />
                        <TopbarProfile />
                        <TopbarFullScreen goFull={this.click} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Topbar;
