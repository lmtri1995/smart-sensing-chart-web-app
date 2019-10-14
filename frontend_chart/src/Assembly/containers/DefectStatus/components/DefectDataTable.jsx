import React, {Component}      from "react";
import {Table}                 from "reactstrap";
import {COLOR_LARGEST}         from "../constants";
import {findThreeLargest}      from "../../../shared/utils/Utilities";
import {storeDefectStatusData} from "../../../redux/actions/excelDataActions";
import {connect}               from "react-redux";

class DefectDataTable extends Component {
	constructor(props) {
		super(props);
		this.excelData = [];
	}

	findColorForThreeLargest = (threeLargestArray, value) => {
		let color = '#232529';
		if (value > 0) {
			switch (value) {
				case threeLargestArray[0]:
					color = COLOR_LARGEST.first;
					break;
				case threeLargestArray[1]:
					color = COLOR_LARGEST.second;
					break;
				case threeLargestArray[2]:
					color = COLOR_LARGEST.third;
					break;
			}
		}
		return color;
	};

	fillRow = (threeLargestArray, dataItem, rowNo) => {
		let col = [];
		if (Object.keys(dataItem).length > 0) {
			let total                = dataItem["Qty_0730"] + dataItem["Qty_0830"] + dataItem["Qty_0930"] +
			                           dataItem["Qty_1030"] + dataItem["Qty_1130"] + dataItem["Qty_1230"] +
			                           dataItem["Qty_1330"] + dataItem["Qty_1430"] + dataItem["Qty_1530"] +
			                           dataItem["Qty_1630"] + dataItem["Qty_1730"] + dataItem["Qty_1830"] +
			                           dataItem["Qty_1930"] + dataItem["Qty_2030"];
			let backgroundColorArray = [];
			backgroundColorArray[1]  = this.findColorForThreeLargest(threeLargestArray[0], dataItem["Qty_0730"]);
			backgroundColorArray[2]  = this.findColorForThreeLargest(threeLargestArray[1], dataItem["Qty_0830"]);
			backgroundColorArray[3]  = this.findColorForThreeLargest(threeLargestArray[2], dataItem["Qty_0930"]);
			backgroundColorArray[4]  = this.findColorForThreeLargest(threeLargestArray[3], dataItem["Qty_1030"]);
			backgroundColorArray[5]  = this.findColorForThreeLargest(threeLargestArray[4], dataItem["Qty_1130"]);
			backgroundColorArray[6]  = this.findColorForThreeLargest(threeLargestArray[5], dataItem["Qty_1230"]);
			backgroundColorArray[7]  = this.findColorForThreeLargest(threeLargestArray[6], dataItem["Qty_1330"]);
			backgroundColorArray[8]  = this.findColorForThreeLargest(threeLargestArray[7], dataItem["Qty_1430"]);
			backgroundColorArray[9]  = this.findColorForThreeLargest(threeLargestArray[8], dataItem["Qty_1530"]);
			backgroundColorArray[10] = this.findColorForThreeLargest(threeLargestArray[9], dataItem["Qty_1630"]);
			backgroundColorArray[11] = this.findColorForThreeLargest(threeLargestArray[10], dataItem["Qty_1730"]);
			backgroundColorArray[12] = this.findColorForThreeLargest(threeLargestArray[11], dataItem["Qty_1830"]);
			backgroundColorArray[13] = this.findColorForThreeLargest(threeLargestArray[12], dataItem["Qty_1930"]);
			backgroundColorArray[14] = this.findColorForThreeLargest(threeLargestArray[13], dataItem["Qty_2030"]);
			backgroundColorArray[15] = this.findColorForThreeLargest(threeLargestArray[14], dataItem["Qty_2130"]);
			backgroundColorArray[16] = this.findColorForThreeLargest(threeLargestArray[15], dataItem["Qty_2230"]);


			let dataArray = [];
			dataArray[0]  = dataItem["defect_type_nm"] ? dataItem["defect_type_nm"] : '';
			dataArray[1]  = dataItem["Qty_0730"] ? dataItem["Qty_0730"] : 0;
			dataArray[2]  = dataItem["Qty_0830"] ? dataItem["Qty_0830"] : 0;
			dataArray[3]  = dataItem["Qty_0930"] ? dataItem["Qty_0930"] : 0;
			dataArray[4]  = dataItem["Qty_1030"] ? dataItem["Qty_1030"] : 0;
			dataArray[5]  = dataItem["Qty_1130"] ? dataItem["Qty_1130"] : 0;
			dataArray[6]  = dataItem["Qty_1230"] ? dataItem["Qty_1230"] : 0;
			dataArray[7]  = dataItem["Qty_1330"] ? dataItem["Qty_1330"] : 0;
			dataArray[8]  = dataItem["Qty_1430"] ? dataItem["Qty_1430"] : 0;
			dataArray[9]  = dataItem["Qty_1530"] ? dataItem["Qty_1530"] : 0;
			dataArray[10] = dataItem["Qty_1630"] ? dataItem["Qty_1630"] : 0;
			dataArray[11] = dataItem["Qty_1730"] ? dataItem["Qty_1730"] : 0;
			dataArray[12] = dataItem["Qty_1830"] ? dataItem["Qty_1830"] : 0;
			dataArray[13] = dataItem["Qty_1930"] ? dataItem["Qty_1930"] : 0;
			dataArray[14] = dataItem["Qty_2030"] ? dataItem["Qty_2030"] : 0;
			dataArray[15] = dataItem["Qty_2130"] ? dataItem["Qty_2130"] : 0;
			dataArray[16] = dataItem["Qty_2230"] ? dataItem["Qty_2230"] : 0;
			dataArray[17] = total ? total : 0;


			col[0]                    = <td style={{textAlign: 'left'}}>{dataArray[0]}</td>;
			col[1]                    =
				<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[1]}}>{dataArray[1]}</td>;
			col[2]                    =
				<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[2]}}>{dataArray[2]}</td>;
			col[3]                    =
				<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[3]}}>{dataArray[3]}</td>;
			col[4]                    =
				<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[4]}}>{dataArray[4]}</td>;
			col[5]                    =
				<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[5]}}>{dataArray[5]}</td>;
			col[6]                    =
				<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[6]}}>{dataArray[6]}</td>;
			col[7]                    =
				<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[7]}}>{dataArray[7]}</td>;
			col[8]                    =
				<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[8]}}>{dataArray[8]}</td>;
			col[9]                    =
				<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[9]}}>{dataArray[9]}</td>;
			col[10]                   =
				<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[10]}}>{dataArray[10]}</td>;
			col[11]                   =
				<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[11]}}>{dataArray[11]}</td>;
			col[12]                   =
				<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[12]}}>{dataArray[12]}</td>;
			col[13]                   =
				<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[13]}}>{dataArray[13]}</td>;
			col[14]                   =
				<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[14]}}>{dataArray[14]}</td>;
			col[15]                   =
				<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[15]}}>{dataArray[15]}</td>;
			col[16]                   =
				<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[16]}}>{dataArray[16]}</td>;
			col[17]                   =
				<td style={{textAlign: 'center', backgroundColor: '#082738'}}>{dataArray[17]}</td>;
			//preparing data for exporting
			this.excelData[rowNo + 1] = [dataArray[0], dataArray[1], dataArray[2],
			                             dataArray[3], dataArray[4], dataArray[5],
			                             dataArray[6], dataArray[7], dataArray[8],
			                             dataArray[9], dataArray[10], dataArray[11],
			                             dataArray[12], dataArray[13], dataArray[14],
			                             dataArray[15], dataArray[16], dataArray[16]];
		}
		return <tr>{col}</tr>;

	};

	fillBody = (data) => {
		let rowArray          = [];
		this.excelData[0]     = ["TYPE", "7:30", "8:30", "9:30", "10:30",
		                         "11:30", "12:30", "13:30", "14:30", "15:30",
		                         "16:30", "17:30", "18:30", "19:30", "20:30",
		                         "21:30", "22:30", "TOTAL"];
		let threeLargestArray = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0]
		];
		if (data.length >= 6) {
			let qualityArray = [
				[data[0].Qty_0730, data[1].Qty_0730, data[2].Qty_0730, data[3].Qty_0730, data[4].Qty_0730,
				 data[5].Qty_0730],
				[data[0].Qty_0830, data[1].Qty_0830, data[2].Qty_0830, data[3].Qty_0830, data[4].Qty_0830,
				 data[5].Qty_0830],
				[data[0].Qty_0930, data[1].Qty_0930, data[2].Qty_0930, data[3].Qty_0930, data[4].Qty_0930,
				 data[5].Qty_0930],
				[data[0].Qty_1030, data[1].Qty_1030, data[2].Qty_1030, data[3].Qty_1030, data[4].Qty_1030,
				 data[5].Qty_1030],
				[data[0].Qty_1130, data[1].Qty_1130, data[2].Qty_1130, data[3].Qty_1130, data[4].Qty_1130,
				 data[5].Qty_1130],
				[data[0].Qty_1230, data[1].Qty_1230, data[2].Qty_1230, data[3].Qty_1230, data[4].Qty_1230,
				 data[5].Qty_1230],
				[data[0].Qty_1330, data[1].Qty_1330, data[2].Qty_1330, data[3].Qty_1330, data[4].Qty_1330,
				 data[5].Qty_1330],
				[data[0].Qty_1430, data[1].Qty_1430, data[2].Qty_1430, data[3].Qty_1430, data[4].Qty_1430,
				 data[5].Qty_1430],
				[data[0].Qty_1530, data[1].Qty_1530, data[2].Qty_1530, data[3].Qty_1530, data[4].Qty_1530,
				 data[5].Qty_1530],
				[data[0].Qty_1630, data[1].Qty_1630, data[2].Qty_1630, data[3].Qty_1630, data[4].Qty_1630,
				 data[5].Qty_1630],
				[data[0].Qty_1730, data[1].Qty_1730, data[2].Qty_1730, data[3].Qty_1730, data[4].Qty_1730,
				 data[5].Qty_1730],
				[data[0].Qty_1830, data[1].Qty_1830, data[2].Qty_1830, data[3].Qty_1830, data[4].Qty_1830,
				 data[5].Qty_1830],
				[data[0].Qty_1930, data[1].Qty_1930, data[2].Qty_1930, data[3].Qty_1930, data[4].Qty_1930,
				 data[5].Qty_1930],
				[data[0].Qty_2030, data[1].Qty_2030, data[2].Qty_2030, data[3].Qty_2030, data[4].Qty_2030,
				 data[5].Qty_2030],
				[data[0].Qty_2130, data[1].Qty_2130, data[2].Qty_2130, data[3].Qty_2130, data[4].Qty_2130,
				 data[5].Qty_2130],
				[data[0].Qty_2230, data[1].Qty_2230, data[2].Qty_2230, data[3].Qty_2230, data[4].Qty_2230,
				 data[5].Qty_2230]
			];

			for (let i = 0; i < qualityArray.length; i++) {
				threeLargestArray[i] = findThreeLargest(qualityArray[i]);
			}
		}
		//let qualityArray = [[data[0].Qty_0730, data[1].Qty_0730, data[2].Qty_0730, data[3].Qty_0730,
		// data[4].Qty_0730, data[5].Qty_0730]];
		for (let i = 0; i < data.length; i++) {
			let dataItem = data[i];
			rowArray[i]  = this.fillRow(threeLargestArray, dataItem, i);
		}
		//this.props.changeExcelData(this.excelData);
		this.props.dispatch(storeDefectStatusData(this.excelData));
		return <tbody>{rowArray}</tbody>;
	};

	render() {
		let {defectWorkingHourArray} = this.props;
		let body                     = this.fillBody(defectWorkingHourArray);

		return <Table responsive className="table-striped" style={{backgroundColor: '#232529', color: 'white'}}>
			<thead>
			<tr>
				<td style={{textAlign: 'center'}}>TYPE</td>
				<td style={{textAlign: 'center'}}>7:30</td>
				<td style={{textAlign: 'center'}}>8:30</td>
				<td style={{textAlign: 'center'}}>9:30</td>
				<td style={{textAlign: 'center'}}>10:30</td>
				<td style={{textAlign: 'center'}}>11:30</td>
				<td style={{textAlign: 'center'}}>12:30</td>
				<td style={{textAlign: 'center'}}>13:30</td>
				<td style={{textAlign: 'center'}}>14:30</td>
				<td style={{textAlign: 'center'}}>15:30</td>
				<td style={{textAlign: 'center'}}>16:30</td>
				<td style={{textAlign: 'center'}}>17:30</td>
				<td style={{textAlign: 'center'}}>18:30</td>
				<td style={{textAlign: 'center'}}>19:30</td>
				<td style={{textAlign: 'center'}}>20:30</td>
				<td style={{textAlign: 'center'}}>21:30</td>
				<td style={{textAlign: 'center'}}>22:30</td>
				<td style={{textAlign: 'center', backgroundColor: '#082738'}}>TOTAL</td>
			</tr>
			</thead>
			{body}
		</Table>;
	}
}

export default connect()(DefectDataTable);

