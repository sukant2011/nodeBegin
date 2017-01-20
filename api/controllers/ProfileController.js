/*
* Author : Sunny Chauhan
* Module : AuthsController
* Description : Use to get INfo of Authenticated User
*/
const AppMessages = require(APP_PATH + '/config/Message.js');
const AppConstants = require(APP_PATH + '/config/Constant.js');
const CommonService = require(APP_PATH + '/api/services/CommonService.js');
const SmsService = require(APP_PATH + '/api/services/SmsService.js');
const EmailService = require(APP_PATH + '/api/services/EmailService.js');
const UserModel = require(APP_PATH + '/api/models/UserModel.js');
const UserModelObj = new UserModel();
let fieldsToExclude = {"password" : 0, "isDeleted" : 0, "modifiedDate" : 0, "otp" : 0};

var profileObj = module.exports =   {

     /**--------------------------------------------------------------------------
     Function    : refreshMobileDeviceToken
     Description : use to refresh Mobile Device Token
     --------------------------------------------------------------------------*/
     refreshMobileDeviceToken (req, res) {
          UserModel
               .update(
                    { "_id" : req.body.userId} ,
                    {"fcm.platform" : req.body.platform , "fcm.deviceToken" : req.body.deviceToken}
               )
               .exec(
                    function (err, resData) {
                         if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                         return res.json({resStatus:'success', msg : "DeviceToken refereshed Successfully"});
                    }
               );
     },

     /**--------------------------------------------------------------------------
     Function    : sendReferral
     Description : use to send the user Info
     --------------------------------------------------------------------------*/
     sendReferrals (req, res) {
          let toArr = req.body.email;
          let template = req.body.referCodeUrl;
          let mailOptions = {
               from: AppConstants.EMAIL,
               subject: "Invitation",
               html: template
          }
          EmailService.sendMultiple(toArr, mailOptions);
          return res.json({resStatus:'success', msg : "Invitation has been sent"});
     },
     /**--------------------------------------------------------------------------
     Function    : view
     Description : use to view the user Info
     --------------------------------------------------------------------------*/
     sendVerificationCode (req, res) {
          let OTP = 123456;
          // let smsObj = {};
          // smsObj.receipient = '+ 91 9056561808';
          // smsObj.msg = 'Please enter the Otp for verify your account : '+ OTP;
          // SmsService.send(smsObj, function (err, res) {
          //      if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               UserModel.findOneAndUpdate({ "_id" : req.body.userId} ,{"otp" : OTP , "mobile" : req.body.mobile}, {"projection" : fieldsToExclude, "upsert" : false, "new":true}).exec(function (err, resData) {
                    console.log(err);
                    if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                    if(!resData) {
                         return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                    } else {
                         return res.json({resStatus:'success', msg : "An OTP has been send to your number"});
                    }
               });
          //});
     },

     /**--------------------------------------------------------------------------
     | Function    : confirmOtp
     | Description : use to confirm account after register of user
     |--------------------------------------------------------------------------*/
     confirmOtp: function (req, res) {
          UserModel.findOneAndUpdate({ "_id" : req.body.userId, "otp" : req.body.otp} ,{"status" : true, "otp" : null, 'verification.mobile' : true}, {"projection" : fieldsToExclude, "upsert": false, "new":true}).exec(function (err, resData) {
               if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               if(resData == null) {
                    return res.json({resStatus:'error', msg :AppMessages.INVALID_OTP, licenseVerification : false});
               } else {
                    CommonService.isLicenseVerificationDone(resData.userId, function(err, status) {
                         return res.json({resStatus:'success', msg : "You have successfully authenticated your account", licenseVerification : status});
                    });
               }
          });
     },

     /**--------------------------------------------------------------------------
     | Function    : reSendOtp
     | Description : use to resend OTP in case of OTP not received
     |--------------------------------------------------------------------------*/
     reSendOtp: function (req, res) {
          //let OTP = CommonService.generateOtp(6);
          let OTP = 123456;
          UserModel.findOneAndUpdate({ _id : req.body.userId},{otp : OTP},function (err, resData) {
               if(err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               if(resData == null) {
                    return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               } else {
                    return res.json({resStatus:'success', msg : AppMessages.OTP});
               }
          });
     },

     /**--------------------------------------------------------------------------
     Function    : view
     Description : use to view the user Info when refer a friend
     --------------------------------------------------------------------------*/
     referralView (req, res) {
          if (!req.query.code) {
               return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
          }
          UserModel.findOne({_id:req.query.code}, {"profile" : 1, name :1}, function ( err, resData) {
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg :"Account View", result : resData});
          });
     },

     /**--------------------------------------------------------------------------
     Function    : view
     Description : use to view the user Info
     --------------------------------------------------------------------------*/
     view (req, res) {
          if (!req.query.reqId) {
               return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
          }
          UserModel.findOne({_id:req.query.reqId}, fieldsToExclude, function ( err, resData) {
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg :"Account View", result : resData});
          });
     },

     /**--------------------------------------------------------------------------
     Function    : register
     Description : use to change password
     --------------------------------------------------------------------------*/
     changePassword (req, res){
          let reqId = req.body.reqId;

          // if (!req.body.password) {
          //      return res.json({resStatus:'error', msg :'Old password is required'});
          // }

          if (!req.body.new_password) {
               return res.json({resStatus:'error', msg :'New password is required'});
          }

          if (!req.body.con_password) {
               return res.json({resStatus:'error', msg :'Confirm password is required'});
          }

          if(req.body.new_password != req.body.con_password) {
               return res.json({resStatus:'error', msg :'Your Passwords do not match'});
          }

          UserModel.findOne({ _id : reqId }).exec(function(err, resData){

               if (err) {
                    return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               }

               if(resData != null) {
                    //UserModelObj.comparePassword(req.body.password, resData,  function(err, match) {
                         //if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                         //if (match === true) {
                              resData.password = req.body.new_password;
                              resData.save(function(err, data) {
                                   if (err) return res.json({resStatus:'error',msg:AppMessages.SERVER_ERR});
                                   return res.json({resStatus:'success', msg :'Password updated Successfully'});
                              });
                         //} else {
                              //return res.json({resStatus:'error',msg:"You have entered wrong old Password"});
                         //}
                    //});
               } else {
                    return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               }
          });
     },

     /**--------------------------------------------------------------------------
     Function    : updateProfile
     Description : Callback function use to update the user in background
     --------------------------------------------------------------------------*/
     updateProfile (reqId, updatedData, cb) {
          UserModel.findOneAndUpdate({"_id" : reqId},  { $set : updatedData }, {"projection" : fieldsToExclude , upsert:false, new:true},function (err, resData) {
               if (err) {
                    cb(err, null);
               } else {
                    cb(null, resData);
               }
          });
     },

     /**--------------------------------------------------------------------------
     Function    : update
     Description : Use to update the User's profile
     --------------------------------------------------------------------------*/
     update (req, res) {
          const fs = require('fs');
          const gm = require('gm');
          const imageMagick = gm.subClass({ imageMagick: true });
          const formidable = require('formidable');
          const form = new formidable.IncomingForm();
          let RecordLocator = "";
          let updateObj = {};
          console.log("======jjjjjjj========");
          form.parse(req, function(err, fields, files) {
               console.log("=============="); return;
               let _id = fields._id;
               const mongoose = require('mongoose');
               //let obj = new UserModel();
               //obj._id = mongoose.Types.ObjectId(_id);
               let obj = {};

               if(fields.first && fields.last) {
                    updateObj["name.first"] = fields.first;
                    updateObj["name.last"] = fields.last;
               }

               if(fields.email) {
                    updateObj['email'] = fields.email;
               }

               if(fields.description) {
                    updateObj['profile.description'] = fields.description;
               }

               if(fields.mobileText) {
                    updateObj['notifications.mobileText'] = fields.mobileText;
               }

               if(fields.emailReminder) {
                    updateObj['notifications.emailReminder'] = fields.emailReminder;
               }

               if(fields.emailPromotions) {
                    updateObj['notifications.emailPromotions'] = fields.emailPromotions;
               }

               if(fields.isAllowManual) {
                    updateObj['notifications.isAllowManual'] = fields.isAllowManual;
               }

               if(files.file && files.file.name){
                    let uploadDir = 'public' + AppConstants.PORTRAIT_PATH;
                    fs.access(uploadDir, fs.F_OK, function(err) {
                         if (!err) {
                              let fileName = files.file.name;
                              let fileStrArr = fileName.split('.');
                              let ext = fileStrArr[fileStrArr.length - 1];
                              let newFileName = CommonService.generateRandom(8)+(new Date()).getTime() + CommonService.generateRandom(6) + '.' + ext;
                              fs.rename(files.file.path, uploadDir + "/" + newFileName, function(err) {
                                   if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                                   let path = AppConstants.PORTRAIT_PATH;
                                   // obj.profile = {description : fields.description, path : AppConstants.PORTRAIT_PATH, photo : newFileName,  photoOriginal : fileName};

                                   updateObj['profile.path'] = path;
                                   updateObj['profile.photo'] = newFileName;
                                   updateObj['profile.photoOriginal'] = fileName;

                                   profileObj.updateProfile(_id, updateObj, function (err, resData) {
                                        if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                                        if(!resData) {
                                             return res.status(400).json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                                        } else {
                                             return res.json({resStatus:'success', msg :'profile have been updated successfully',result:resData});
                                        }
                                   });
                              });
                         } else {
                              fs.mkdirSync(uploadDir);
                         }
                    });
               } else {
                    // obj.profile = {description : fields.description, photoOriginal : fields.photoOriginal, photo : fields.photo, path : fields.path};
                    profileObj.updateProfile(_id, updateObj, function (err, resData) {
                         if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                         if(!resData) {
                              return res.status(400).json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                         } else {
                              return res.status(200).json({resStatus:'success', msg :'profile have been updated successfully',result:resData});
                         }

                    });
               }

          });
     },

     /**--------------------------------------------------------------------------
     Function    : update
     Description : Use to update the User's profile
     --------------------------------------------------------------------------*/
     updateAccount (req, res) {
          let updateObj = {};
          let userId = req.body._id;

          if(req.body.first && req.body.last) {
               updateObj["name.first"] = req.body.first;
               updateObj["name.last"] = req.body.last;
          }

          if(req.body.email) {
               updateObj['email'] = req.body.email;
          }

          if(req.body.description) {
               updateObj['profile.description'] = req.body.description;
          }

          if(req.body.mobileText) {
               updateObj['notifications.mobileText'] = req.body.mobileText;
          }

          if(req.body.emailReminder) {
               updateObj['notifications.emailReminder'] =  req.body.emailReminder;
          }

          if(req.body.emailPromotions) {
               updateObj['notifications.emailPromotions'] =  req.body.emailPromotions;
          }

          if(req.body.isAllowManual) {
               updateObj['isAllowManual'] =  req.body.isAllowManual;
          }

          UserModel.findOneAndUpdate( {_id : userId }, {$set : updateObj }, {upsert : false}, function (err, resData) {
               if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               if(!resData) {
                    return res.status(400).json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               } else {
                    return res.status(200).json({resStatus:'success', msg :'Updated successfully'});
               }

          });
     },


     /**--------------------------------------------------------------------------
     Function    : update
     Description : Use to update the User's profile
     --------------------------------------------------------------------------*/
     uploadLicense (req, res) {
          const fs = require('fs');
          const gm = require('gm');
          const imageMagick = gm.subClass({ imageMagick: true });
          const formidable = require('formidable');
          const form = new formidable.IncomingForm();
          let RecordLocator = "";
          form.parse(req, function(err, fields, files) {
               let userId = fields.userId;
               let obj = {};
               obj["license.name.first"] = fields.first;
               obj["license.name.last"] = fields.last;
               obj["license.name.middle"] = fields.middle;
               obj["license.dob"] = fields.dob;
               obj["license.issuer.country"] = fields.country;
               obj["license.issuer.state"] = fields.state;

               // obj.name = {first : fields.first, last : fields.last, middle : fields.middle};
               // obj.number = fields.number;
               // obj.dob = fields.dob;
               // obj.issuer = {country : fields.country, state : fields.state};
               if(files.file && files.file.name){
                    let uploadDir = 'public' + AppConstants.PORTRAIT_PATH;
                    fs.access(uploadDir, fs.F_OK, function(err) {
                         if (!err) {
                              let fileName = files.file.name;
                              let fileStrArr = fileName.split('.');
                              let ext = fileStrArr[fileStrArr.length - 1];
                              let newFileName = CommonService.generateRandom(8)+(new Date()).getTime() + CommonService.generateRandom(6) + '.' + ext;
                              fs.rename(files.file.path, uploadDir + "/" + newFileName, function(err) {
                                   if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                                   let path = AppConstants.PORTRAIT_PATH;
                                   obj.image = {path : AppConstants.PORTRAIT_PATH, name : newFileName,  original : fileName};
                                   obj["license.image.path"] = AppConstants.PORTRAIT_PATH;
                                   obj["license.image.name"] = newFileName;
                                   obj["license.image.original"] = fileName;
                                   //obj["verification.license"] = true;
                                   UserModel.findOneAndUpdate({"_id" : userId }, {$set : obj }, { "projection" : fieldsToExclude, "upsert" : false, "new" : true}, function (err, resData) {
                                        if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                                        if(!resData) {
                                             return res.status(400).json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                                        } else {
                                             return res.json({resStatus:'success', msg :'License have been updated successfully',result:resData});
                                        }

                                   });
                              });
                         } else {
                              fs.mkdirSync(uploadDir);
                         }
                    });
               } else {
                    if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                    return res.json({resStatus:'error', msg :'License is required'});
               }

          });
     },

     /*** ***********************************************Admin API' s****************************************
     **********************************************************************************************************/

     /**--------------------------------------------------------------------------
     Function    : list
     Description : list all the users
     --------------------------------------------------------------------------*/
     admin_list (req, res) {
          UserModel.find({"isDeleted" : false}, fieldsToExclude, function(err, resData){
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               if (resData) {
                    return res.json({resStatus:'success', msg :'Users List', result : resData});
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }
          });
     },

     /**--------------------------------------------------------------------------
     Function    : view
     Description : use to view the user Info
     --------------------------------------------------------------------------*/
     admin_view (req, res) {
          if (!req.query.reqId) {
               return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
          }
          UserModel.findOne({_id:req.query.reqId}, fieldsToExclude, function ( err, resData) {
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg :"Account View", result : resData});
          });
     },

     /**--------------------------------------------------------------------------
     Function    : register
     Description : use to change password
     --------------------------------------------------------------------------*/
     admin_changePassword (req, res){
          let reqId = req.query.reqId;

          if (!req.body.password) {
               return res.json({resStatus:'error', msg :'Old password is required'});
          }

          if (!req.body.new_password) {
               return res.json({resStatus:'error', msg :'New password is required'});
          }

          if (!req.body.con_password) {
               return res.json({resStatus:'error', msg :'Confirm password is required'});
          }

          UserModel.findOne({ _id : reqId }).exec(function(err, resData){

               if (err) {
                    return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               }

               if(resData != null) {
                    UserModelObj.comparePassword(req.body.password, resData,  function(err, match) {
                         if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                         if (match === true) {
                              if(req.body.new_password != req.body.con_password) {
                                   return res.json({resStatus:'error', msg :'Your new passwords do not match'});
                              }
                              resData.password = req.body.new_password;
                              resData.save(function(err, data) {
                                   if (err) return res.json({resStatus:'error',msg:AppMessages.SERVER_ERR});
                                   return res.json({resStatus:'success', msg :'Password updated Successfully'});
                              });
                         } else {
                              return res.json({resStatus:'error',msg:"You have entered wrong old Password"});
                         }
                    });
               } else {
                    return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               }
          });
     },

     /**--------------------------------------------------------------------------
     Function    : update
     Description : Use to update the User's profile
     --------------------------------------------------------------------------*/
     admin_update (req, res) {
          const fs = require('fs');
          const gm = require('gm');
          const imageMagick = gm.subClass({ imageMagick: true });
          const formidable = require('formidable');
          const form = new formidable.IncomingForm();
          let RecordLocator = "";
          form.parse(req, function(err, fields, files) {
               let _id = fields._id;
               const mongoose = require('mongoose');
               //let obj = new UserModel();
               //obj._id = mongoose.Types.ObjectId(_id);
               let obj = {};
               obj.name = {first : fields.first, last : fields.last};
               obj.email = fields.email;
               if(files.file && files.file.name){
                    let uploadDir = 'public' + AppConstants.PORTRAIT_PATH;
                    fs.access(uploadDir, fs.F_OK, function(err) {
                         if (!err) {
                              let fileName = files.file.name;
                              let fileStrArr = fileName.split('.');
                              let ext = fileStrArr[fileStrArr.length - 1];
                              let newFileName = CommonService.generateRandom(8)+(new Date()).getTime() + CommonService.generateRandom(6) + '.' + ext;
                              fs.rename(files.file.path, uploadDir + "/" + newFileName, function(err) {
                                   if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                                   let path = AppConstants.PORTRAIT_PATH;
                                   obj.profile = {description : fields.description, path : AppConstants.PORTRAIT_PATH, photo : newFileName,  photoOriginal : fileName};

                                   profileObj.updateProfile(_id, obj, function (err, resData) {
                                        if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                                        return res.json({resStatus:'success', msg :'profile have been updated successfully',result:resData});
                                   });
                              });
                         } else {
                              fs.mkdirSync(uploadDir);
                         }
                    });
               } else {
                    obj.profile = {description : fields.description, photoOriginal : fields.photoOriginal, photo : fields.photo, path : fields.path};
                    //console.log(obj); return;
                    profileObj.updateProfile(_id, obj, function (err, resData) {
                         if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                         return res.json({resStatus:'success', msg :'profile have been updated successfully',result:resData});
                    });
               }

          });
     },

     /**--------------------------------------------------------------------------
     Function    : removeUser
     Description : use to remove user
     --------------------------------------------------------------------------*/
     admin_removeUser (req, res) {
          UserModel.findOneAndUpdate({_id:req.query.reqId},{'isDeleted':true}, {new:true},function(err, resData){
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               if (resData) {
                    return res.json({resStatus:'success', msg :'User has been removed Successfully'});
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }
          });
     },

     /**--------------------------------------------------------------------------
     Function    : user Count
     Description : use to remove user
     --------------------------------------------------------------------------*/
     admin_userCount (req, res) {
          UserModel.count({},function(err, count){
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               if (count) {
                    return res.json({resStatus:'success', msg :'User Count', count : count});
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }
          });
     },

     /**--------------------------------------------------------------------------
     Function    : updatedStatus
     Description : use to update vehicle status
     --------------------------------------------------------------------------*/
     admin_status (req, res) {
          console.log(req.body);
          let userId = req.query.userId;
          let updatedStatus = req.query.status;
          UserModel.findOneAndUpdate({_id:userId},{'status':updatedStatus}, {new:true},function(err, resData){
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               if (resData) {
                    return res.json({resStatus:'success', msg :'User has been updated Successfully'});
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }
          });
     },

     /**--------------------------------------------------------------------------
     Function    : updatedStatus
     Description : use to update vehicle status
     --------------------------------------------------------------------------*/
     admin_verifyLicense (req, res) {
          let userId = req.query.userId;
          let updatedStatus = req.query.status;
          UserModel.findOneAndUpdate({_id:userId},{'verification.license':updatedStatus}, {new:true},function(err, resData){
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               if (resData) {
                    return res.json({resStatus:'success', msg :'Driver License has been verified'});
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }
          });
     }
}
