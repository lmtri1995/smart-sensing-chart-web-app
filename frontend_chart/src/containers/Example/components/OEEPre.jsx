import React, { Component } from 'react'

export class OEEPre extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         
      }
    }
    
  render() {
    return (
        <div className="oee-main">
        <div className="col-12"><h4>OEE</h4></div>
        <div className="oee-box">
            <div className="container">
                <div className="row">
                    <div className="col align-self-center"><i class="fas fa-arrow-up"></i><span>67.5%</span></div>
                </div>
            </div>
        </div>
        </div>
    )
  }
}

export default OEEPre
