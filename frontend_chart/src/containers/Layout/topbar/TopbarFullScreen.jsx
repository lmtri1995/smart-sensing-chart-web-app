import React, { Component } from 'react';
import Expand from "../../../shared/img/Expand.svg";

class TopbarFullScreen extends Component {
    render() {
        return (
            <div className="topbar__profile" ref={this.setWrapperRef}>
                <button className="topbar__avatar" onClick={this.toggle}>
                    <img src={Expand} />
                </button>
            </div> 
        );
    }
}

export default TopbarFullScreen;