import React, {Component} from 'react'

export default class StationStatusItem extends Component {
    render() {
        let {stationId, status, spaceTime} = this.props;
        let statusText = (status === 1) ? 'On' : 'Off';
        if (status == 'N/A'){
            statusText = 'N/A';
        }
        return (
            <div className="col boxstation">
                <div className="box">
                    <span>Station {stationId}</span>
                    <p>
                        {status === 1
                            ? <i className="fas fa-circle station-on"></i>
                            : <i className="fas fa-circle station-off"></i>
                        }
                        <span>{statusText}</span><br></br><span>{spaceTime}</span>
                    </p>
                </div>
            </div>
        );
    }
}
