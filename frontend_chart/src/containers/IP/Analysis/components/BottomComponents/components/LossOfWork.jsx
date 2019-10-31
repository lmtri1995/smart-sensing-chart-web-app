import React, {Component}   from 'react'
import {changeNumberFormat} from "../../../../../../shared/utils/Utilities";

export class LossOfWork extends Component {
    render() {
        let {workLossNumber} = this.props;
        workLossNumber = Math.round(workLossNumber * 100) / 100;
        workLossNumber = workLossNumber > 100 ? 100 : workLossNumber;
        return (
            <div className="oee-main">
                <div className="col-12"><h4>Lost of work</h4></div>
                <div className="oee-box">
                    <div className="container">
                        <div className="row">
                            <div className="col align-self-center">
                                <i className="fas fa-arrow-up"></i>
                                <span>{workLossNumber}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LossOfWork
