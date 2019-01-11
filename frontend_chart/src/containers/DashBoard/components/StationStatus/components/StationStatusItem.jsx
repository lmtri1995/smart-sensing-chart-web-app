import React, { Component } from 'react'


export default class StationStatusItem extends Component {
    render(){
        return (
            <div className="col boxstation">
                <div className="box">
                    <span>Station 1</span>
                    <p><i
                        className="fas fa-circle"></i><span>On/Off</span><br></br><span>500</span>
                    </p>
                </div>
            </div>
        );
    }
}
