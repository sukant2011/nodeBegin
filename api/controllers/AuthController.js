/*
* Author : Sunny Chauhan
* Module : AuthsController
* Description : Use to register User on application
*/
const AppMessages = require(APP_PATH + '/config/Message.js');
const AppConstants = require(APP_PATH + '/config/Constant.js');
const CommonService = require(APP_PATH + '/api/services/CommonService.js');
const EmailService = require(APP_PATH + '/api/services/EmailService.js');
const JwtService = require(APP_PATH + '/api/services/JwTokenService.js');
const UserModel = require(APP_PATH + '/api/models/UserModel.js');
const UserModelObj = new UserModel();
const ENV_OBJ = require(APP_PATH + '/config/Env.js')();
let fieldsToExclude = {"password" : 0, "isDeleted" : 0, "createdDate" : 0, "modifiedDate" : 0, "otp" : 0};

module.exports = {

     /**--------------------------------------------------------------------------
     Function    : register
     Description : use to register a user
     --------------------------------------------------------------------------*/
     register: function (req, res) {
          req.body.name = req.body.name || {};
          if (req.body.isMobile == 'true') {
               req.body.name = {first : req.body.firstName , last : req.body.lastName};
          }

          if (!req.body.name.first || !req.body.name.last || !req.body.email || !req.body.password) {
               return res.json({resStatus:'error', msg :'Please fill all required fields'});
          }

          CommonService.isEmailExist(req.body.email, UserModel, function (emailStatus) {
               if (emailStatus === false) {
                    let OTP = CommonService.generateOtp(6);
                    let TOKEN = CommonService.generateOtp(6);
                    req.body.otp = OTP;
                    req.body.token = TOKEN;
                    req.body.platform = req.body.platform || 'WEB';
                    req.body.deviceToken = req.body.deviceToken || '';
                    UserModel(req.body).save(function(err,resData){
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         let template = AppConstants.REGISTERATION_TEMPLATE;
                         template = template.replace("{{USERNAME}}", resData.fullname);
                         //template = template.replace("{{OTP}}", OTP);
                         template = template.replace("{{TOKEN}}", resData.token);
                         template = template.replace("{{ID}}", resData._id);
                         let mailOptions = {
                              from: AppConstants.EMAIL,
                              to: [req.body.email],
                              subject: "New Account Registration",
                              html: template
                         }
                         EmailService.send(mailOptions,function(err, response){
                              if(err) {
                                   console.log("Email Not Sent");
                              } else {
                                   console.log("Email Sent Succesfully");
                              }
                         });
                         // UserModel.update({_id : resData._id },{isLogin : true},{upsert : false}, function(err, updateStatus) {
                         //      console.log("User logged into the application");
                         // });
                         //return res.json({resStatus:'success', msg :AppMessages.REGISTER_TOKEN, result : resData._id});
                          return res.json({resStatus:'success', msg :AppMessages.LOGIN,  token: JwtService.issueToken(resData._id,req.body.platform, req.body.deviceToken ),result: resData});
                         /*** code for sending sms OTP **/
                         /**
                         var smsOptions = {
                              user: "rroxysam@gmail.com:myData@28",
                              receipient: mobile,
                              msg : "This is test message",
                              SENDER : AppConstants.TWILIO.SENDER,
                              SID : AppConstants.TWILIO.SID,
                              TOKEN : AppConstants.TWILIO.AUTHTOKEN
                         };
                         SmsService.send (smsOptions, function (err, response) {
                             if(err) {
                                 console.log("Some Error Occured While Sending Twilio Sms");
                             } else {
                                 console.log("Sms has been Sent");
                             }
                        }); */
                         /*** code for sending email OTP   **/
                    });
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.DUPLICATE_ACCOUNT});
               }
          });
     },

     /**--------------------------------------------------------------------------
     | Function    : confirmOtp
     | Description : use to confirm account after register of user
     |--------------------------------------------------------------------------*/
     confirmOtp: function (req, res) {
          let otp = req.body.otp;
          let reqId = req.body._id;
          UserModel.findOneAndUpdate({ "_id" : reqId, "otp" : otp} ,{"status" : true, "otp" : null }, {"projection" : fieldsToExclude, "new":true}).exec(function (err, resData) {
               if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               if(resData == null) {
                    return res.json({resStatus:'error', msg :AppMessages.INVALID_OTP});
               } else {
                    return res.json({resStatus:'success', msg :AppMessages.ACCOUNT_CREATION,  token: JwtService.issueToken(resData._id),result: resData});
               }
          });
     },
     /**--------------------------------------------------------------------------
     | Function    : confirmOtp
     | Description : use to confirm account after register of user
     |--------------------------------------------------------------------------*/
     varifyEmail: function (req, res) {
          let authtoken = req.query.token;
          let reqId = req.query.id;

          UserModel.findOne({ "_id" : reqId}).exec(function (err, resData) {
               if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               if(resData == null) {
                    return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               } else {
                    if (resData.token == '') {
                         return res.json({resStatus:'error', msg : 'You have already verified your account'});
                    } else {
                         UserModel.findOneAndUpdate({ "_id" : reqId, "token" : authtoken} ,{"verification.email" : true, "status" : true, "isLogin" : true, "token" : '' }, {"projection" : fieldsToExclude, "new":true}).exec(function (err, resData) {
                              if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                              if(resData == null) {
                                   return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              } else {
                                   return res.json({resStatus:'success', msg :AppMessages.ACCOUNT_CREATION, token: JwtService.issueToken(resData._id), result: resData});
                              }
                         });
                    }
               }
          });
     },

     /**--------------------------------------------------------------------------
     | Function    : reSendOtp
     | Description : use to resend OTP in case of OTP not received
     |--------------------------------------------------------------------------*/
     reSendOtp: function (req, res) {
          let reqId = req.body._id;
          let OTP = CommonService.generateOtp(6);
          UserModel.findOneAndUpdate({ _id : reqId},{otp : OTP, status:true },function (err, resData) {
               if(err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               if(resData == null) {
                    return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               } else {
                    let template = AppConstants.REGISTERATION_TEMPLATE;
                    template = template.replace("{{USERNAME}}", resData.fullname);
                    template = template.replace("{{OTP}}", OTP);
                    let body = template;
                    mailOptions = {
                         from: AppConstants.EMAIL,
                         to:  [resData.email],
                         subject: "New Otp",
                         html: template
                    }
                    EmailService.send(mailOptions,function(err, response){
                         if(err) {
                              //console.log("Email Not Sent ======",err);
                         } else {
                              //console.log("Email Sent Succesfully ======",response);
                         }
                    });
                    return res.json({resStatus:'success', msg : AppMessages.OTP});
               }
          });
     },

     /**--------------------------------------------------------------------------
     | Function    : register
     | Description : use to recover password in case of forgot password
     |--------------------------------------------------------------------------*/
     forgot: function (req, res) {
          let email = req.body.email;
          if (!email) {
               return res.json({resStatus:'error', msg :'Email is required', fieldEmpty:"email"});
          }
          UserModel.findOne({ email : email},function (err, resData) {
               if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               if(resData == null) {
                    return res.json({resStatus:'error', msg :AppMessages.ACCOUNT_INVALID});
               } else {
                    let OTP = CommonService.generateOtp(6);
                    let template = AppConstants.REGISTERATION_TEMPLATE;
                    template = template.replace("{{USERNAME}}", resData.fullname);
                    template = template.replace("{{OTP}}", OTP);
                    let mailOptions = {
                         from: AppConstants.EMAIL,
                         to: [email],
                         subject: "New Account Registration",
                         html: template
                    }
                    UserModel.findOneAndUpdate({email : email},{otp : OTP}, {new : true},function(err, resData){
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         if(resData != null) {
                              EmailService.send(mailOptions,function(err, response){
                                   if(err) {
                                        // Error Code Goes Here
                                   } else {
                                        // Code Goes here
                                   }
                              });
                              return res.json({resStatus : 'success', msg : AppMessages.OTP, _id : resData._id});
                         } else {
                              return res.json({resStatus : 'error', msg : AppMessages.SERVER_ERR});
                         }
                    });
               }
          });
     },

     /**--------------------------------------------------------------------------
     | Function    : confirmOtpForgot
     | Description : use to confirm account in case of forgot password
     |--------------------------------------------------------------------------*/
     confirmOtpForgot: function (req, res) {
          let otp = req.body.otp;
          let reqId = req.body._id;
          UserModel.findOneAndUpdate({ _id:reqId, otp: otp} ,{status:true, otp:null }, {new:true}).exec(function (err, resData) {
               if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               if(resData == null) {
                    return res.json({resStatus:'error', msg :AppMessages.INVALID_OTP});
               } else {
                    return res.json({resStatus:'success', msg :AppMessages.ACCOUNT_RECOVER, _id:resData._id});
               }
          });
     },

     /**--------------------------------------------------------------------------
     | Function    : login
     | Description : use to login user
     |--------------------------------------------------------------------------*/
     login: function (req, res) {
          var email = req.body.email;

          var password = req.body.password;

          if (!password) {
               return res.json({resStatus:'error', msg :'Password is required'});
          }

          if (!email) {
               return res.json({resStatus:'error', msg :'Email is Required'});
          }

          req.body.platform = req.body.platform || 'WEB';
          req.body.deviceToken = req.body.deviceToken || '';

          UserModel.findOne({isDeleted:false, email:email,'role' : 'USER'},{},function(err, user) {
               if (!user) {
                    return res.json({resStatus:'error', msg :'Invalid Email or Password', fieldEmpty:"email_pass"});
               }
               UserModelObj.comparePassword(password, user,  function(err, valid) {
                    if (err) {
                         return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    }

                    if (!valid) {
                         return res.json( {resStatus:'error', msg :'Invalid Email or Password', fieldEmpty:"password"});
                    } else {
                         // UserModel.update({_id : user._id },{isLogin : true},{upsert : false}, function(err, updateStatus) {
                         //      console.log("User logged into the application");
                         // });
                         return res.json({resStatus:'success', msg :AppMessages.LOGIN,  token: JwtService.issueToken(user._id, req.body.platform, req.body.deviceToken),result: user});
                    }
               });
          })
     },

     /**--------------------------------------------------------------------------
     | Function    : login
     | Description : use to login user
     |--------------------------------------------------------------------------*/
     logOut: function (req, res) {
          UserModel.update({_id : req.query.uId },{isOnline : 'N', 'fcm.platform' :  '', 'fcm.deviceToken' : ''},{upsert : false}, function(err, updateStatus) {
               if (err) return res.json({resStatus:'error',msg:AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg : "User has been logged Out successfully"});
          });
     },

     /**--------------------------------------------------------------------------
     | Function    : resetPassword
     | Description : use to reset password
     |--------------------------------------------------------------------------*/
     resetPassword: function (req, res) {
          let reqId = req.body._id;
          let password = req.body.password;
          let con_Password = req.body.con_password;

          if (!password) {
               return res.json({resStatus:'error', msg :'Password is required'});
          }

          if (!con_Password ||  (password != con_Password)) {
               return res.json({resStatus:'error', msg :'Passwords do not match'});
          }

          UserModel.findOne({ _id:reqId }).exec(function(err,userData){
               if (err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               if(userData != null) {
                    userData.password = req.body.password;
                    userData.save(function(err, data) {
                         if (err) return res.json({resStatus:'error',msg:AppMessages.SERVER_ERR});
                         return res.json({resStatus:'success', msg : AppMessages.PASSWORD_UPDATE});
                    });
               }
          });
     },

     /**--------------------------------------------------------------------------
     | Function    : checkUniqueEmail
     | Description : use to check unique email
     |--------------------------------------------------------------------------*/
     checkUniqueEmail: function (req, res) {
          let reqEmail = req.query.reqEmail;
          modelObj.findOne({ email : reqEmail }, function (err, resData) {
               if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               if(resData != null) {
                    return res.json({resStatus:'error', msg : AppMessages.DUPLICATE_EMAIL});
               }else {
                    return res.json({resStatus:'success', msg :AppMessages.EMAIL_AVAILAIBLE});
               }

          });
     },

     /*--------------------------------------------------------------------------
     | Function    : checkUniqueEmail
     | Description : use to check unique mobile
     |--------------------------------------------------------------------------*/
     checkUniqueMobile: function (req, res) {
          let reqMobile = req.query.reqMobile;
          modelObj.findOne({ mobile : reqMobile }, function (err, resData) {
               if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
               if(resData != null) {
                    return res.json({resStatus:'error', msg :AppMessages.DUPLICATE_MOBILE});
               }else {
                    return res.json({resStatus:'success', msg :AppMessages.MOBILE_AVAILABLE});
               }

          });
     },

     /*** ***********************************************Admin API's ****************************************
     **********************************************************************************************************/

     /**--------------------------------------------------------------------------
     | Function    : login
     | Description : use to login user
     |--------------------------------------------------------------------------*/
     admin_login: function (req, res) {
          var email = req.body.email;

          var password = req.body.password;

          if (!password) {
               return res.json({resStatus:'error', msg :'Password is required'});
          }

          if (!email) {
               return res.json({resStatus:'error', msg :'Email is Required'});
          }

          UserModel.findOne({role : 'ADMIN', status:true, otp:'', isDeleted:false,email:email},{},function(err, user) {
               if (!user) {
                    return res.json({resStatus:'error', msg :'Invalid Email', fieldEmpty:"email_pass"});
               }
               UserModelObj.comparePassword(password, user,  function(err, valid) {
                    if (err) {
                         return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    }

                    if (!valid) {
                         return res.json( {resStatus:'error', msg :'Password is incorrect', fieldEmpty:"password"});
                    } else {
                         return res.json({resStatus:'success', msg :AppMessages.LOGIN,  token: JwtService.issueToken(user._id),result: user});
                    }
               });
          })
     },

}
