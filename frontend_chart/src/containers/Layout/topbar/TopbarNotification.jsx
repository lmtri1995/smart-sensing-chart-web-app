import React, { Component } from 'react'

export default class TopbarNotification extends Component {
  render() {
    return (
        <div className="topbar__profile" ref={this.setWrapperRef}>
            <button className="topbar__avatar" onClick={this.toggle}>
                <i class="fas fa-bell"></i>
            </button>
        </div>
    )
  }
}
