import React, {Component} from 'react';
import StationStatusItem from './components/StationStatusItem';
import Singleton from "../../../../services/Socket";

export default class stationStatus extends Component {
    static socket = null;
    static _isMounted = null;//to check if the component is still mounted

    constructor(props) {
        super(props)

        //initiate socket
        let loginData = JSON.parse(localStorage.getItem('logindata'));
        let token = loginData.token;
        this.socket = Singleton.getInstance(token);

        this.state = {
            dataArray: "",
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;

        /*var mDateFrom = moment.utc([2019, 0, 2, 10, 6, 40]);
        var uDateFrom = mDateFrom.unix();
        var mDateTo = moment.utc([2019, 0, 2, 10, 6, 43]);
        var uDateTo = mDateTo.unix();*/
        this.socket.emit('machine_status', {
            msg: {
                event: "sna_machine_status",
                from_timedevice: "1548122509",
                to_timedevice: "1548122509",
                proccess: 'ip',
                status: 'start'
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
        </div>
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
        return (
            <div className="container">
                <div className="row">
                    <div className="col boxstation">
                        <h4>On/Off</h4>
                    </div>
                </div>
                {this.showStationStatusItem(dataArray)}
            </div>
        )
    }
}
