import React, { Component } from 'react'

export default class DowntimeSheft extends Component {
  render() {
    return (
      <div>
        <table class="table table-bordered table-dark">
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
                <tr>
                <th scope="row">Shift 1</th>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>1293</td>
                </tr>
                <tr>
                <th scope="row">Shift 2</th>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>1293</td>
                </tr>
                <tr>
                <th scope="row">Shift 3</th>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>293</td>
                <td>1293</td>
                </tr>
            </tbody>
            </table>
      </div>
    )
  }
}
