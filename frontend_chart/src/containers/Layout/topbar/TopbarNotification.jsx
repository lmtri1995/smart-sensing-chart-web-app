import React, {Component} from 'react'
import Notification from "../../../shared/img/Notification.svg";
import {Collapse} from 'reactstrap';

export default class TopbarNotification extends Component {
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
        return (
            <div className="topbar__profile" ref={this.setWrapperRef}>
                <button className="topbar__avatar" onClick={this.toggle}>
                    <img src={Notification}/>
                </button>
                <Collapse isOpen={this.state.collapse} className="topbar__setting-wrap">
                    <div className="topbar__notification">
                    </div>
                </Collapse>
            </div>


        )
    }
}
