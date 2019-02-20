import React, { Component } from 'react';

class TopbarFullScreen extends Component {
    render() {
        return (
            <div className="topbar__profile" ref={this.setWrapperRef}>
                <button className="topbar__avatar" onClick={this.toggle}>
                    <i class="fas fa-expand-arrows-alt"></i>
                </button>
            </div> 
        );
    }
}

export default TopbarFullScreen;