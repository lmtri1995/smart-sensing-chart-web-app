import React, { Component } from 'react'

export default class Sheft extends Component {
  render() {
    return (
        <table class="table table-bordered table-dark">
        <thead>
          <tr>
            <th scope="col">Shifts' Status</th>
            <th scope="col"> 1</th>
            <th scope="col"> 2</th>
            <th scope="col"> 3</th>
            <th scope="col"> 4</th>
            <th scope="col"> 5</th>
            <th scope="col"> 6</th>
            <th scope="col"> 7</th>
            <th scope="col"> 8</th>
            <th scope="col"> Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Shifts 1</th>
            <td>100</td>
            <td>200</td>
            <td>300</td>
            <td>400</td>
            <td>500</td>
            <td>600</td>
            <td>700</td>
            <td>800</td>
            <td>900</td>
          </tr>
          <tr>
            <th scope="row">Shifts 2</th>
            <td>100</td>
            <td>200</td>
            <td>300</td>
            <td>400</td>
            <td>500</td>
            <td>600</td>
            <td>700</td>
            <td>800</td>
            <td>900</td>
          </tr>
          <tr className="table-shift-current">
            <th scope="row">Shifts 3</th>
            <td>100</td>
            <td>200</td>
            <td>300</td>
            <td>400</td>
            <td>500</td>
            <td>600</td>
            <td>700</td>
            <td>800</td>
            <td>900</td>
          </tr>
          
        </tbody>
      </table>
    )
  }
}
