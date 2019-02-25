import React, {Component} from 'react'

export default class GeneralSummaryItem extends Component {
    render() {
        let {spec, data1, data2, data3, data4, data5, data6} = this.props;

        return (
            <tr>
                <th scope="row">{spec}</th>
                <td>{data1}</td>
                <td>{data2}</td>
                <td>{data3}</td>
                <td>{data4}</td>
                <td>{data5}</td>
                <td>{data6}</td>
            </tr>
        );
    }
}
