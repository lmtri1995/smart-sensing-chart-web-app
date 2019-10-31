import React, {Component}       from 'react';
import StationStatusItem        from './components/StationStatusItem';
import Singleton                from "../../../../../services/Socket";
import {ClipLoader}             from 'react-spinners';
import {storeStationStatusData} from "../../../../../redux/actions/downloadDataStoreActions";
import {connect}                from "react-redux";
import API                      from "../../../../../services/api";
import { hot } from 'react-hot-loader';

const override = `
    position: absolute;
    display:block;
    left:45%;
    top: 25%;
    z-index: 100000;
`;

class StationStatus extends Component {
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

        this.apiUrl = 'api/db/machinestatus';

        this.emitEvent = 'machine_status';//emitEvent has to be the same as emitEvent on server side
        this.process = 'os-molding';
        this.listenEvent = "os_listen_stationStatus";

        this.currentSelectedArticle = '';
    }

    restartSocket = () => {
        let newSelectedArticle = this.props.globalArticleFilter.selectedArticle;
        let newArticleKey = '';
        if (newSelectedArticle) {
            newArticleKey = newSelectedArticle[1].key;
        }

        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.listenEvent,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                status: 'stop',
                modelname: '',     // todo: change 'modelname' to 'articlename' on API
            }
        });

        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.listenEvent,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                status: 'start',
                modelname: newArticleKey,
            }
        });
        this.currentSelectedArticle = newSelectedArticle;
    };

    componentWillUnmount() {
        this._isMounted = false;

        //Unregister event
        this.socket.emit(this.emitEvent, {
            msg: {
                'event': this.listenEvent,
                'from_timedevice': 0,
                'to_timedevice': 0,
                'proccess': this.process,
                'status': 'stop',
                'modelname': this.currentSelectedArticle,
            }
        });

        //this.socket.removeListener('sna_machine_status');
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

    callAxiosBeforeSocket = (stopCurrentSocket = false, callback) => {
        if (!this.state.loading) {
            this.setState({loading: true});
        }

        let newSelectededArticle = this.props.globalArticleFilter.selectedArticle;
        let articleKey = '';
        if (newSelectededArticle) {
            articleKey = newSelectededArticle[1].key;
        }

        this.currentSelectedArticle = newSelectededArticle;

        let param = {
            "proccess": this.process,
            "modelname": articleKey,
            "shiftno":"0"
        };
        API(this.apiUrl, 'POST', param)
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;
                    this.displayData = dataArray;
                    if (this.displayData.length > 0){
                        this.displayData.sort(function (a, b) {
                            if (parseInt(a.idStation) < parseInt(b.idStation)) {
                                return -1;
                            }
                            if (parseInt(a.idStation) > parseInt(b.idStation)) {
                                return 1;
                            }
                            return 0;
                        });
                    }
                    this.setState({
                        dataArray: this.displayData,
                    });
                    if (!stopCurrentSocket) {
                        this.callSocket();
                    } else {
                        this.restartSocket();
                    }
                } else {
                    return callback();
                }
            })
            .catch((err) => console.log('err:', err));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let currentSelectedArticle = this.currentSelectedArticle;
        let currentArticleKey = '';
        if (currentSelectedArticle) {
            currentArticleKey = currentSelectedArticle[1].key;
        }
        let newSelectedArticle = this.props.globalArticleFilter.selectedArticle;
        let newArticleKey = '';
        if (newSelectedArticle) {
            newArticleKey = newSelectedArticle[1].key;
        }

        if (currentArticleKey != newArticleKey) {
            this.callAxiosBeforeSocket(true);
        }
    }

    callSocket = () => {
        let newSelectededArticle = this.props.globalArticleFilter.selectedArticle;
        let articleKey = '';
        if (newSelectededArticle) {
            articleKey = newSelectededArticle[1].key;
        }

        this.socket.emit(this.emitEvent, {
            msg: {
                'event': this.listenEvent,
                'from_timedevice': 0,
                'to_timedevice': 0,
                'proccess': this.process,
                "modelname": articleKey,
                'status': 'start',
            }
        });

        this.socket.on(this.listenEvent, (data) => {
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
    }

    componentDidMount() {
        this._isMounted = true;

        /*var mDateFrom = moment.utc([2019, 0, 2, 10, 6, 40]);
        var uDateFrom = mDateFrom.unix();
        var mDateTo = moment.utc([2019, 0, 2, 10, 6, 43]);
        var uDateTo = mDateTo.unix();*/
        this.callAxiosBeforeSocket();

        /*
        Create socket
        this.socket.emit('machine_status', {
            msg: {
                'event': 'sna_machine_status',
                'from_timedevice': 0,
                'to_timedevice': 0,
                'proccess': this.process,
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
        });*/

        /*socket.on('token', (data) => {
            let tokenObject = JSON.parse(data);
            if (!tokenObject.success) {
                console.log('Token is expired');
                window.location.href = (ROUTE.Logout);
            }
        });*/

    }

    showStationStatusItem(dataArray) {
        let result = <div>
            <div className="row">
                <StationStatusItem stationId={0} status={0} spaceTime={0}/>
                <StationStatusItem stationId={0} status={0} spaceTime={0}/>
                <StationStatusItem stationId={0} status={0} spaceTime={0}/>
                <StationStatusItem stationId={0} status={0} spaceTime={0}/>
            </div>
            <div className="row">
                <StationStatusItem stationId={0} status={0} spaceTime={0}/>
                <StationStatusItem stationId={0} status={0} spaceTime={0}/>
                <StationStatusItem stationId={0} status={0} spaceTime={0}/>
                <StationStatusItem stationId={0} status={0} spaceTime={0}/>
            </div>
        </div>;
        if (dataArray && dataArray.length > 0) {
            dataArray.map(item => {
                this["status" + item.idStation] = item.istatus;
                this["space_time" + item.idStation] = item.space_time;
            });
            let status1 = this.status1 ? this.status1 : 'N/A';
            let status2 = this.status2 ? this.status2 : 'N/A';
            let status3 = this.status3 ? this.status3 : 'N/A';
            let status4 = this.status4 ? this.status4 : 'N/A';
            let status5 = this.status5 ? this.status5 : 'N/A';
            let status6 = this.status6 ? this.status6 : 'N/A';
            let status7 = this.status7 ? this.status7 : 'N/A';
            let status8 = this.status8 ? this.status8 : 'N/A';

            let space_time1 = this.space_time1 ? this.space_time1 : 'N/A';
            let space_time2 = this.space_time2 ? this.space_time2 : 'N/A';
            let space_time3 = this.space_time3 ? this.space_time3 : 'N/A';
            let space_time4 = this.space_time4 ? this.space_time4 : 'N/A';
            let space_time5 = this.space_time5 ? this.space_time5 : 'N/A';
            let space_time6 = this.space_time6 ? this.space_time6 : 'N/A';
            let space_time7 = this.space_time7 ? this.space_time7 : 'N/A';
            let space_time8 = this.space_time8 ? this.space_time8 : 'N/A';
            result = <div>
                <div className="row">
                    <StationStatusItem stationId={1} status={status1}
                                       spaceTime={space_time1}/>
                    <StationStatusItem stationId={2} status={status2}
                                       spaceTime={space_time2}/>
                    <StationStatusItem stationId={3} status={status3}
                                       spaceTime={space_time3}/>
                    <StationStatusItem stationId={4} status={status4}
                                       spaceTime={space_time4}/>
                </div>
                <div className="row">
                    <StationStatusItem stationId={5} status={status5}
                                       spaceTime={space_time5}/>
                    <StationStatusItem stationId={6} status={status6}
                                       spaceTime={space_time6}/>
                    <StationStatusItem stationId={7} status={status7}
                                       spaceTime={space_time7}/>
                    <StationStatusItem stationId={8} status={status8}
                                       spaceTime={space_time8}/>
                </div>
            </div>;

            // Prepare to dispatch Data to Redux Store to Export Data later
            let stationStatusData = [
                [1, status1, space_time1],
                [2, status2, space_time2],
                [3, status3, space_time3],
                [4, status4, space_time4],
                [5, status5, space_time5],
                [6, status6, space_time6],
                [7, status7, space_time7],
                [8, status8, space_time8],
            ];
            this.props.dispatch(storeStationStatusData(stationStatusData));
        }
        return result;
    }

    render() {
        let {dataArray} = this.state;
        if (dataArray && dataArray.length > 0 && this.state.loading === true) {
            this.setState({loading: false})
        }
        let dataShow = <div>
            <div className={(this.state.loading) ? "loader" : ""}>
                <div className="container">
                    <div className="row">
                        <div className="col boxstation">
                            <h4>On/Off</h4>
                        </div>
                    </div>
                    <ClipLoader
                        css={override}
                        sizeUnit={"px"}
                        size={100}
                        color={'#30D4A4'}
                        loading={this.state.loading}
                        margin-left={300}
                    />
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

const mapStateToProps = (state) => ({
    globalArticleFilter: state.globalArticleFilter,
});

export default connect(mapStateToProps)(StationStatus);
