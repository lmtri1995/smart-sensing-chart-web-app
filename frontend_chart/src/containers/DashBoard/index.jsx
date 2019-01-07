import React, { Component } from 'react'
import PropTypes from 'prop-types'
import StationStatus  from "./components/stationStatus";
import Sheft  from "./components/Sheft";
import Temperature from "./components/Temperature";
import ProcessStatus from "./components/ProcessStatus";
import DowntimeSheft from "./components/DowntimeSheft";
class DashboardPage extends Component {
  static propTypes = {
    prop: PropTypes
  }

  render() {
    return (
    <div className="container">
      <div className="row">
        <div className="col">
          <StationStatus />
        </div>
        <div className="col">
          <Sheft />
        </div>
      </div>
      <div className="row">
        <div className="col">
              <Temperature />
        </div>
      </div>
      <div className="row">
        <div className="col">
            <ProcessStatus />
        </div>
      </div>
      <div className="row">
        <div className="col">
         <DowntimeSheft />
        </div>
      </div>
  </div>
    )
  }
}

export default DashboardPage;
