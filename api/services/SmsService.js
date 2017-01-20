/*
Author :- Sunny chauhan
Purpose :- Sms Service used to send sms throughout the application
*/
const ENV_OBJ = require(APP_PATH + '/config/Env.js')();

module.exports = {

     send: function(smsObj, cb) {
          let client = require('twilio')(ENV_OBJ.TWILIO.SID, ENV_OBJ.TWILIO.AUTHTOKEN);
          let obj = {
               body: smsObj.msg,
               to: smsObj.receipient,
               from: ENV_OBJ.TWILIO.SENDER
          };
          client.messages.create(obj, function(err, data) {
               if (err) {
                    cb(true, null);
               } else {
                    cb(null, data);
               }
          });
     },
};
