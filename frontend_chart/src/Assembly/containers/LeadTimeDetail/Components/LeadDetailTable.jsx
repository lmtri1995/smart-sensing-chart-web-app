import React, {Component} from "react";
import {Table,}           from 'reactstrap';

class LeadDetailTable extends Component {
	constructor(props) {
		super(props);
	}

	fillRow = (data, i = 0) => {
		if (data) {
			return (<tr key={i}>
				<td>{data.process_nm}</td>
				<td style={{
					textAlign : 'center',
					color     : data.flag_Qty_0730 && data.flag_Qty_0730 != "" ? '#FF9C64' : '#BEBEBE',
					borderLeft: '3px solid #BEBEBE'
				}}>{data.Qty_0730}</td>
				<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{data.LT_0730}</td>
				<td style={{
					textAlign : 'center',
					color     : data.flag_Qty_0830 && data.flag_Qty_0830 != "" ? '#FF9C64' : '#BEBEBE',
					borderLeft: '3px solid #BEBEBE'
				}}>{data.Qty_0830}</td>
				<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{data.LT_0830}</td>
				<td style={{
					textAlign : 'center',
					color     : data.flag_Qty_0930 && data.flag_Qty_0930 != "" ? '#FF9C64' : '#BEBEBE',
					borderLeft: '3px solid #BEBEBE'
				}}>{data.Qty_0930}</td>
				<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{data.LT_0930}</td>
				<td style={{
					textAlign : 'center',
					color     : data.flag_Qty_1030 && data.flag_Qty_1030 != "" ? '#FF9C64' : '#BEBEBE',
					borderLeft: '3px solid #BEBEBE'
				}}>{data.Qty_1030}</td>
				<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{data.LT_1030}</td>
				<td style={{
					textAlign : 'center',
					color     : data.flag_Qty_1130 && data.flag_Qty_1130 != "" ? '#FF9C64' : '#BEBEBE',
					borderLeft: '3px solid #BEBEBE'
				}}>{data.Qty_1130}</td>
				<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{data.LT_1130}</td>
				<td style={{
					textAlign : 'center',
					color     : data.flag_Qty_1230 && data.flag_Qty_1230 != "" ? '#FF9C64' : '#BEBEBE',
					borderLeft: '3px solid #BEBEBE'
				}}>{data.Qty_1230}</td>
				<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{data.LT_1230}</td>
				<td style={{
					textAlign : 'center',
					color     : data.flag_Qty_1330 && data.flag_Qty_1330 != "" ? '#FF9C64' : '#BEBEBE',
					borderLeft: '3px solid #BEBEBE'
				}}>{data.Qty_1330}</td>
				<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{data.LT_1330}</td>
				<td style={{
					textAlign : 'center',
					color     : data.flag_Qty_1430 && data.flag_Qty_1430 != "" ? '#FF9C64' : '#BEBEBE',
					borderLeft: '3px solid #BEBEBE'
				}}>{data.Qty_1430}</td>
				<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{data.LT_1430}</td>
				<td style={{
					textAlign : 'center',
					color     : data.flag_Qty_1530 && data.flag_Qty_1530 != "" ? '#FF9C64' : '#BEBEBE',
					borderLeft: '3px solid #BEBEBE'
				}}>{data.Qty_1530}</td>
				<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{data.LT_1530}</td>
				<td style={{
					textAlign : 'center',
					color     : data.flag_Qty_1630 && data.flag_Qty_1630 != "" ? '#FF9C64' : '#BEBEBE',
					borderLeft: '3px solid #BEBEBE'
				}}>{data.Qty_1630}</td>
				<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{data.LT_1630}</td>
				<td style={{
					textAlign : 'center',
					color     : data.flag_Qty_1730 && data.flag_Qty_1730 != "" ? '#FF9C64' : '#BEBEBE',
					borderLeft: '3px solid #BEBEBE'
				}}>{data.Qty_1730}</td>
				<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{data.LT_1730}</td>
				<td style={{
					textAlign : 'center',
					color     : data.flag_Qty_1830 && data.flag_Qty_1830 != "" ? '#FF9C64' : '#BEBEBE',
					borderLeft: '3px solid #BEBEBE'
				}}>{data.Qty_1830}</td>
				<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{data.LT_1830}</td>
				<td style={{
					textAlign : 'center',
					color     : data.flag_Qty_1930 && data.flag_Qty_1930 != "" ? '#FF9C64' : '#BEBEBE',
					borderLeft: '3px solid #BEBEBE'
				}}>{data.Qty_1930}</td>
				<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{data.LT_1930}</td>
				<td style={{
					textAlign : 'center',
					color     : data.flag_Qty_2030 && data.flag_Qty_2030 != "" ? '#FF9C64' : '#BEBEBE',
					borderLeft: '3px solid #BEBEBE'
				}}>{data.Qty_2030}</td>
				<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{data.LT_2030}</td>
				<td style={{
					textAlign : 'center',
					color     : data.flag_Qty_2130 && data.flag_Qty_2130 != "" ? '#FF9C64' : '#BEBEBE',
					borderLeft: '3px solid #BEBEBE'
				}}>{data.Qty_2130}</td>
				<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{data.LT_2130}</td>
				<td style={{
					textAlign : 'center',
					color     : data.flag_Qty_2230 != "" ? '#FF9C64' : '#BEBEBE',
					borderLeft: '3px solid #BEBEBE'
				}}>{data.Qty_2230}</td>
				<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{data.LT_2230}</td>
				<td style={{textAlign: 'center', backgroundColor: '#082738'}}>{data.totalQty}</td>
				<td style={{textAlign: 'center', backgroundColor: '#082738'}}>{data.totalLT}</td>
			</tr>);
		}
	};

