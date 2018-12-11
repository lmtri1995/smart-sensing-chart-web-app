import React, {PureComponent} from 'react';
import DownIcon from 'mdi-react/ChevronDownIcon';
import {Collapse} from 'reactstrap';
import TopbarMenuLink from './TopbarMenuLink';
import { TimePicker } from 'antd';
import moment from 'moment';

const Ava = `${process.env.PUBLIC_URL}/img/ava.png`;

const format = 'HH:mm';

export default class TopbarTimePicker extends PureComponent {
    render() {
        return (
            <div className="topbar__time-picker">
                <TimePicker defaultValue={moment('12:08', format)} format={format} />
            </div>
        );
    }
}
