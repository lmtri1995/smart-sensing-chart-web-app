import React, {Component} from 'react'

export default class GeneralSummaryItem extends Component {
    render() {
        let {spec, data1, data2, data3, data4, data5, data6} = this.props;

        return (
            <tr>
                <th scope="row">{spec}</th>
                <td style={{textAlign:'right'}}>{data1}</td>
                <td style={{textAlign:'right'}}>{data2}</td>
                <td style={{textAlign:'right'}}>{data3}</td>
                <td style={{textAlign:'right'}}>{data4}</td>
                <td style={{textAlign:'right'}}>{data5}</td>
                <td style={{textAlign:'right'}}>{data6}</td>
            </tr>
        );
    }
}
