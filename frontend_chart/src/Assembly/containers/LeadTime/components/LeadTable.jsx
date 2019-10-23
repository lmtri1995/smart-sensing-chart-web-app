import React, {Component} from "react";
import {Table,}           from 'reactstrap';

class LeadTable extends Component {
	constructor(props) {
		super(props);
	}

	fillRow = (index, data, firstCol) => {
		let unit = "sec";
		if (index > 15) {
			unit = "min";
		}
		if (data === null || data === undefined) {
			data = {
				mas_cd_nm: 0,
				pair_qty : 0,
				lead_time: 0,
			};
		}
		if (firstCol) {
			let rowSpan = 1;
			if (firstCol == "STITCHING") {
				rowSpan = 2;
			} else if (firstCol == 'ASC') {
				rowSpan = 14;
			} else if (firstCol == 'LEAD TIME') {
				rowSpan = 3;
			}

			let min_process_crr = 0;
			if (data) {
				min_process_crr = data.min_process_crr != undefined && data.min_process_crr != "" ? true : false;
			}
			let color = "#FFFFFF";
			if (min_process_crr) {
				color = "#FF9356";
			}
			return <tr key={index}>
				<td rowSpan={rowSpan} style={{verticalAlign: 'middle', color: color}}>{firstCol}</td>
				<td style={{color: color}}>{data ? data.mas_cd_nm : 0}</td>
				<td style={{color: color}}>{data ? data.pair_qty : 0}</td>
				<td style={{color: color}}>{data ? data.lead_time : 0} ({unit})</td>
			</tr>;
		} else {
			let min_process_crr = 0;
			if (data) {
				min_process_crr = data.min_process_crr != undefined && data.min_process_crr != "" ? true : false;
			}
			let color = "#FFFFFF";
			if (min_process_crr) {
				color = "#FF9356";
			}
			return <tr key={index}>
				<td style={{color: color}}>{data ? data.mas_cd_nm : 0}</td>
				<td style={{color: color}}>{data ? data.pair_qty : 0}</td>
				<td style={{color: color}}>{data ? data.lead_time : 0} ({unit})</td>
			</tr>;
		}
	};