	fillTableBody = (leadDetailData) => {
		let tableBody = null;
		try {
			let rowData = [];
			for (let i = 0; i < leadDetailData.length; i++) {
				rowData[i] = this.fillRow(leadDetailData[i], i);
			}
			if (leadDetailData && leadDetailData.length > 0){
				tableBody = <tbody>
								{rowData}
							</tbody>;
			} else {
				tableBody = <tbody></tbody>;
			}


		} catch (e) {
			console.log("Error: ", e);
			tableBody = <tbody>
			</tbody>;
		}
		return tableBody;
	};

	fillTableFooter = (leadDetailFooter) => {
		let tableFooter = null;
		try {
			let totalQTyLastRow = leadDetailFooter.totalQTyLastRow;
			let totalLTLastRow  = leadDetailFooter.totalLTLastRow;
			let rowFooter       = <tr></tr>;
			//this.props.fillLeadDetailChart(totalQTyLastRow, totalLTLastRow);
			if (totalQTyLastRow.length > 0 && totalLTLastRow.length > 0) {
				rowFooter = <tr>
					<td style={{borderRight: '3px solid #BEBEBE'}}>ASC LEAD-TIME</td>
					<td style={{textAlign: 'center'}}>{totalQTyLastRow[0]}</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{totalLTLastRow[0]}</td>
					<td style={{textAlign: 'center'}}>{totalQTyLastRow[1]}</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{totalLTLastRow[1]}</td>
					<td style={{textAlign: 'center'}}>{totalQTyLastRow[2]}</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{totalLTLastRow[2]}</td>
					<td style={{textAlign: 'center'}}>{totalQTyLastRow[3]}</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{totalLTLastRow[3]}</td>
					<td style={{textAlign: 'center'}}>{totalQTyLastRow[4]}</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{totalLTLastRow[4]}</td>
					<td style={{textAlign: 'center'}}>{totalQTyLastRow[5]}</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{totalLTLastRow[5]}</td>
					<td style={{textAlign: 'center'}}>{totalQTyLastRow[6]}</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{totalLTLastRow[6]}</td>
					<td style={{textAlign: 'center'}}>{totalQTyLastRow[7]}</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{totalLTLastRow[7]}</td>
					<td style={{textAlign: 'center'}}>{totalQTyLastRow[8]}</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{totalLTLastRow[8]}</td>
					<td style={{textAlign: 'center'}}>{totalQTyLastRow[9]}</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{totalLTLastRow[9]}</td>
					<td style={{textAlign: 'center'}}>{totalQTyLastRow[10]}</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{totalLTLastRow[10]}</td>
					<td style={{textAlign: 'center'}}>{totalQTyLastRow[11]}</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{totalLTLastRow[11]}</td>
					<td style={{textAlign: 'center'}}>{totalQTyLastRow[12]}</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{totalLTLastRow[12]}</td>
					<td style={{textAlign: 'center'}}>{totalQTyLastRow[13]}</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{totalLTLastRow[13]}</td>
					<td style={{textAlign: 'center'}}>{totalQTyLastRow[14]}</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{totalLTLastRow[14]}</td>
					<td style={{textAlign: 'center'}}>{totalQTyLastRow[15]}</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>{totalLTLastRow[15]}</td>
					<td style={{textAlign: 'center', backgroundColor: '#082738'}}>{totalQTyLastRow[16]}</td>
					<td style={{textAlign: 'center', backgroundColor: '#082738'}}>{totalLTLastRow[16]}</td>
				</tr>;
			}
			tableFooter = <tfoot>
			{rowFooter}
			</tfoot>;

		} catch (e) {
			console.log("Error: ", e);
			tableFooter = <tfoot>
			<tr></tr>
			</tfoot>;
		}
		return tableFooter;
	};

