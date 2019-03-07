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
                //idStation:0,
                from_timedevice: 0,
                to_timedevice: 0,
                minute: 0,
                status: 'start'
            }
        });
        this.socket.on(this.eventListen, (response) => {
            console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt");
            console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt");
            console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt");
            console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt");
            console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt");
            console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt");
            console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt");
            console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt");
            console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt");
            console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt");
            console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt");
            console.log("response: ", response);
            if (response && response.success){

                let returnData = response.data;
                console.log("returnData: ", returnData);
            }
        });
        let data = [
            {"working_hr":27000,"stopping_hr":340870,"count1":33,"count2":27,"idle_cycle":486,"preparingtime":34953,"curringtime":103630,"shiftno":1,"timedevice":"2019-03-06 13:20:02"},
            {"working_hr":27000,"stopping_hr":340870,"count1":65,"count2":62,"idle_cycle":447,"preparingtime":40110,"curringtime":94400,"shiftno":2,"timedevice":"2019-03-06 20:57:36"}
        ];
        let totalWorkingHour = 0;
        let totalStoppingHour = 0;
        let totalProductCount = 0;
        let totalDefect = 0;
        let totalStandardTime = 0;
        let availability = 0;
        let totalPreparingTime = 0;
        let cycleCount = 1;
        data.map(item=> {
            if (item){
                totalWorkingHour += item.working_hr;
                totalStoppingHour += item.stopping_hr;
                totalProductCount += item.count1 + item.count2;

            }
        });
        availability = (totalWorkingHour - totalStoppingHour) / totalWorkingHour * 100;
        availability = Math.round(availability * 100) / 100;
        this.setState({
            availabilityNumber: availability,
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
                        <div className="col-4 align-self-center"><DoughnutChart labels={["Availability", ""]} data={availabilityChartData} centerText={`Availability\n${availabilityNumber}%`}/></div>
                        <div className="col-4 align-self-center"><DoughnutChart labels={["Performance", ""]} data={performanceChartData} centerText={performanceNumber}/></div>
                        <div className="col-4 align-self-center"><DoughnutChart labels={["Quality", ""]} data={qualityChartData} centerText={qualityNumber}/></div>
                    </div>
                </div>
            </div>
        )
    }
}