	fillTable = (leadData) => {
		let table = null;
		try {
			let parentCategrories = ['STITCHING', 'ASC', 'LEAD TIME'];
			let rowData           = [];

			let minPairLeadTime     = 0, minPairStiching = 0, minPairShoeMaking = 0;
			let minLeadTimeLeadTime = 0, minLeadTimeStiching = 0, minLeadTimeShoeMaking = 0;
			if (leadData.length > 0) {
				let pairQty0  = leadData[0] ? leadData[0].pair_qty : 0;
				let pairQty1  = leadData[1] ? leadData[1].pair_qty : 0;
				let pairQty2  = leadData[2] ? leadData[1].pair_qty : 0;
				let pairQty3  = leadData[3] ? leadData[1].pair_qty : 0;
				let pairQty4  = leadData[4] ? leadData[1].pair_qty : 0;
				let pairQty5  = leadData[5] ? leadData[1].pair_qty : 0;
				let pairQty6  = leadData[6] ? leadData[1].pair_qty : 0;
				let pairQty7  = leadData[7] ? leadData[1].pair_qty : 0;
				let pairQty8  = leadData[8] ? leadData[1].pair_qty : 0;
				let pairQty9  = leadData[9] ? leadData[1].pair_qty : 0;
				let pairQty10 = leadData[10] ? leadData[1].pair_qty : 0;
				let pairQty11 = leadData[11] ? leadData[1].pair_qty : 0;
				let pairQty12 = leadData[12] ? leadData[1].pair_qty : 0;
				let pairQty13 = leadData[13] ? leadData[1].pair_qty : 0;
				let pairQty14 = leadData[14] ? leadData[1].pair_qty : 0;
				let pairQty15 = leadData[15] ? leadData[1].pair_qty : 0;


				let leadTime0     = leadData[0] ? leadData[0].lead_time : 0;
				let leadTime1     = leadData[1] ? leadData[1].lead_time : 0;
				let leadTime2     = leadData[2] ? leadData[2].lead_time : 0;
				let leadTime3     = leadData[3] ? leadData[3].lead_time : 0;
				let leadTime4     = leadData[4] ? leadData[4].lead_time : 0;
				let leadTime5     = leadData[5] ? leadData[5].lead_time : 0;
				let leadTime6     = leadData[6] ? leadData[6].lead_time : 0;
				let leadTime7     = leadData[7] ? leadData[7].lead_time : 0;
				let leadTime8     = leadData[8] ? leadData[8].lead_time : 0;
				let leadTime9     = leadData[9] ? leadData[9].lead_time : 0;
				let leadTime10    = leadData[10] ? leadData[10].lead_time : 0;
				let leadTime11    = leadData[11] ? leadData[11].lead_time : 0;
				let leadTime12    = leadData[12] ? leadData[12].lead_time : 0;
				let leadTime13    = leadData[13] ? leadData[13].lead_time : 0;
				let leadTime14    = leadData[14] ? leadData[14].lead_time : 0;
				let leadTime15    = leadData[15] ? leadData[15].lead_time : 0;

				minPairLeadTime   = Math.min(pairQty0, pairQty1, pairQty2,
					pairQty3, pairQty4, pairQty5,
					pairQty6, pairQty7, pairQty8,
					pairQty9, pairQty10, pairQty11,
					pairQty12, pairQty13, pairQty14,
					pairQty15);
				minPairStiching   = Math.min(pairQty0, pairQty1, pairQty2,
					pairQty3, pairQty4);
				minPairShoeMaking = Math.min(pairQty5, pairQty6, pairQty7, pairQty8,
					pairQty9, pairQty10, pairQty11,
					pairQty12, pairQty13, pairQty14,
					pairQty15);

				minLeadTimeLeadTime = (
										leadTime0 + leadTime1 + leadTime2 + leadTime3 + leadTime4 +
										leadTime5 + leadTime6 + leadTime7 + leadTime8 + leadTime9 +
										leadTime10 + leadTime11 + leadTime12 + leadTime13 + leadTime14 + leadTime15
				                       ) / 60;

				minLeadTimeStiching   = (leadTime0 + leadTime1 + leadTime2 + leadTime3 + leadTime4) / 60;
				minLeadTimeShoeMaking = (leadTime5 + leadTime6 + leadTime7 + leadTime8 +
				                         leadTime9 + leadTime10 + leadTime11 +
				                         leadTime12 + leadTime13 + leadTime14 +
				                         leadTime15) / 60;
			}
			rowData[0]  = this.fillRow(0, leadData[0], parentCategrories[0]);
			rowData[1]  = this.fillRow(1, leadData[1]);
			rowData[2]  = this.fillRow(2, leadData[2], parentCategrories[1]);
			rowData[3]  = this.fillRow(3, leadData[3]);
			rowData[4]  = this.fillRow(4, leadData[4]);
			rowData[5]  = this.fillRow(5, leadData[5]);
			rowData[6]  = this.fillRow(6, leadData[6]);
			rowData[7]  = this.fillRow(7, leadData[7]);
			rowData[8]  = this.fillRow(8, leadData[8]);
			rowData[9]  = this.fillRow(9, leadData[9]);
			rowData[10] = this.fillRow(10, leadData[10]);
			rowData[11] = this.fillRow(11, leadData[11]);
			rowData[12] = this.fillRow(12, leadData[12]);
			rowData[13] = this.fillRow(13, leadData[13]);
			rowData[14] = this.fillRow(14, leadData[14]);
			rowData[15] = this.fillRow(15, leadData[15]);
			//rowData[16] = this.fillRow(16, leadData[16]);
			rowData[16] = this.fillRow(16, {
				"mas_cd_nm": "ASC Lead Time",
				"pair_qty" : minPairLeadTime.toFixed(2),
				"lead_time": minLeadTimeLeadTime.toFixed(2)
			}, parentCategrories[2]);
			rowData[17] = this.fillRow(17, {
				"mas_cd_nm": "Stitching",
				"pair_qty" : minPairStiching.toFixed(2),
				"lead_time": minLeadTimeStiching.toFixed(2)
			});
			rowData[18] = this.fillRow(18, {
				"mas_cd_nm": "ASC",
				"pair_qty" : minPairShoeMaking.toFixed(2),
				"lead_time": minLeadTimeShoeMaking.toFixed(2)
			});

			table =
				<tbody>
				{rowData}
				</tbody>;
		} catch (e) {
			console.log("Error: ", e);
			table =
				<tbody>

				</tbody>;
		}


		return table;
	};

