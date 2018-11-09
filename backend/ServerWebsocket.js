'use strict';
const ArrayList = require('arraylist');
module.exports = function(server) {
    var WebSocketServer = require('socket.io')(server);
    let  clientMap = new ArrayList();

    WebSocketServer.of('/live').on("connection", function(socket){
      //  console.log('new ws connection: ' + socket.client.request.url + ' -> ' + socket.client.conn);
        console.info(`Client connected [id=${socket.id}]`);
        // initialize this client's sequence number
        clientMap.add(socket);

        socket.on('event', function(data){
            console.log('received: %s', data);
        });
        socket.on('disconnect', function(){
            clientMap.removeElement(socket);
            console.info(`Client gone [id=${socket.id}]`);
        });
    });

    setInterval(() => {
        if(!clientMap.isEmpty()){
            var client = clientMap.get(0);
             client.emit("seq-num", "\"name\":\""+client.id+"\"");
        }

         //   sequenceNumberByClient.set(client, );
      //  }
    }, 1000);
};