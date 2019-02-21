import React, { Component } from 'react';
import Expand from "../../../shared/img/Expand.svg";
import Minimize from "../../../shared/img/Minimize.svg";
class TopbarFullScreen extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         full:false
      }
    }
    
    click = () =>{
        this.props.goFull()
        this.setState({full:!this.state.full})
    }
    render() {
        return (
            <div className="topbar__profile" ref={this.setWrapperRef}>
                <button className="topbar__avatar" onClick={this.click}>
                    <img src={(this.state.full)?Minimize:Expand} />
                </button>         
            </div> 
        );
    }
}

export default TopbarFullScreen;