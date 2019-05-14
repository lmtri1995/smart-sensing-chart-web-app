import React, {Component} from 'react'
import ShiftStatusItem from './components/ShiftStatusItem';
import moment from "moment";
import Singleton from "../../../../services/Socket";
import API from '../../../../services/api';
import {ClipLoader} from "react-spinners";
import connect from "react-redux/es/connect/connect";
import {SHIFT_OPTIONS} from "./../../../../constants/constants";
import {storeShiftStatusData} from "../../../../redux/actions/downloadDataStoreActions";
import {specifySelectedShiftNo} from "../../../../shared/utils/Utilities";
import {
    ARTICLE_NAMES,
} from "../../../../constants/constants";

const override = `
    position: absolute;
    display:block;
    left:45%;
    top :25%;
    z-index: 100000;
`;

class ShiftStatus extends Component {
    static socket = null;
    static _isMounted = false;
    static loginData = null;
    static role = null;

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

        switch(this.role) {
            case 'admin':
                this.apiUrl = 'api/os/shiftStatus';
                break;
            case 'ip':
                this.apiUrl = 'api/ip/shiftStatus';
                break;
            case 'os':
                this.apiUrl = 'api/os/shiftStatus';
                break;
            default:
                this.apiUrl = 'api/os/shiftStatus';
                break;
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            let {startDate, endDate} = this.props.globalDateFilter;
            let fromTimeDevice = moment(startDate.toISOString()).unix();
            let toTimedevice   = moment(endDate.toISOString()).unix();

            let newSelectedArticle = this.props.globalArticleFilter.selectedArticle;
            let articleKey = '';
            if (newSelectedArticle) {
                articleKey = newSelectedArticle[0] === ARTICLE_NAMES.keys().next().value? '' : newSelectedArticle[0];
            }

            let newSelectededModel = this.props.globalModelFilter.selectedModel;

            let param = {
                "from_timedevice": fromTimeDevice,
                "to_timedevice": toTimedevice,
                "modelname": '',
                "articleno": articleKey,
                "shiftno": 0,
                //"shiftno": 0,
                /*"from_timedevice": 0,
                "to_timedevice": 0,*/
            };
            this.setState({
                loading: true,
            });
            API(this.apiUrl, 'POST', param)
                .then((response) => {
                    //console.log("success: ", response.success);
                    if (response){
                        if (response.data.success) {
                            let dataArray = response.data.data;
                            this.setState({
                                dataArray: dataArray,
                                loading: false,
                            });
                        } else {
                            this.setState({
                                dataArray: [],
                                loading: false,
                            });
                        }
                    } else {
                        this.setState({
                            dataArray: [],
                            loading: false,
                        });
                    }

                })
                .catch((err) => console.log('err:', err));

        }
    }

    componentDidMount() {
        let {startDate, endDate} = this.props.globalDateFilter;
        let fromTimeDevice = moment(startDate.toISOString()).unix();
        let toTimedevice   = moment(endDate.toISOString()).unix();

        let newSelectedArticle = this.props.globalArticleFilter.selectedArticle;
        let articleKey = '';
        if (newSelectedArticle) {
            articleKey = newSelectedArticle[0] === ARTICLE_NAMES.keys().next().value ? '' : newSelectedArticle[0];
        }

        let newSelectededModel = this.props.globalModelFilter.selectedModel;


        this._isMounted = true;
        let param = {
            "from_timedevice": fromTimeDevice,
            "to_timedevice": toTimedevice,
            "shiftno": 0,
            "modelname": '',
            "articleno": articleKey
        };
        API(this.apiUrl, 'POST', param)
            .then((response) => {
                if (response){
                    if (response.data.success) {
                        let dataArray = response.data.data;
                        this.setState({
                            dataArray: dataArray,
                            loading: false,
                        });
                    } else {
                        this.setState({
                            dataArray: [],
                            loading: false,
                        });
                    }
                } else {
                    this.setState({
                        dataArray: [],
                        loading: false,
                    });
                }

            })
            .catch((err) => console.log('err:', err))

    }

    specifyCurrentShift(dataArray) {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth();
        let yyyy = today.getFullYear();
        //shift 1: 6:00 am - 2:00 pm
        //shift 2: 2:00 am - 20:00 pm
        //shift 3: 20:00 pm - 6:00 am
        let shift1From = moment.utc([yyyy, mm, dd, 6, 0, 0]).unix();
        let shift1To = moment.utc([yyyy, mm, dd, 14, 0, 0]).unix();
        let shift2From = shift1To;
        let shift2To = moment.utc([yyyy, mm, dd, 20, 0, 0]).unix();
        let shift3From = shift2To;
        let shift3To = moment.utc([yyyy, mm, dd + 1, 6, 0, 0]).unix();

        let result = 0;
        if (dataArray.length > 0) {
            let timeReceived = dataArray[7].timeRecieved;
            if (timeReceived >= shift1From && timeReceived < shift1To) {
                result = 1;
            } else if (timeReceived >= shift2From && timeReceived < shift2To) {
                result = 2;
            } else if (timeReceived >= shift3From && timeReceived < shift3To) {
                result = 3;
            }
        }
        result = 3;
        return result;
    }

    showShiftItem(dataArray, shiftNo) {
        let total = 0;
        dataArray.forEach(item => {
            total += item;
        });
        return <ShiftStatusItem shiftNo={shiftNo} total={total}
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

    showShiftTable(dataArray) {
        let result = '';

        let displayData = this.handleDisplayArray(dataArray);
        let shift1 = this.showShiftItem(displayData[0], 1);
        let shift2 = this.showShiftItem(displayData[1], 2);
        let shift3 = this.showShiftItem(displayData[2], 3);

        switch (this.props.globalShiftFilter.selectedShift) {
            case SHIFT_OPTIONS[0]:
                result = <tbody>{shift1}{shift2}{shift3}</tbody>;
                break;
            case SHIFT_OPTIONS[1]:
                result = <tbody>{shift1}</tbody>;
                break;
            case SHIFT_OPTIONS[2]:
                result = <tbody>{shift2}</tbody>;
                break;
            case SHIFT_OPTIONS[3]:
                result = <tbody>{shift3}</tbody>;
                break;
        }

        return result;
    };


    render() {
        let dataArray = this.state.dataArray;
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

        )
    }
}

const mapStateToProps = (state) => ({
    globalDateFilter: state.globalDateFilter,
    globalShiftFilter: state.globalShiftFilter,
    globalArticleFilter: state.globalArticleFilter,
    globalModelFilter: state.globalModelFilter,
});

export default connect(mapStateToProps)(ShiftStatus);