	handleLeadData = (leadData) => {
		/*
		 20101	201	Preparing Stitching
		 20102	201	Load-In Material
		 20103	201	Computer Stitching
		 20104	201	Normal Stitching
		 20105	201	Packpart Molding
		 20106	201	Toe Molding
		 20107	201	Strobel
		 20108	201	Lasting
		 20109	201	Heel Lasting
		 20110	201	Heat Chamber
		 20111	201	Negartive Gage
		 20112	201	Cementing
		 20113	201	Attach Sole with Upper
		 20114	201	Chiller
		 20115	201	DeLasting
		 20116	201	Metal Detector
		 20117	201	QIP Defect
		 20118	201	Packing
		 */
		let newLeadDataArray = [
			{
				"mas_cd_nm" : "Pre. Stiching",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20101"
			},
			{
				"mas_cd_nm" : "Normal Stiching",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20104"
			},
			{
				"mas_cd_nm" : "Computer Stiching",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20103"
			},
			{
				"mas_cd_nm" : "Backpack Molding",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20105"
			},
			{
				"mas_cd_nm" : "Toe Molding",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20106"
			},
			{
				"mas_cd_nm" : "Strobel",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20107"
			},
			{
				"mas_cd_nm" : "Lasting",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20108"
			},
			{
				"mas_cd_nm" : "Heal Lasting",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20109"
			},
			{
				"mas_cd_nm" : "Heat Chamber",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20110"
			},
			{
				"mas_cd_nm" : "Negative Gage",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20111"
			},
			{
				"mas_cd_nm" : "Cementing",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20112"
			},
			{
				"mas_cd_nm" : "Attach Sole With Upper",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20113"
			},
			{
				"mas_cd_nm" : "Chiller",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20114"
			},
			{
				"mas_cd_nm" : "Delasting",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20115"
			},
			{
				"mas_cd_nm" : "Metal Detect",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20116"
			},
			{
				"mas_cd_nm" : "QIP Defect",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20117"
			},
			{
				"mas_cd_nm" : "Packing",
				"pair_qty"  : 0,
				"lead_time" : 0,
				"process_cd": "20118"
			}
		];
		for (let i = 0; i < newLeadDataArray.length; i++) {
			for (let j = 0; j < leadData.length; j++) {
				if (leadData[j].process_cd.toString() === newLeadDataArray[i].process_cd.toString()) {
					newLeadDataArray[i].pair_qty  = leadData[j].pair_qty;
					newLeadDataArray[i].lead_time = leadData[j].lead_time;
				}
			}
		}
		return newLeadDataArray;
	};

	render() {
		let {leadData} = this.props;
		//let newLeadDataArray = this.handleLeadData(leadData);
		let tableBody  = this.fillTable(leadData);
		return (
			<Table responsive hover style={{backgroundColor: '#232529', color: 'white'}}>
				<thead>
				<tr>
					<th colSpan="2" style={{textAlign: 'center'}}>ASC PROCESS</th>
					<th>PAIRS/HOUR</th>
					<th>LEAD TIME/PAIR</th>
				</tr>
				</thead>
				{tableBody}
			</Table>
		);
	}
}

export default LeadTable;
