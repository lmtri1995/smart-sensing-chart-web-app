import React, {Component} from 'react'


export default class ShiftStatusItem extends Component {
    render() {
        let {shiftNo, total, count1, count2, count3, count4, count5, count6, count7, count8} = this.props;
        return (
            <tr>
                <th scope="row">{shiftNo}</th>
                <td className="cellText">{count1}</td>
                <td className="cellText">{count2}</td>
                <td className="cellText">{count3}</td>
                <td className="cellText">{count4}</td>
                <td className="cellText">{count5}</td>
                <td className="cellText">{count6}</td>
                <td className="cellText">{count7}</td>
                <td className="cellText">{count8}</td>
                <td className="cellText">{total}</td>
            </tr>
        );
    }
}
