import React, {Component} from 'react'
import ShiftStatusItem from './components/ShiftStatusItem';
import moment from "moment";
import Singleton from "../../../../services/Socket";
import {ClipLoader} from 'react-spinners';
import {specifyCurrentShift, specifySelectedShiftNo} from "../../../../shared/utils/Utilities";
import {storeShiftStatusData} from "../../../../redux/actions/downloadDataStoreActions";
import {connect} from "react-redux";
import API from "../../../../services/api";
import {SHIFT_OPTIONS, ARTICLE_NAMES} from "../../../../constants/constants";

const override = `
    position: absolute;
    display:block;
    left:45%;
    top :25%;
    z-index: 100000;
`;

class ShiftStatus extends Component {

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

        switch (this.role) {
            case 'admin':
                this.apiUrl = 'api/os/shiftStatus';
                this.emitEvent = 'os_shift_status';
                this.listenEvent = 'sna_' + this.emitEvent;
                break;
            case 'ip':
                this.apiUrl = 'api/ip/shiftStatus';
                this.emitEvent = 'ip_shift_status';
                this.listenEvent = 'sna_' + this.emitEvent;
                break;
            case 'os':
                this.apiUrl = 'api/os/shiftStatus';
                this.emitEvent = 'os_shift_status';
                this.listenEvent = 'sna_' + this.emitEvent;
                break;
            default:
                this.apiUrl = 'api/os/shiftStatus';
                this.emitEvent = 'os_shift_status';
                this.listenEvent = 'sna_' + this.emitEvent;
                break;
        }

