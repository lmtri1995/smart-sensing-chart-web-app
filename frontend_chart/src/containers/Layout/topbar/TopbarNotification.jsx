import React, { Component } from 'react'
import Notification from "../../../shared/img/Notification.svg";
export default class TopbarNotification extends Component {
  render() {
    return (
        <div className="topbar__profile" ref={this.setWrapperRef}>
            <button className="topbar__avatar" onClick={this.toggle}>
                <img src={Notification} />
            </button>
        </div>
    )
  }
}
