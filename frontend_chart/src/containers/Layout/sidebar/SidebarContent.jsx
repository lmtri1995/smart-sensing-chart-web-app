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
        return (
            <div className="sidebar__content">
                {/* <ul className="sidebar__block">
          <SidebarCategory title="Layout" icon="layers">
            <button className="sidebar__link" onClick={this.props.changeToLight}>
              <p className="sidebar__link-title">Light Theme</p>
            </button>
            <button className="sidebar__link" onClick={this.props.changeToDark}>
              <p className="sidebar__link-title">Dark Theme</p>
            </button>
          </SidebarCategory>
        </ul> */}
                <ul className="sidebar__block">
                    <SidebarCategory title="Category" icon="diamond">
                        {
                            (this.state.roles != null) ? roleList.map((item, index) => {
                                return <SidebarLink key={index} title={item.title} route={item.route}
                                                    onClick={this.hideSidebar}/>
                            }) : ''
                        }
                    </SidebarCategory>
                </ul>
            </div>
        );
    }
}

export default SidebarContent;