        this.currentSelectedArticle = '';
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.listenEvent,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                status: 'stop',
                modelname: '',
                articleno: ''
            }
        });
    }

    restartSocket = () => {
        let newSelectedArticle = this.props.globalArticleFilter.selectedArticle;
        let newArticleKey = '';
        if (newSelectedArticle) {
            newArticleKey = newSelectedArticle[0] === ARTICLE_NAMES.keys().next().value ? '' : newSelectedArticle[0];
        }

        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.listenEvent,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                status: 'stop',
                modelname: '',     // todo: change 'modelname' to 'articlename' on API
                articleno: ''
            }
        });

        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.listenEvent,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                status: 'start',
                modelname: '',
                articleno: newArticleKey
            }
        });

        this.currentSelectedArticle = newSelectedArticle;
    };

    callAxiosBeforeSocket = (stopCurrentSocket = false, callback) => {
        /*let {startDate, endDate} = this.props.globalDateFilter;
        let fromTimeDevice = moment(startDate.toISOString()).unix();
        let toTimedevice   = moment(endDate.toISOString()).unix();*/
        if (!this.state.loading) {
            this.setState({loading: true});
        }
        this._isMounted = true;

        let newSelectedArticle  = this.props.globalArticleFilter.selectedArticle;
        let articleKey = '';
        if (newSelectedArticle ) {
            articleKey = newSelectedArticle [0] === ARTICLE_NAMES.keys().next().value ? '' : newSelectedArticle [0];
        }

        this.currentSelectedArticle = newSelectedArticle;
        let param = {
            "from_timedevice": 0,
            "to_timedevice": 0,
            "modelname": '',
            "articleno": articleKey,
            "shiftno":"0"
        };
        API(this.apiUrl, 'POST', param)
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;
                    this.setState({
                        dataArray: dataArray,
                        loading: false,
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
            .catch((err) => console.log('err:', err))
    }

    callSocket = () => {
        let selectedArticle = this.props.globalArticleFilter.selectedArticle;
        let articleKey = '';
        if (selectedArticle) {
            articleKey = selectedArticle[0] === ARTICLE_NAMES.keys().next().value ? '' : selectedArticle[0];
        }

        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.listenEvent,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                status: 'start',
                modelname: '',
                articleno: articleKey
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        let currentSelectedArticle = this.currentSelectedArticle;
        let currentArticleKey = '';
        if (currentSelectedArticle) {
            currentArticleKey = currentSelectedArticle[0] === ARTICLE_NAMES.keys().next().value ? '' : currentSelectedArticle[0];
        }
        let newSelectedArticle = this.props.globalArticleFilter.selectedArticle;
        let newArticleKey = '';
        if (newSelectedArticle) {
            newArticleKey = newSelectedArticle[0] === ARTICLE_NAMES.keys().next().value ? '' : newSelectedArticle[0];
        }

        if (currentArticleKey != newArticleKey) {
            this.callAxiosBeforeSocket(true);
        }
    }

    componentDidMount() {
        this._isMounted = true;

        this.callAxiosBeforeSocket();
        /*var mDateFrom = moment.utc([2019, 0, 2, 10, 6, 40]);
        var uDateFrom = mDateFrom.unix();
        var mDateTo = moment.utc([2019, 0, 2, 10, 6, 43]);
        var uDateTo = mDateTo.unix();*/

        /*this.socket.on('token', (data) => {
            let tokenObject = JSON.parse(data);
            if (!tokenObject.success) {
                console.log('Token is expired');
                window.location.href = (ROUTE.Logout);
            }
        });*/

    }

    handleDisplayArray = (dataArray) => {
        let shift1Array = [0, 0, 0, 0, 0, 0, 0, 0];
        let shift2Array = [0, 0, 0, 0, 0, 0, 0, 0];
        let shift3Array = [0, 0, 0, 0, 0, 0, 0, 0];
        try {
            for (let i = 0; i < dataArray.length; i++){
                let station = parseInt(dataArray[i].idstation);
                shift1Array[station - 1] = parseInt(dataArray[i].first_shift);
                shift2Array[station - 1] = parseInt(dataArray[i].second_shift);
                shift3Array[station - 1] = parseInt(dataArray[i].third_shift);
            }
        } catch (e) {
            console.log("Error: ", e);
        }
        return [shift1Array, shift2Array, shift3Array];
    }

    showShiftItem(dataArray, shiftNo) {
        let currentShift = specifyCurrentShift();
        let total = 0;
        dataArray.forEach(item => {
            total += item;
        });
        return <ShiftStatusItem shiftNo={shiftNo} total={total} currentShift={currentShift}
                                count1={dataArray[0]}
                                count2={dataArray[1]}
                                count3={dataArray[2]}
                                count4={dataArray[3]}
                                count5={dataArray[4]}
                                count6={dataArray[5]}
                                count7={dataArray[6]}
                                count8={dataArray[7]}
        />
    }

    showShiftTable(dataArray) {
        let result = '';
        let currentShift = specifyCurrentShift();

        let displayData = this.handleDisplayArray(dataArray);
        let shift1 = this.showShiftItem(displayData[0], 1);
        let shift2 = this.showShiftItem(displayData[1], 2);
        let shift3 = this.showShiftItem(displayData[2], 3);

        if (currentShift == 1) {
            result = <tbody>{shift2}{shift3}{shift1}</tbody>;
        } else if (currentShift == 2) {
            result = <tbody>{shift3}{shift1}{shift2}</tbody>;
        } else {
            result = <tbody>{shift1}{shift2}{shift3}</tbody>;
        }
        return result;
    };


    render() {
        let dataArray = this.state.dataArray;
        if (dataArray && dataArray.length > 0 && this.state.loading === true) {
            this.setState({loading: false})
        }
        return (
            <div>
                <ClipLoader
                    css={override}
                    sizeUnit={"px"}
                    size={100}
                    color={'#30D4A4'}
                    fadeIn="half"
                    fadeOut="half"
                    loading={this.state.loading}
                    margin-left={300}
                />
                <div className={(this.state.loading) ? "loader" : ""}>
                    <table className="table table-bordered table-dark">
                        <thead>
                        <tr>
                            <th scope="col">Shifts' Status</th>
                            <th scope="col"> 1</th>
                            <th scope="col"> 2</th>
                            <th scope="col"> 3</th>
                            <th scope="col"> 4</th>
                            <th scope="col"> 5</th>
                            <th scope="col"> 6</th>
                            <th scope="col"> 7</th>
                            <th scope="col"> 8</th>
                            <th scope="col"> Total</th>
                        </tr>
                        </thead>
                        {this.showShiftTable(dataArray)}
                    </table>
                </div>
            </div>

        )
    }
}

const mapStateToProps = (state) => ({
    globalShiftFilter: state.globalShiftFilter,
    globalArticleFilter: state.globalArticleFilter,
});

export default connect(mapStateToProps)(ShiftStatus);
