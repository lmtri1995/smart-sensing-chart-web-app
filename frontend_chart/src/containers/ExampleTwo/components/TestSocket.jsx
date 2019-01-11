import React, {PureComponent} from "react";
import customSocket from "../../../services/Socket";
import * as config from "../../../constants/config";
import Singleton from "../../../services/Socket";

class TestSocket extends PureComponent {
    constructor() {
        super();

    }

    componentWillUnmount() {
        console.log("Page 2: componentWillUnmount");
        let socket = Singleton.getInstance();
        socket.removeListener('truong-outsole');
        //customSocket.removeListener('ip01');
        //customSocket.removeListener('outsole01');
    }

    componentDidMount() {
        console.log("truong ===============: ", Singleton.getInstance());
        let socket = Singleton.getInstance();
        socket.on('token', (data) => {
            console.log("Return Token: ", data);
            let tokenObject = JSON.parse(data);
            if (!tokenObject.success){
                console.log('vantran!!!!');
                window.location.href = ("/logout");
            }
        });
        socket.emit('outsole', {msg: {event: 'truong-outsole', from_timedevice: "", to_timedevice: ""}});
        socket.on('truong-outsole', (data) => {
            console.log("data 29: ", data);
        });

        /*let token = config.TOKEN;
        customSocket.IOSOCKET(config.SERVER_IP, '/api/chart', token);
        customSocket.keepConnection(config.SERVER_IP);
        //console.log("Socket2: ", Socket2.ioSocket);
        let eventName = 'ip';
        let eventName1 = 'ip01';
        customSocket.onConnect(eventName, eventName1, {msg: {event: eventName1}}, function (result) {
            console.log("Socket2 result: ", result);
        });

        //customSocket.IOSOCKET(config.SERVER_IP, '/api/chart', token);
        //customSocket.keepConnection(config.SERVER_IP);
        //console.log("Socket3: ", Socket3.ioSocket);
        eventName = 'outsole';
        eventName1 = 'outsole01';
        customSocket.onConnect(eventName, eventName1, {msg: {event: eventName1}}, function (result) {
            console.log("Socket3 result: ", result);
        });
        //console.log("is the same: ", Socket2.ioSocket === Socket3.ioSocket);*/

    }

    render() {
        return (
            <div>
                hello
            </div>
        );
    }
}

export default TestSocket;
