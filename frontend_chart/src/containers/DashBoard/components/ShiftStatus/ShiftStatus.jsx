import React, {Component} from 'react'
import ShiftStatusItem from './components/ShiftStatusItem';


export default class ShiftStatus extends Component {
    render() {
        return (
            <table className="table table-bordered table-dark">
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
                <ShiftStatusItem/>
                <ShiftStatusItem/>
                <ShiftStatusItem/>
                </tbody>
            </table>
        )
    }
}
