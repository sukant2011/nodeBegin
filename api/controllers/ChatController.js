/*
* Author : Sunny Chauhan
* Module : InfractionController
* Description : Use to report User or listing if
*/
const AppMessages = require(APP_PATH + '/config/Message.js');
const AppConstants = require(APP_PATH + '/config/Constant.js');
const CommonService = require(APP_PATH + '/api/services/CommonService.js');
const UserModel = require(APP_PATH + '/api/models/UserModel.js');
const ChatModel = require(APP_PATH + '/api/models/ConversationModel.js');
// const ENV_OBJ = require(APP_PATH + '/config/Env.js')();

class ChatController  {

     /**--------------------------------------------------------------------------
     Function    : list
     Description : list online users
     --------------------------------------------------------------------------*/
     admin_onlineUsers () {
          UserModel.find({
               isLogin : true, role : 'USER'
          })
          .exec(
               function(err, OnlineUsers){
                    return OnlineUsers;
               });
          }

          /**--------------------------------------------------------------------------
          Function    : listUsers
          Description : list users
          --------------------------------------------------------------------------*/
          listUsers (req, res) {
               let mongoose = require('mongoose');
               let userId = mongoose.Types.ObjectId(req.query.fromId);
               ChatModel.aggregate([
                    {
                         $match : {
                              'type' : 'Message',
                              $or : [
                                   {
                                        from : userId,
                                   },
                                   {
                                        to : userId,
                                   }
                              ]
                         }
                    },
                    {
                         $group: {
                              _id :  {
                                   "to" : "$to", 'from':"$from"
                              }
                         }
                    },
                    {
                         $project : {
                              users : ["$_id.to", "$_id.from"]
                         }
                    },
                    {
                         $unwind : "$users"
                    },
                    {
                         $group : {
                              "_id" : "$users"
                         }
                    },
                    {
                         $project : {
                              "user" : "$_id"
                         }
                    },
                    {
                         $match : {
                              "user" : {
                                   "$ne" :userId
                              }
                         }
                    },
                    {
                         $lookup : {
                              from: 'users',
                              localField: 'user',
                              foreignField: '_id',
                              as: 'info'
                         }
                    },
                    {
                         $project : {
                              "_id" : "$_id",
                              "user" : "$user",
                              "portrait" : "$info.profile",
                              "name" : "$info.name"
                         }
                    }
               ], function (err, users) {
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    return res.json({resStatus:'success', msg :"Users List ", result: users});
               });
          }

          /**--------------------------------------------------------------------------
          Function    : sendMessage
          Description : send Message bw renter & car owner
          --------------------------------------------------------------------------*/
          sendMessage (req, res) {
               console.log("=====");
               req.body.type = 'Message';
               ChatModel(req.body)
               .save(
                    function(err,resData){
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         /** Send Push Notification to Mobile*/
                         CommonService.pushNotification(resData, function (errPush, response) {
                              if (err) {
                                   console.log("Something has gone wrong!");
                              } else {
                                   //console.log("Successfully sent with response: ", response);
                                   return res.json({resStatus:'success', msg :"Your message has been sent", result: response});
                              }
                         });
                    }
               );
          }

          /**--------------------------------------------------------------------------
          Function    : listMessage
          Description : list Message bw renter & car owner
          --------------------------------------------------------------------------*/
          listMessage(req, res) {
               ChatModel
               .find({
                    type : 'Message',
                    $or : [
                         {
                              from : req.query.toId,
                              to : req.query.fromId
                         },
                         {
                              to : req.query.toId,
                              from : req.query.fromId
                         }
                    ]
               })
               .populate({
                    path:'from to',
                    select : 'name profile'
               })
               .sort({createdDate : 1})
               .exec(
                    function(err,msgs){
                         if (err) return res.json({resStatus:'error', msg : "Some Error Occured, Please try after Some time"});
                         return res.json({resStatus:'success',msg : 'Messages List', result: msgs});
                    });
               }

               /**--------------------------------------------------------------------------
               Function    : listChat
               Description : list Chat bw user & user
               --------------------------------------------------------------------------*/
               listChat(req, res) {
                    ConversationModel.find({
                         $or : [
                              {
                                   from : req.params.userId,
                                   to : req.params.fromId
                              },
                              {
                                   to : req.params.userId,
                                   from : req.params.fromId
                              }
                         ]
                    })
                    .populate({
                         path:'from to',
                         select : "name profile"
                    })
                    .exec(
                         function(err, msgArr){
                              res.json({result :msgArr});
                         });
                    }

                    /**--------------------------------------------------------------------------
                    Function    : listChat
                    Description : register a anonymous user for CHAT
                    --------------------------------------------------------------------------*/
                    registerChatUser (req, res) {
                         let postBody = req.body;
                         let name = postBody.name.split(" ");
                         postBody.name = {
                              first : name[0],
                              last : (name && name[1])?name[1]:""
                         };
                         postBody.role = 'ANON';
                         UserModel(postBody)
                         .save(function(err,resData){
                              if (err) return res.json({resStatus:'error', msg : "Some Error Occured, Please try after Some time"});
                              return res.json({resStatus:'success',result: resData});
                         });
                    }



               }

               module.exports = new ChatController();
