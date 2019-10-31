import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';
import {RoleList} from "../../../constants/Rolesconfig";

class SidebarContent extends Component {
    static propTypes = {
        changeToDark: PropTypes.func.isRequired,
        changeToLight: PropTypes.func.isRequired,
        onClick: PropTypes.func.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            roles: 'admin'
        }
    }

    hideSidebar = () => {
        this.props.onClick();
    };

    componentWillReceiveProps() {
        this.setState({roles: JSON.parse(localStorage.getItem('logindata')).data.role})
    }

    render() {
        let loginData = JSON.parse(localStorage.getItem('logindata'));
        let roleList = RoleList['admin'];
        if (loginData && loginData.data.role === 'as'){
            roleList = RoleList['as'];
        } else {
            roleList = RoleList['admin'];
        }

        let ipRoleList = RoleList['ip'];
        let ipCategoryList = <SidebarCategory title="IP" icon="diamond">
                                    {
                                        (this.state.roles != null) ? ipRoleList.map((item, index) => {
                                            return <SidebarLink key={index} title={item.title} route={item.route}
                                                                onClick={this.hideSidebar}/>
                                        }) : ''
                                    }
                                </SidebarCategory>

        let osRoleList = RoleList['os'];
        let osCategoryList = <SidebarCategory title="OS" icon="diamond">
            {
                (this.state.roles != null) ? osRoleList.map((item, index) => {
                    return <SidebarLink key={index} title={item.title} route={item.route}
                                        onClick={this.hideSidebar}/>
                }) : ''
            }
        </SidebarCategory>

        let asRoleList = RoleList['as'];
        let asCategoryList = <SidebarCategory title="Assembly" icon="diamond">
                                {
                                    (this.state.roles != null) ? asRoleList.map((item, index) => {
                                        return <SidebarLink key={index} title={item.title} route={item.route}
                                                            onClick={this.hideSidebar}/>
                                    }) : ''
                                }
                            </SidebarCategory>
        return (
            <div className="sidebar__content">
                <ul className="sidebar__block">
                    {/*<SidebarCategory title="Assembly" icon="diamond">
                        {
                            (this.state.roles != null) ? roleList.map((item, index) => {
                                return <SidebarLink key={index} title={item.title} route={item.route}
                                                    onClick={this.hideSidebar}/>
                            }) : ''
                        }
                    </SidebarCategory>*/}
                    {ipCategoryList}
                    {osCategoryList}
                    {asCategoryList}
                </ul>
            </div>
        );
    }
}

export default SidebarContent;
