import React, {Component} from 'react'

export default class StationStatusItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            stationId: 0, status: 0, spaceTime: 0
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.stationId !== this.props.stationId || this.state.status !== this.props.status || this.state.spaceTime !== this.props.spaceTime ){
            this.setState((state, props) => ({
                stationId: this.props.stationId,
                status: this.props.status,
                spaceTime: this.props.spaceTime,
            }));
        }
    }

    render() {
        let {stationId, status, spaceTime} = this.state;
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
