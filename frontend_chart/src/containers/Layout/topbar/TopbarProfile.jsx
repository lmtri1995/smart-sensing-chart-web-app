import React, {PureComponent} from 'react';
import {Collapse} from 'reactstrap';
import TopbarMenuLink from './TopbarMenuLink';
import Setting from "../../../shared/img/Setting.svg";
import {ROUTE} from "../../../constants/constants";

const Ava = `${process.env.PUBLIC_URL}/img/ava.png`;

export default class TopbarProfile extends PureComponent {
    static loginData = null;

    constructor() {
        super();

        this.loginData = JSON.parse(localStorage.getItem('logindata'));

        this.state = {
            collapse: false,
        };
    }

    toggle = () => {
        this.setState({collapse: !this.state.collapse});
    };

    render() {
        let loginData = JSON.parse(localStorage.getItem('logindata'));
        let username = '';
        if (this.loginData) {
            username = loginData.data.username;
        }

        return (
            <div className="topbar__profile">
                <button className="topbar__avatar" onClick={this.toggle}>
                    <img src={Setting}/>
                </button>
                {this.state.collapse && <button className="topbar__back" onClick={this.toggle}/>}
                <Collapse isOpen={this.state.collapse} className="topbar__setting-wrap">
                    <div className="topbar__setting">
                        <div className="text-center">{username}</div>
                        <div className="topbar__menu-divider"/>
                        <TopbarMenuLink title="Sign Out" icon="exit" path={ROUTE.Logout}/>
                    </div>
                </Collapse>
            </div>
        );
    }
}
