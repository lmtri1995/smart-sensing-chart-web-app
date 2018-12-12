import React, {PureComponent} from 'react';
import DownIcon from 'mdi-react/ChevronDownIcon';
import {Collapse} from 'reactstrap';
import TopbarMenuLink from './TopbarMenuLink';
import TopbarTimePicker from './TopbarTimePicker';

const Ava = `${process.env.PUBLIC_URL}/img/ava.png`;

export default class TopbarGroupFilter extends PureComponent {
    toggle = () => {
        this.setState({collapse: !this.state.collapse});
    };

    constructor() {
        super();
        this.state = {
            collapse: false,
        };
    }

    render() {
        return (
            <div className="topbar__group-filter">
                <button className="topbar__avatar" onClick={this.toggle}>
                    <p className="topbar__time-current">9:30, 10/12 to 10:00, 15/12</p>
                </button>
                {this.state.collapse && <button className="topbar__back" onClick={this.toggle}/>}
                <Collapse isOpen={this.state.collapse} className="topbar__menu-wrap">
                    <div className="topbar__menu" style={{width: '300px'}}>
                        <div className="topbar__menu-item">
                            <TopbarTimePicker />
                        </div>
                        <div className="topbar__menu-item">
                            <TopbarTimePicker />
                        </div>
                    </div>
                </Collapse>
            </div>
        );
    }
}
