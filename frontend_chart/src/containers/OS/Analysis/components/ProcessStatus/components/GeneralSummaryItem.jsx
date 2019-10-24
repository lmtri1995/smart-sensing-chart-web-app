import React, {Component} from 'react'

export default class GeneralSummaryItem extends Component {
    render() {
        let {spec, data1, data2, data3, data4, data5, data6} = this.props;

        return (
            <tr>
                <th scope="row">{spec}</th>
                <td className="cellText">{data1}</td>
                <td className="cellText">{data2}</td>
                <td className="cellText">{data3}</td>
                <td className="cellText">{data4}</td>
                <td className="cellText">{data5}</td>
                <td className="cellText">{data6}</td>
            </tr>
        );
    }
}
