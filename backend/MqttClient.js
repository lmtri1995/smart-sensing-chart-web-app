var mqtt = require('mqtt'); 
var db = require('./api/db')

var Topic = '#'; 
var Broker_URL = process.env.BROKER_URL;

var options = {
	clientId: 'MyMQTT',
	port: 1883,
	//username: 'mqtt_user',
	//password: 'mqtt_password',	
	keepalive : 60
};

var mqttClient  = mqtt.connect(Broker_URL, options);
mqttClient.on('connect', mqtt_connect);
mqttClient.on('reconnect', mqtt_reconnect);
mqttClient.on('error', mqtt_error);
mqttClient.on('message', mqtt_messsageReceived);
mqttClient.on('close', mqtt_close);

function mqtt_connect() {
    console.log("Connecting MQTT");
    mqttClient.subscribe(Topic, mqtt_subscribe);
};

function mqtt_subscribe(err, granted) {
    console.log("Subscribed to " + Topic);
    if (err) {console.log(err);}
};

function mqtt_reconnect(err) {
    //console.log("Reconnect MQTT");
    //if (err) {console.log(err);}
	mqttClient  = mqtt.connect(Broker_URL, options);
};

function mqtt_error(err) {
    //console.log("Error!");
	//if (err) {console.log(err);}
};

function after_publish() {
	//do nothing
};

//receive a message from MQTT broker
function mqtt_messsageReceived(topic, message, packet) {

	console.log(topic + " : " + message);
	var message_str = message.toString(); //convert byte array to string
	message_str = message_str.replace(/\n$/, ''); //remove new line
	//payload syntax: clientID,topic,message
	if (countInstances(message_str) != 1) {
		console.log("Invalid payload");
	} else {	
		var message_arr = extract_string(message_str); //split a string into an array
		var sql = "INSERT INTO ?? (??,??,??) VALUES (?,?,?)";
		var params = ['tbl_messages', 'clientID', 'topic', 'message', message_arr[0], topic, message_arr[1]];
		sql = db.mysql.format(sql, params);	
		
		db.dbConnecttion.query(sql, function (error, results) {
			if (error) throw error;
			console.log("Message added: " + message_str);
		}); 
	}

};

function mqtt_close() {
	//console.log("Close MQTT");
};

//count number of delimiters in a string
function countInstances(message_str) {
	var delimiter = ",";
	var substrings = message_str.split(delimiter);
	return substrings.length - 1;
};

function extract_string(message_str) {
	var message_arr = message_str.split(","); //convert to array	
	return message_arr;
};