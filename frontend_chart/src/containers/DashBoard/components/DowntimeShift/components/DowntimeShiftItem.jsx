import React, {Component} from 'react'

export default class DowntimeShiftItem extends Component {
    render() {
        let {shiftNo, total, count1, count2, count3, count4, count5, count6, count7, count8} = this.props;
        return (
            <tr>
                <th scope="row">Shift {shiftNo}</th>
                <td>{count1}</td>
                <td>{count2}</td>
                <td>{count3}</td>
                <td>{count4}</td>
                <td>{count5}</td>
                <td>{count6}</td>
                <td>{count7}</td>
                <td>{count8}</td>
                <td>{total}</td>
            </tr>
        );
    }
}
