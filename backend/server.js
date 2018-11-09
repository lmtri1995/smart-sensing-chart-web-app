const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const server = require('http').createServer(app);

require("dotenv").config()
require('dotenv').load()

const port = process.env.API_PORT 

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var routes = require('./api/routes') //importing route
routes(app)

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
})

var wSocketServer = require('./ServerWebsocket') //importing route
wSocketServer(server)

server.listen(port, function () {
    console.log('RESTful API and Websocket server listening on port ' + port);
});

//app.listen(port)
//console.log('RESTful API server started on: ' + port)

//require('./MqttClient')

