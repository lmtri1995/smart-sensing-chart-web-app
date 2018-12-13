import isEmpty from 'lodash/isEmpty';
import io from 'socket.io-client';

const Socket = {
    connect,
    keepConnection,
    emit,
    on,
    removeListener,
    ioSocket: null
};

function connect(url, pathParam, params) {
    const hasAuthenticated = !isEmpty(localStorage.getItem('user'));
    if (true) {
        // Setup a server for testing.
        let queryString = pathParam + ((params != undefined && params != null && params != null) ? ('?' + params) : ''); //params: query string, ex: parm1='value1'&&parm2='value2' ..

        Socket.ioSocket = io(url, {path: queryString});

        Socket.ioSocket.on('connect', function () {
            console.log('connected to server');
        });

        Socket.ioSocket.on('disconnect', function () {
            console.log('disconnected from server');
        });
    }
}

function keepConnection(url) {
    if (Socket.ioSocket.disconnected) {
        Socket.ioSocket = io(url, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity
        });
    }
}


function on(eventName, callback) {
    if (Socket.ioSocket) {
        console.log("inside on");
        console.log("eventName: ", eventName);
        Socket.ioSocket.on(eventName, function (data) {
            console.log("data: ", data);
            callback(data);
        });
    }
}

function emit(eventName, data) {
    if (Socket.ioSocket) {
        console.log("inside emit");
        Socket.ioSocket.emit(eventName, data);
    }
}

function removeListener(eventName) {
    if (Socket.ioSocket) {
        Socket.ioSocket.removeListener(eventName);
    }
}

export default Socket;