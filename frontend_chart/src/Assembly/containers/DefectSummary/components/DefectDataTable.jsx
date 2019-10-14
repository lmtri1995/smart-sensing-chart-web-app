import React, {Component}           from "react";
import {Table}                      from "reactstrap";
import {COLOR_LARGEST, FILTER_TYPE} from "../constants";
import {findThreeLargest}           from "../../../shared/utils/Utilities";
import {storeDefectSummaryData}     from "../../../redux/actions/excelDataActions";
import connect                      from "react-redux/es/connect/connect";

class DefectDataTable extends Component {
	constructor(props) {
		super(props);
		this.excelData = [];
	}

	fillHeader = (filterType) => {
		let tHead       = '';
		let firstColumn = '';
		switch (filterType) {
			case FILTER_TYPE.date:
				firstColumn = 'DATE';
				break;
			case FILTER_TYPE.model:
				firstColumn = 'MODEL';
				break;
			case FILTER_TYPE.article:
				firstColumn = 'ARTICLE';
				break;
		}
		tHead             = <thead>
		<tr>
			<td style={{textAlign: 'center'}}>{firstColumn}</td>
			<td style={{textAlign: 'center'}}>HO KEO (BONDING)</td>
			<td style={{textAlign: 'center'}}>LEM KEO (OVER-CEMENT)</td>
			<td style={{textAlign: 'center'}}>LEM NUOC XU LY (OVER-PRIMER)</td>
			<td style={{textAlign: 'center'}}>DO (DIRTY)</td>
			<td style={{textAlign: 'center'}}>NHAN (WRINKLE)</td>
			<td style={{textAlign: 'center'}}>LOI KHAC (ETC)</td>
			<td style={{textAlign: 'center', backgroundColor: '#082738'}}>TOTAL</td>
		</tr>
		</thead>;
		this.excelData    = [];
		this.excelData[0] = [firstColumn, "HO KEO (BONDING)", "LEM KEO (OVER-CEMENT)", "LEM NUOC XU LY (OVER-PRIMER)",
		                     "DO (DIRTY)", "NHAN (WRINKLE)", "LOI KHAC (ETC)", "TOTAL"];
		return tHead;
	};

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

	fillRow = (defectItem, rowNo) => {
		let backgroundColorArray = [];

		let qtyArray          = [defectItem.defect_type_40101,
		                         defectItem.defect_type_40102,
		                         defectItem.defect_type_40103,
		                         defectItem.defect_type_40104,
		                         defectItem.defect_type_40105,
		                         defectItem.defect_type_40106];
		let threeLargestArray = findThreeLargest(qtyArray);
		console.log("threeLargestArray 83 83 83 83 83 83 83: ", threeLargestArray);


		backgroundColorArray[1] = this.findColorForThreeLargest(threeLargestArray, defectItem.defect_type_40101);
		backgroundColorArray[2] = this.findColorForThreeLargest(threeLargestArray, defectItem.defect_type_40102);
		backgroundColorArray[3] = this.findColorForThreeLargest(threeLargestArray, defectItem.defect_type_40103);
		backgroundColorArray[4] = this.findColorForThreeLargest(threeLargestArray, defectItem.defect_type_40104);
		backgroundColorArray[5] = this.findColorForThreeLargest(threeLargestArray, defectItem.defect_type_40105);
		backgroundColorArray[6] = this.findColorForThreeLargest(threeLargestArray, defectItem.defect_type_40106);
		let total               = defectItem.defect_type_40101 + defectItem.defect_type_40102
		                          + defectItem.defect_type_40103 + defectItem.defect_type_40104
		                          + defectItem.defect_type_40105 + defectItem.defect_type_40106;

		let dataArray             = [];
		dataArray[0]              = defectItem.data_type ? defectItem.data_type : '';
		dataArray[1]              = defectItem.defect_type_40101 ? defectItem.defect_type_40101 : 0;
		dataArray[2]              = defectItem.defect_type_40102 ? defectItem.defect_type_40102 : 0;
		dataArray[3]              = defectItem.defect_type_40103 ? defectItem.defect_type_40103 : 0;
		dataArray[4]              = defectItem.defect_type_40104 ? defectItem.defect_type_40104 : 0;
		dataArray[5]              = defectItem.defect_type_40105 ? defectItem.defect_type_40105 : 0;
		dataArray[6]              = defectItem.defect_type_40106 ? defectItem.defect_type_40106 : 0;
		dataArray[7]              = total ? total : 0;
		this.excelData[rowNo + 1] = [dataArray[0], dataArray[1], dataArray[2],
		                             dataArray[3], dataArray[4], dataArray[5],
		                             dataArray[6], dataArray[7]];
		return <tr>
			<td style={{textAlign: 'center', backgroundColor: '#232529'}}>{dataArray[0]}</td>
			<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[1]}}>{dataArray[1]}</td>
			<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[2]}}>{dataArray[2]}</td>
			<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[3]}}>{dataArray[3]}</td>
			<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[4]}}>{dataArray[4]}</td>
			<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[5]}}>{dataArray[5]}</td>
			<td style={{textAlign: 'center', backgroundColor: backgroundColorArray[6]}}>{dataArray[6]}</td>
			<td style={{textAlign: 'center', backgroundColor: '#082738'}}>{dataArray[7]}</td>
		</tr>;
	};

	fillBody = (defectData) => {
		let rowArray = [];
		for (let i = 0; i < defectData.length; i++) {
			rowArray[i] = this.fillRow(defectData[i], i);
		}
		this.props.dispatch(storeDefectSummaryData(this.excelData));
		let tBody = <tbody>
		{rowArray}
		</tbody>;
		return tBody;
	};

	render() {
		let {filterType, defectData} = this.props;
		let tHead                    = this.fillHeader(filterType);
		let tBody                    = this.fillBody(defectData);

		return <Table responsive className="table-striped" style={{backgroundColor: '#232529', color: 'white'}}>
			{tHead}
			{tBody}
		</Table>;
	}
}

export default connect()(DefectDataTable);

