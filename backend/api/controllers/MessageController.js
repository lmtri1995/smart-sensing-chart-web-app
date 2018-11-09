'use strict'
const db = require('../db')

module.exports = {
    get: (req, res) => {
        var sql = 'SELECT * FROM tbl_messages'
        db.dbConnecttion.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    detail: (req, res) => {
        var sql = 'SELECT * FROM tbl_messages WHERE messageID = ?'
        db.dbConnecttion.query(sql, [req.params.messageId], (err, response) => {
            if (err) throw err
            res.json(response[0])
        })
    },
    update: (req, res) => {
        var data = req.body;
        var messageId = req.params.messageId;
        var sql = 'UPDATE tbl_messages SET ? WHERE messageID = ?'
        db.dbConnecttion.query(sql, [data, messageId], (err, response) => {
            if (err) throw err
            res.json({message: 'Update success!'})
        })
    },
    store: (req, res) => {
        var data = req.body;
        var sql = 'INSERT INTO tbl_messages SET ?'
        if (Array.isArray(data)){
            // res.json({
            //     code: 400,
            //     message: "Don't support array objects"})
            sql = 'INSERT INTO tbl_messages (clientID, topic, message,Enable ) VALUES ?'
                db.dbConnecttion.query(sql, 
                    [data.map(item => [item.clientID, item.topic, item.message, item.Enable])], (err, response) => {
                    if (err){
                        res.json({
                            code: 400,
                            message: err.sqlMessage})
                    } else{
                        res.json({
                            code: 200,
                            message: 'Insert array success!'})
                    }
                  
                })
        }else {
            db.dbConnecttion.query(sql, [data], (err, response) => {
                if (err){
                    res.json({
                        code: 400,
                        message: err.sqlMessage})
                } else{
                    res.json({
                        code: 200,
                        message: 'Insert success!'})
                }
              
            })
        }

        
    },
    delete: (req, res) => {
        var sql = 'DELETE FROM tbl_messages WHERE messageID = ?'
        db.dbConnecttion.query(sql, [req.params.messageId], (err, response) => {
            if (err) throw err
            res.json({message: 'Delete success!'})
        })
    }
}