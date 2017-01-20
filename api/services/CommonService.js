/*
Author :- Sunny chauhan
Purpose :- Common Service used to provide utility methods
*/
const ENV_OBJ = require(APP_PATH + '/config/Env.js')();
const UserModel = require(APP_PATH + '/api/models/UserModel.js');
const ChatModel = require(APP_PATH + '/api/models/ConversationModel.js');

module.exports = {

     generateOtp : function (num) {
          let text = "";
          let possible = "0123456789";
          for( let i = 0; i < num; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));
          return text;
     },

     generateRandom:function(num){
          let text = "";
          possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          for( let i=0; i < num; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));
          return text;
     },

     isEmailExist : function(newEmail, UserModel, cb) {
          let status = "ERR";
          UserModel.findOne ({email : newEmail}, function (err, res) {
               if(res != null) {
                    status =  true;
               } else {
                    status = false;
               }
               cb(status);
          });
     },

     isGoogleIdExist : function(googleId, UserModel, cb) {
          let status;
          UserModel.findOne ({googleId : googleId}, function (err, res) {
               if(res != null) {
                    status =  true;
               } else {
                    status = false;
               }
               cb(status);
          });
     },

     isFacebookIdExist : function(facebookId, UserModel, cb) {
          let status;
          UserModel.findOne ({facebookId : facebookId}, function (err, res) {
               if(res != null) {
                    status =  true;
               } else {
                    status = false;
               }
               cb(status);
          });
     },

     isMobileVerificationDone : function(userId, cb) {
          let UserModel = require(APP_PATH + '/api/models/UserModel.js');
          UserModel.findOne ( {_id : userId , "mobile" : { $ne : ""}, "otp" : null}, function (err, res) {
               if(err) {
                    cb("err", null);
               }else if(res != null) {
                    cb(null,true);
               } else {
                    cb(null,false);
               }
          });
     },

     isLicenseVerificationDone : function(userId, cb) {
          let UserModel = require(APP_PATH + '/api/models/UserModel.js');
          UserModel.findOne ( {_id : userId , "license.name" : { $exists : true, $ne : ""}}, function (err, res) {
               if(err) {
                    cb(true, null);
               }else if(res != null) {
                    cb(null,true);
               } else {
                    cb(null,false);
               }
          });
     },

     getUserTransactions : function(model, userId, cb) {
          model.find ( {userId : userId} , function (err, res) {
               if(err) {
                    cb("err", null);
               }else {
                    cb(null,res);
               }
          });
     },

     /**--------------------------------------------------------------------------
     Function    : sendPushNotification
     Description : send push notification
     --------------------------------------------------------------------------*/
     pushNotification (notifyObj, io, callback) {
          var FCM = require('fcm-node');
          var serverKey = ENV_OBJ.FCM.SERVERKEY;
          var fcm = new FCM(serverKey);

          UserModel.findOne({ "_id" : notifyObj.to} ,{fcm : 1, name : 1}, {"upsert" : false, "new":true}).exec(function (err, resData) {
               if(err) callback (true, null);
               if(!resData) {
                    callback (true, null);
               } else {
                    if(resData.fcm && resData.fcm.platform != 'WEB') {
                         ChatModel
                              .findOne(
                                        {_id : notifyObj._id}
                              )
                              .populate (
                                   {
                                        'path' : 'to from',
                                        'select' : 'name profile'
                                   }
                              )
                              .exec(function (err, data) {
                                   if(err) callback (true, null);
                                   if(data) {
                                        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                             to : resData.fcm.deviceToken,
                                             //collapse_key: 'your_collapse_key',

                                             notification: {
                                                  title: resData.fullname,
                                                  body: notifyObj.message
                                             },

                                             data: {  //you can send only notification or only data(or include both)
                                                  title : resData.fullname,
                                                  message: notifyObj.message,
                                                  userId : notifyObj.from,
                                                  action : 'PUSH',
                                                  jsonData : data
                                             }
                                        };
                                        fcm.send(message, function(err, response){
                                             if (err) {
                                                  callback ( true, null );
                                                  //console.log("Something has gone wrong!");

                                             } else {
                                                  callback ( null, data );
                                                  //console.log("Successfully sent with response: ", response);
                                             }
                                        });
                                   }
                              });
                         } else {
                              ChatModel
                                   .findOne(
                                             {_id : notifyObj._id}
                                   )
                                   .populate (
                                        {
                                             'path' : 'to from',
                                             'select' : 'name profile'
                                        }
                                   )
                                   .exec(function (err, data) {
                                        if (err) {
                                             callback ( true, null );
                                        }
                                        callback ( true, data);
                                   });

                         }
               }
          });
     }


};
