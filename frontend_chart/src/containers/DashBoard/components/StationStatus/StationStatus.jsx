import React, {Component} from 'react';
import StationStatusItem from './components/StationStatusItem';
import Singleton from "../../../../services/Socket";
import {ClipLoader} from 'react-spinners';

const override = `
    position: absolute;
    display:block;
    left:45%;
    z-index: 100000;
`;

export default class stationStatus extends Component {
    static socket = null;
    static loginData = null;
    static role = null;
    static _isMounted = null;//to check if the component is still mounted

    constructor(props) {
        super(props);

        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        this.state = {
            dataArray: "",
            loading: true
        };


    }

    componentWillUnmount() {
        this._isMounted = false;

        //Unregister event
        this.socket.emit('machine_status', {
            msg: {
                'event': 'sna_machine_status',
                'from_timedevice': 0,
                'to_timedevice': 0,
                'proccess': '',
                'status': 'stop',
            }
        });

        this.socket.removeListener('sna_machine_status');
    }

    /*configureOptions = () => {
        let result = '';
        console.log("login data: ", this.loginData.data.role);
        let role = this.loginData.data.role;

        let event = 'sna_machine_status';
        let from_timedevice = 0;
        let to_timedevice = 0;
        let proccess = 'os-Molding';
        let status = 'start';

        switch (role) {
            case 'admin':
                proccess = 'os-Molding';
                break;
            case 'os':
                proccess = 'os-Molding';
                break;
            case 'ip':
                proccess = 'os-Molding';
                break;
            case 'as':
                proccess = 'os-Molding';
                break;
        }
        result = {
            'event': event,
            'from_timedevice': from_timedevice,
            'to_timedevice': to_timedevice,
            'proccess': proccess,
            'status': status,
        };
        return result;
    }*/

    componentDidMount() {
        this._isMounted = true;

        /*var mDateFrom = moment.utc([2019, 0, 2, 10, 6, 40]);
        var uDateFrom = mDateFrom.unix();
        var mDateTo = moment.utc([2019, 0, 2, 10, 6, 43]);
        var uDateTo = mDateTo.unix();*/

        let proccess = 'os-Molding';
        switch (this.role) {
            case 'admin':
                proccess = 'os-Molding';
                break;
            case 'os':
                proccess = 'os-Molding';
                break;
            case 'ip':
                proccess = 'os-Molding';
                break;
            case 'as':
                proccess = 'os-Molding';
                break;
        }
        this.socket.emit('machine_status', {
            msg: {
                'event': 'sna_machine_status',
                'from_timedevice': 0,
                'to_timedevice': 0,
                'proccess': proccess,
                'status': 'start',
            }
        });

        this.socket.on('sna_machine_status', (data) => {
            if (this._isMounted) {
                let returnArray = JSON.parse(data);
                let dataArray = returnArray.data;
                dataArray.sort(function (a, b) {
                    if (parseInt(a.idStation) < parseInt(b.idStation)) {
                        return -1;
                    }
                    if (parseInt(a.idStation) > parseInt(b.idStation)) {
                        return 1;
                    }
                    return 0;
                });
                this.setState({
                    dataArray: dataArray,
                });
            }
        });

        /*socket.on('token', (data) => {
            let tokenObject = JSON.parse(data);
            if (!tokenObject.success) {
                console.log('Token is expired');
                window.location.href = ("/logout");
            }
        });*/

    }

    showStationStatusItem(dataArray) {
        let result = <div className="row">
            <StationStatusItem stationId={0} status={0} spaceTime={0}/>
            <StationStatusItem stationId={0} status={0} spaceTime={0}/>
            <StationStatusItem stationId={0} status={0} spaceTime={0}/>
            <StationStatusItem stationId={0} status={0} spaceTime={0}/>
            <StationStatusItem stationId={0} status={0} spaceTime={0}/>
            <StationStatusItem stationId={0} status={0} spaceTime={0}/>
            <StationStatusItem stationId={0} status={0} spaceTime={0}/>
            <StationStatusItem stationId={0} status={0} spaceTime={0}/>
        </div>;
        if (dataArray && dataArray.length > 0) {
            result = <div className="row">
                <StationStatusItem stationId={1} status={dataArray[0].istatus}
                                   spaceTime={dataArray[0].space_time}/>
                <StationStatusItem stationId={1} status={dataArray[0].istatus}
                                   spaceTime={dataArray[0].space_time}/>
                <StationStatusItem stationId={1} status={dataArray[0].istatus}
                                   spaceTime={dataArray[0].space_time}/>
                <StationStatusItem stationId={1} status={dataArray[0].istatus}
                                   spaceTime={dataArray[0].space_time}/>
                <StationStatusItem stationId={1} status={dataArray[0].istatus}
                                   spaceTime={dataArray[0].space_time}/>
                <StationStatusItem stationId={1} status={dataArray[0].istatus}
                                   spaceTime={dataArray[0].space_time}/>
                <StationStatusItem stationId={1} status={dataArray[0].istatus}
                                   spaceTime={dataArray[0].space_time}/>
                <StationStatusItem stationId={1} status={dataArray[0].istatus}
                                   spaceTime={dataArray[0].space_time}/>
            </div>
        }
        return result;
    }

    render() {
        let {dataArray} = this.state;
        if (dataArray && dataArray.length > 0 && this.state.loading === true) {
            this.setState({loading: false})
        }
        let dataShow = <div>
            <ClipLoader
                css={override}
                sizeUnit={"px"}
                size={100}
                color={'#30D4A4'}
                loading={this.state.loading}
                margin-left={300}
            />
            <div className={(this.state.loading) ? "loader" : ""}>
                <div className="container">
                    <div className="row">
                        <div className="col boxstation">
                            <h4>On/Off</h4>
                        </div>
                    </div>
                    {this.showStationStatusItem(dataArray)}
                </div>
            </div>

        </div>;

        /*return (
            <div className="container">
                <div className="row">
                    <div className="col boxstation">
                        <h4>On/Off</h4>
                    </div>
                </div>
                {this.showStationStatusItem(dataArray)}
            </div>
        )*/
        return (
            dataShow
        );
    }
}
