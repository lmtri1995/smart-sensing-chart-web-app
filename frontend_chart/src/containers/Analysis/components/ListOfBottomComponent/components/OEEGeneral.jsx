import React, {Component} from 'react';
import {changeNumberFormat} from "../../../../../shared/utils/Utilities";

export class OEEGeneral extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let {OEENumber} = this.props;
        return (
            <div className="oee-main">
                <div className="col-12"><h4>OEE</h4></div>
                <div className="oee-box">
                    <div className="container">
                        <div className="row">
                            <div className="col align-self-center"><i
                                className="fas fa-arrow-up"></i><span>{OEENumber}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default OEEGeneral
