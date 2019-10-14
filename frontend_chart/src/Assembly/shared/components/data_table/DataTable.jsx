import React, {Component} from 'react';
import "../../../scss/component/tabulator_bootstrap4.min.css";
import PropTypes          from "prop-types";

var Tabulator = require('tabulator-tables');

export default class DataTable extends Component {
	static propTypes    = {
		columns   : PropTypes.arrayOf(
			PropTypes.oneOfType([
				PropTypes.shape({
					title: PropTypes.string.isRequired,
					field: PropTypes.string.isRequired,
				}),
				PropTypes.shape({
					title  : PropTypes.string.isRequired,
					columns: PropTypes.arrayOf(
						PropTypes.shape({
							title: PropTypes.string.isRequired,
							field: PropTypes.string.isRequired,
						})
					).isRequired,
				})
			])
		).isRequired,
		data      : PropTypes.arrayOf(PropTypes.object).isRequired,
		options   : PropTypes.object,
		onRowClick: PropTypes.func,
	};
	static defaultProps = {
		options   : undefined,
		onRowClick: (mouseEvent, rowComponent) => {
			// console.log("ref table: ", this.ref.table); // this is the Tabulator table instance
			console.log(`rowClick id: ${rowComponent.getData().id}`, rowComponent, mouseEvent);
		}
	};

	constructor(props) {
		super(props);
		this.ref = null;
	}

	componentDidMount() {
		let {data, onRowClick, columns, id} = this.props;
		data                                = data ? data : [];
		let _this                           = this;
		this.table                          = new Tabulator(`#${id}`, {
			height             : "40em",
			movableRows        : false,
			selectable         : 1, //make rows selectable
			columns            : columns,
			data               : data,
			rowSelectionChanged: (data, rows) => {
				if (data.length > 0) {
					_this.props.onRowClick(data[data.length - 1]);
				}
			},
			rowDeselected:(row) => {
				//row - row component for the deselected row
				if (_this.props.onRowDeselect){
					_this.props.onRowDeselect(row._row.data);
				}

			},
		});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {

		let {data, onRowClick} = this.props;
		data                   = data ? data : [];

		if (prevProps.data !== this.props.data) {
			this.table.replaceData(data);
		}
	}

	render() {
		let {columns, data, options, onRowClick, id} = this.props;
		/*return (
		 <ReactTabulator
		 ref={ref => this.ref = ref}
		 columns={columns}
		 data={data}
		 options={options}
		 rowClick={onRowClick}
		 />
		 );*/
		return (
			<div id={id}></div>
		);
	}
}
