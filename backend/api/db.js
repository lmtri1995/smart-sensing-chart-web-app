'use strict';
const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "dbtest",
  port:process.env.DB_PORT || "3306"
});

module.exports ={
  dbConnecttion:db,
  mysql:mysql
}