import React, {PureComponent}         from 'react';
import PropTypes                      from 'prop-types';
import {Button, ButtonToolbar, Modal} from 'reactstrap';
import classNames                     from 'classnames';
import {LEARNING_CURVE_CONSTANTS}     from './../constants';

export default class ModalComponent extends PureComponent {
	static propTypes = {
		title  : PropTypes.string,
		type   : PropTypes.string,
		message: PropTypes.string,
		color  : PropTypes.string.isRequired,
		colored: PropTypes.bool,
		header : PropTypes.bool,
		btn    : PropTypes.string.isRequired,
	};

	static defaultProps = {
		title  : '',
		message: '',
		colored: false,
		header : false,
	};

	constructor() {
		super();
		this.state = {
			modal: false,
		};

		this.toggle = this.toggle.bind(this);
	}

	toggle = (button) => {
		this.setState((prevState, props) => ({
			modal: !prevState.modal
		}));
		if (button === 'ok') {
			this.props.onOkClicked();
		}
	};

	render() {
		const {
			      color, btn, title, message, colored, header, type, style, submissionState
		      }         = this.props;
		const {modal}   = this.state;
		let Icon;
		let displayText = 'Submit';
		switch (submissionState) {
			case LEARNING_CURVE_CONSTANTS.submissionState.initial:
				displayText = 'Submit';
				break;
			case LEARNING_CURVE_CONSTANTS.submissionState.onGoing:
				displayText = 'Submitting';
				break;
			case LEARNING_CURVE_CONSTANTS.submissionState.done:
				displayText = 'Submitted';
				break;
		}

		switch (color) {
			case 'primary':
				Icon = <span className="lnr lnr-pushpin modal__title-icon"/>;
				break;
			case 'success':
				Icon = <span className="lnr lnr-thumbs-up modal__title-icon"/>;
				break;
			case 'warning':
				Icon = <span className="lnr lnr-flag modal__title-icon"/>;
				break;
			case 'danger':
				Icon = <span className="lnr lnr-cross-circle modal__title-icon"/>;
				break;
			default:
				break;
		}
		const modalClass = classNames({
			'modal-dialog--colored': colored,
			'modal-dialog--header' : header,
		});

		return (

			<div style={style}>
				<Button color={color} onClick={this.toggle}>{displayText}</Button>
				<Modal
					isOpen={modal}
					toggle={this.toggle}
					className={`modal-dialog--${color} ${modalClass}`}
				>
					<div className="modal__header">
						<button className="lnr lnr-cross modal__close-btn" type="button" onClick={this.toggle}/>
						{/*{header ? '' : Icon}*/}
						<h4 className="bold-text  modal__title">{title}</h4>
					</div>
					<div className="modal__body">
						{message}
					</div>
					<ButtonToolbar className="modal__footer">
						<Button id="cancel" onClick={this.toggle.bind(this, "cancel")}>Cancel</Button>{' '}
						<Button id="ok" outline={colored} color={color} type={type}
						        onClick={this.toggle.bind(this, "ok")}>Ok</Button>
					</ButtonToolbar>
				</Modal>
			</div>
		);
	}
}
