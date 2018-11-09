'use strict';
module.exports = function(app) {
  var msgCtrl = require('./controllers/MessageController');

  // todoList Routes
  app.route('/messages')
    .get(msgCtrl.get)
    .post(msgCtrl.store);

  app.route('/messages/:messageId')
    .get(msgCtrl.detail)
    .put(msgCtrl.update)
    .delete(msgCtrl.delete);
};