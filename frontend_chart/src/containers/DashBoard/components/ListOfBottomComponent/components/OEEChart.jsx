import React, {Component} from 'react'
import DoughnutChart from "../../../../Charts/ChartJS/components/DoughnutChart";
import Singleton from "../../../../../services/Socket";

export default class OEEChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            availabilityNumber: '50',
        };

        //initiate socket
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;
        let token = this.loginData.token;
        this.socket = Singleton.getInstance(token);

        switch(this.role) {
            case 'admin':
                this.emitEvent = `os_swingarm_oeedata`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            case 'ip':
                this.emitEvent = `ip_swingarm_oeedata`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            case 'os':
                this.emitEvent = `os_swingarm_oeedata`;
                this.eventListen = `sna_${this.emitEvent}`;
                break;
            default:
                this.emitEvent = `os_swingarm_oeedata`;
                this.eventListen = `sna_${this.emitEvent}`;
        }
    }


    componentDidMount(){
        this.socket.emit(this.emitEvent, {
            msg: {
                event: this.eventListen,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                status: 'start'
            }
        });
        this.socket.on(this.eventListen, (response) => {
            console.log("===================================================");
            console.log("===================================================");
            console.log("===================================================");
            console.log("===================================================");
            console.log("===================================================");
            console.log("response: ", response);
        });
    }

    render() {
        let availabilityNumber = this.state.availabilityNumber;
        let performanceNumber = '60';
        let qualityNumber = '60';
        let availabilityChartData = [{
            data: [availabilityNumber, 100 - availabilityNumber],
            backgroundColor: [
                "#FFFFFF",
                "#303339"
            ]
        }];
        let performanceChartData = [{
            data: [performanceNumber, 100 - performanceNumber],
            backgroundColor: [
                "#C88FFA",
                "#303339"
            ]
        }];
        let qualityChartData = [{
            data: [qualityNumber, 100 - qualityNumber],
            backgroundColor: [
                "#FF7033",
                "#303339"
            ]
        }];

        return (
            <div className="oee-main">
                <div className="container">
                    <div className="row">
                        <div className="col-12"><h4>OEE</h4></div>
                        <div className="col-4 align-self-center"><DoughnutChart labels={["Availability", ""]} data={availabilityChartData} centerTotal={availabilityNumber}/></div>
                        <div className="col-4 align-self-center"><DoughnutChart labels={["Performance", ""]} data={performanceChartData} centerTotal={performanceNumber}/></div>
                        <div className="col-4 align-self-center"><DoughnutChart labels={["Quality", ""]} data={qualityChartData} centerTotal={qualityNumber}/></div>
                    </div>
                </div>
            </div>
        )
    }
}
