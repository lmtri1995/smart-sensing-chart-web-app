import React, {Component} from 'react'

export class OEEGeneral extends Component {

    render() {
        let {OEENumber} = this.props;
        OEENumber = (OEENumber || OEENumber==0)?OEENumber:'N/A';
        return (
            <div className="oee-main">
                <div className="col-12"><h4>OEE</h4></div>
                <div className="oee-box">
                    <div className="container">
                        <div className="row">
                            <div className="col align-self-center"><i
                                className="fas fa-arrow-up"></i><span>{OEENumber}%</span></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default OEEGeneral
