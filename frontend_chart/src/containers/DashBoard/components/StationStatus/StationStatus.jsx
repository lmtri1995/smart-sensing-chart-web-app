import React, {Component} from 'react';
import StationStatusItem from './components/StationStatusItem';

export default class stationStatus extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col boxstation">
                        <h4>On/Off</h4>
                    </div>
                </div>
                <div className="row">
                    <StationStatusItem/>
                    <StationStatusItem/>
                    <StationStatusItem/>
                    <StationStatusItem/>
                    <StationStatusItem/>
                    <StationStatusItem/>
                    <StationStatusItem/>
                    <StationStatusItem/>
                </div>
                <div className="row">
                    <StationStatusItem/>
                    <StationStatusItem/>
                    <StationStatusItem/>
                    <StationStatusItem/>
                    <StationStatusItem/>
                    <StationStatusItem/>
                    <StationStatusItem/>
                    <StationStatusItem/>
                </div>
            </div>
        )
    }
}
