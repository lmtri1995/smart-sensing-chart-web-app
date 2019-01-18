import io from 'socket.io-client';
import {config} from '../constants/config';

var Singleton = (function () {
    var instance;

    function createInstance(token = '') {
        //var socket = io('http://10.2.13.223:8888/totalCharts');
        var socket = io(config.SERVER_URL, {
            path: "/api/chart",
            //resource: "totalCharts",
            query: {
                token: token,
            },
            forceNew: true
        });

        if (socket.disconnected) {
            console.log("disconected");
            console.log('create connection');

            socket = io(config.SERVER_URL, {
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: Infinity
            });
        }
        return socket;
    }

    return {
        getInstance: function (token = '') {
            if (!instance) {
                instance = createInstance(token);
            }
            return instance;
        }
    };
})();

export default Singleton;
