module.exports = function(app, express, io) {
     let router = express.Router();
     let adminAuthorization = require(APP_PATH + "/api/middlewares/admin_TokenAuth.js");
     let authorization = require(APP_PATH + "/api/middlewares/user_TokenAuth.js");
     let routeObj = require(APP_PATH + '/api/controllers/ChatController.js');
     const UserModel = require(APP_PATH + '/api/models/UserModel.js');
     const ConversationModel = require(APP_PATH + '/api/models/ConversationModel.js');
     const CommonService = require(APP_PATH + '/api/services/CommonService.js');
     const ChatModel = require(APP_PATH + '/api/models/ConversationModel.js');

     router.post('/register',routeObj.registerChatUser);
     router.get('/list/:userId/:fromId',routeObj.listChat);
     router.get('/listUsers',authorization, routeObj.listUsers);
     router.get('/listMessage',authorization, routeObj.listMessage);


     /** SOCKET Programming */

     //let sockets = [];
     // socket.io events
     // io.sockets.on("connection", function( socket ) {
     //      //console.log( "A user connected" );
     //
     //      // Register your client with the server, providing your username
     //      socket.on('init', function(data) {
     //           console.log("OHh, I am registered on Sockets");
     //           //sockets[username] = socket;
     //           socket.join(data.userId);
     //      });
     //
     //      socket.on('list onlineUsers', function () {
     //           UserModel.find({isLogin : true}).exec(function(err, userArr){
     //                io.emit('list onlineUsers', userArr);
     //           });
     //      });
     //
     //      socket.on('list message', function () {
     //           ConversationModel.find({}).populate({path : "from to"}).exec(function(err, msgArr){
     //                io.emit('list message', msgArr);
     //           });
     //      });
     //
     //      socket.on('chat message', function (obj) {
     //           var mongoose = require('mongoose');
     //           var from = mongoose.Types.ObjectId(obj.from);
     //           var to = mongoose.Types.ObjectId(obj.to);
     //
     //           //console.log(from+ "========" + to);
     //           ConversationModel(obj).save(function(err, msgObj){
     //                if(err) {
     //                     return console.log("Some Error Occured");
     //                }
     //                ConversationModel.find(
     //                     {
     //                          $or : [
     //                               {from : from, to : to},
     //                               {from :to, to : from}
     //                          ]
     //                     }).
     //                     populate({path : "from to"}).
     //                     limit(1).
     //                     sort({ "createdDate" : -1 }).
     //                     exec(function(err, msgObj){
     //                          //console.log(msgObj);
     //                          //socket.to(obj.to).emit('chat message', msgObj[0]);
     //                          io.sockets.in(obj.to).emit('chat message', msgObj[0]);
     //
     //                          //io.emit('chat message', msgObj[0]);
     //                     });
     //                });
     //           });
     //
     //           socket.on('disconnect', function(){
     //                console.log('user disconnected');
     //           });
     //      });

          /** --------------- END -------------*/

          router.post('/addMessage',authorization, function (req, res) {
               req.body.type = 'Message';
               ChatModel(req.body)
               .save(
                    function(err,resData){
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         /** Send Push Notification to Mobile*/
                         CommonService.pushNotification(resData,io, function (errPush, response) {
                              if (err) {
                                   return res.json({resStatus:'error', msg : "Some Error Occured, Please try after Some time"});
                              } else {
                                   let socketId = "";
                                   if(socketUsers) {
                                        for(var i=0;i<socketUsers.length;i++){
                                             if(socketUsers[i].user_name == response.to._id){
                                                  socketId = socketUsers[i].id;
                                             }
                                        }
                                   }
                                   //console.log("===",socketId);
                                   io.sockets.to(socketId).emit('ChatMsg', response);
                                   return res.json({resStatus:'success', msg :"Your message has been sent", result: response});
                              }
                         });
                    }
               );
          });

          app.use('/chat', router);
     }