	render() {
		let {leadDetailData, leadDetailFooter} = this.props;
		let tableBody                          = this.fillTableBody(leadDetailData);
		let tableFooter                        = this.fillTableFooter(leadDetailFooter);
		return (
			<Table responsive style={{backgroundColor: '#232529', color: 'white'}}>
				<thead>
				<tr>
					<th rowSpan="2" style={{verticalAlign: 'middle'}}>ASC PROCESS</th>
					<th colSpan="2" style={{textAlign: 'center', borderLeft: '3px solid #BEBEBE'}}>7:30</th>
					<th colSpan="2" style={{textAlign: 'center'}}>8:30</th>
					<th colSpan="2" style={{textAlign: 'center'}}>9:30</th>
					<th colSpan="2" style={{textAlign: 'center'}}>10:30</th>
					<th colSpan="2" style={{textAlign: 'center'}}>11:30</th>
					<th colSpan="2" style={{textAlign: 'center'}}>12:30</th>
					<th colSpan="2" style={{textAlign: 'center'}}>13:30</th>
					<th colSpan="2" style={{textAlign: 'center'}}>14:30</th>
					<th colSpan="2" style={{textAlign: 'center'}}>15:30</th>
					<th colSpan="2" style={{textAlign: 'center'}}>16:30</th>
					<th colSpan="2" style={{textAlign: 'center'}}>17:30</th>
					<th colSpan="2" style={{textAlign: 'center'}}>18:30</th>
					<th colSpan="2" style={{textAlign: 'center'}}>19:30</th>
					<th colSpan="2" style={{textAlign: 'center'}}>20:30</th>
					<th colSpan="2" style={{textAlign: 'center'}}>21:30</th>
					<th colSpan="2" style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>22:30</th>
					<th colSpan="2" style={{textAlign: 'center', backgroundColor: '#082738'}}>TOTAL</th>
				</tr>
				<tr>
					<td style={{textAlign: 'center', borderLeft: '3px solid #BEBEBE'}}>QTY</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>LT</td>
					<td style={{textAlign: 'center'}}>QTY</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>LT</td>
					<td style={{textAlign: 'center'}}>QTY</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>LT</td>
					<td style={{textAlign: 'center'}}>QTY</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>LT</td>
					<td style={{textAlign: 'center'}}>QTY</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>LT</td>
					<td style={{textAlign: 'center'}}>QTY</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>LT</td>
					<td style={{textAlign: 'center'}}>QTY</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>LT</td>
					<td style={{textAlign: 'center'}}>QTY</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>LT</td>
					<td style={{textAlign: 'center'}}>QTY</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>LT</td>
					<td style={{textAlign: 'center'}}>QTY</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>LT</td>
					<td style={{textAlign: 'center'}}>QTY</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>LT</td>
					<td style={{textAlign: 'center'}}>QTY</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>LT</td>
					<td style={{textAlign: 'center'}}>QTY</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>LT</td>
					<td style={{textAlign: 'center'}}>QTY</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>LT</td>
					<td style={{textAlign: 'center'}}>QTY</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>LT</td>
					<td style={{textAlign: 'center'}}>QTY</td>
					<td style={{textAlign: 'center', borderRight: '3px solid #BEBEBE'}}>LT</td>
					<td style={{textAlign: 'center', backgroundColor: '#082738'}}>QTY</td>
					<td style={{textAlign: 'center', backgroundColor: '#082738'}}>LT</td>
				</tr>
				</thead>
				{tableBody}
				{tableFooter}
			</Table>
		);
	}
}

export default LeadDetailTable;
