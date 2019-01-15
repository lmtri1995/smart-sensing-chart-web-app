import React, { Component } from 'react';
import DowntimeShiftItem from './components/DowntimeShiftItem';

export default class DowntimeShift extends Component {
  render() {
    return (
      <div>
        <table className="table table-bordered table-dark">
            <thead>
                <tr>
                <th scope="col">Down Time By Shift</th>
                <th scope="col">1</th>
                <th scope="col">2</th>
                <th scope="col">3</th>
                <th scope="col">4</th>
                <th scope="col">5</th>
                <th scope="col">6</th>
                <th scope="col">7</th>
                <th scope="col">8</th>
                <th scope="col">Total</th>
                </tr>
            </thead>
            <tbody>
                <DowntimeShiftItem />
                <DowntimeShiftItem />
                <DowntimeShiftItem />
            </tbody>
            </table>
      </div>
    )
  }
}
