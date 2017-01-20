/*
* Author : Sunny Chauhan
* Module : AuthsController
* Description : Use to login the user with social media
*/
const AppMessages = require(APP_PATH + '/config/Message.js');
const AppConstants = require(APP_PATH + '/config/Constant.js');
const ENV_OBJ = require(APP_PATH + '/config/Env.js')();
const CommonService = require(APP_PATH + '/api/services/CommonService.js');
const JwtService = require(APP_PATH + '/api/services/JwTokenService.js');
const EmailService = require(APP_PATH + '/api/services/EmailService.js');
const UserModel = require(APP_PATH + '/api/models/UserModel.js');
const UserModelObj = new UserModel();

let download = function(uri, filename, callback){
     let fs = require('fs'),
     http = require('https');
     uploadDir = 'public' + AppConstants.PORTRAIT_PATH,
     request = require('request');
     request(uri, {encoding: 'binary'}, function(error, response, body) {
          fs.writeFile(uploadDir + '/' + filename, body, 'binary', function (err) {
               callback(null, true);
          });
     });
};


class SocialController  {

     /**--------------------------------------------------------------------------
     Function    : google
     Description : use to signup the user with google
     --------------------------------------------------------------------------*/
     google (req, res) {
          //console.log("Heeeeeeeeeeeeee"); return;
          let request = require('request');
          var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
          let peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
          let params = {
               code: req.body.code,
               client_id: req.body.clientId,
               client_secret: ENV_OBJ.GOOGLE.CLIENT_SECRET,
               redirect_uri: ENV_OBJ.GOOGLE.REDIRECT_URI,
               grant_type: 'authorization_code'
          };
          req.body.platform = req.body.platform || 'WEB';
          req.body.deviceToken = req.body.deviceToken || '';

          let userId = (req.body.userData) ? req.body.userData : "";
          //console.log(params); return;
          // Step 1. Exchange authorization code for access token.
          request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
               let accessToken = token.access_token;
               let headers = { Authorization: 'Bearer ' + accessToken };

               // Step 2. Retrieve profile information about the current user.
               request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {

                    if (profile.error) {
                         return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    }

                    //CommonService.isEmailExist(profile.email, UserModel, function (emailStatus) {
                    CommonService.isGoogleIdExist(profile.sub, UserModel, function (emailStatus) {
                         if (emailStatus == false) {
                              if (userId) {
                                   UserModel.findOneAndUpdate({_id : userId },{googleId : profile.sub},{upsert : false, new : true}, function(err, updateData) {
                                        if(err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                        return res.json({resStatus:'success', msg : "Google Account has been successfully linked", result : updateData});
                                   });
                              } else {
                                   CommonService.isEmailExist(profile.email, UserModel, function (emailExist) {

                                        if (emailExist == false) {
                                             let newUser = {};
                                             newUser.googleId = profile.sub;

                                             /** code for writing image to folder */
                                             profile.picture = profile.picture.replace('?sz=50', '?sz=200');
                                             let picture = profile.picture;
                                             picture = picture.replace('?sz=50', '');
                                             picture = picture.replace('?sz=200', '');
                                             let ext =  picture.split('.').pop();
                                             let newFileName = CommonService.generateRandom(8)+(new Date()).getTime() + CommonService.generateRandom(6) + '.' + ext;
                                             newUser.picture = newFileName;
                                             newUser.profile = {path : AppConstants.PORTRAIT_PATH, photo : newFileName,  photoOriginal : profile.picture};
                                             download(picture, newFileName, function(err, res){
                                                  if(res) console.log('Image write to the system successfully');
                                             });
                                             /** code for writing image to folder */
                                             newUser.name = { first : profile.given_name, last : profile.family_name};
                                             newUser.email = profile.email;
                                             newUser.status = true;
                                             newUser.password = CommonService.generateOtp(10);
                                             let template = AppConstants.SOCIAL_REGISTRATION_TEMPLATE;
                                             template = template.replace("{{PASSWORD}}", newUser.password);
                                             template = template.replace("{{USERNAME}}", profile.name);
                                             UserModel(newUser).save(function(err, resData) {
                                                  if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                                  let mailOptions = {
                                                       from: AppConstants.EMAIL,
                                                       to: resData.email,
                                                       subject: "Acount Password",
                                                       html: template
                                                  }
                                                  EmailService.send(mailOptions,function(err, response){
                                                       if(err) {
                                                            console.log("Email Not Sent");
                                                       } else {
                                                            console.log("Email Sent Succesfully");
                                                       }
                                                  });
                                                  return res.json({resStatus:'success', msg :AppMessages.LOGIN,  token: JwtService.issueToken(resData._id, req.body.platform, req.body.deviceToken),result: resData});
                                             });
                                        } else {
                                             UserModel.findOneAndUpdate({email : profile.email },{googleId : profile.sub},{upsert : false, new : true}, function(err, updateData) {
                                                  if(err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                                  return res.json({resStatus:'success', msg : "You have successfully logged in", result : updateData});
                                             });
                                        }

                                   });
                              }
                         } else if (emailStatus == true) {
                              // Step 3a. Link user accounts.
                              if (userId) {
                                   UserModel.findOneAndUpdate({_id : userId },{googleId : profile.sub},{upsert : false, new : true}, function(err, updateData) {
                                        if(err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                        return res.json({resStatus:'success', msg : "Google Account has been successfully linked", result : updateData});
                                   });
                              } else {
                                   UserModel.findOne({googleId : profile.sub }, function(err, existingUser) {
                                        if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                        if (existingUser) {
                                             // UserModel.update({_id : existingUser._id },{isLogin : true},{upsert : false}, function(err, updateStatus) {
                                             //      console.log("User logged into the application");
                                             // });
                                             return res.json({resStatus:'success', msg :AppMessages.LOGIN,  token: JwtService.issueToken(existingUser._id, req.body.platform, req.body.deviceToken),result: existingUser});
                                        } else {
                                             return res.json({resStatus:'error', msg : AppMessages.DUPLICATE_ACCOUNT});
                                        }
                                   });
                              }
                         } else {
                              return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         }
                    });
               });
          });
     }

     /**--------------------------------------------------------------------------
     Function    : facebook
     Description : use to signup the user with facebook
     --------------------------------------------------------------------------*/

     facebook (req, res){
          let request = require('request');
          let fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
          let accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
          let graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
          let CLIENT_SECRET = ENV_OBJ.FACEBOOK.CLIENT_SECRET;
          let params = {
               code: req.body.code,
               client_id: req.body.clientId,
               client_secret: ENV_OBJ.FACEBOOK.CLIENT_SECRET,
               redirect_uri: req.body.redirectUri
          };
          let userId = (req.body.userData) ? req.body.userData : "";
          req.body.platform = req.body.platform || 'WEB';
          req.body.deviceToken = req.body.deviceToken || '';

          // Step 1. Exchange authorization code for access token.
          request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
               if (response.statusCode !== 200) {
                    //return res.status(500).send({ message: accessToken.error.message });
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }

               // Step 2. Retrieve profile information about the current user.
               request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
                    if (response.statusCode !== 200) {
                         //return res.status(500).send({ message: profile.error.message });
                         return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    }

                    CommonService.isFacebookIdExist(profile.sub, UserModel, function (emailStatus) {

                         if (emailStatus == false) {
                              if (userId) {
                                   UserModel.findOneAndUpdate({_id : userId },{facebookId : profile.id},{upsert : false, new : true}, function(err, updateData) {
                                        if(err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                        return res.json({resStatus:'success', msg : "Google Account has been successfully linked", result : updateData});
                                   });
                              } else {

                                   CommonService.isEmailExist(profile.email, UserModel, function (emailExist) {

                                        if (emailExist == false) {
                                             let newUser = {};
                                             newUser.facebookId = profile.id;
                                             newUser.name = { first : profile.first_name, last : profile.last_name};
                                             newUser.profile = { photo : 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large'};
                                             newUser.email = profile.email;
                                             newUser.status = true;
                                             newUser.password = CommonService.generateOtp(10);
                                             let template = AppConstants.SOCIAL_REGISTRATION_TEMPLATE;
                                             template = template.replace("{{PASSWORD}}", newUser.password);
                                             template = template.replace("{{USERNAME}}", profile.name);
                                             UserModel(newUser).save(function(err, resData) {
                                                  if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                                  let mailOptions = {
                                                       from: AppConstants.EMAIL,
                                                       to: resData.email,
                                                       subject: "Acount Password",
                                                       html: template
                                                  }
                                                  // UserModel.update({_id : resData._id },{isLogin : true},{upsert : false}, function(err, updateStatus) {
                                                  //      console.log("User logged into the application");
                                                  // });
                                                  EmailService.send(mailOptions,function(err, response){
                                                       if(err) {
                                                            console.log("Email Not Sent");
                                                       } else {
                                                            console.log("Email Sent Succesfully");
                                                       }
                                                  });
                                                  return res.json({resStatus:'success', msg :AppMessages.LOGIN,  token: JwtService.issueToken(resData._id, req.body.platform, req.body.deviceToken),result: resData});
                                             });
                                        }else {
                                             UserModel.findOneAndUpdate({email : profile.email },{facebookId : profile.id},{upsert : false, new : true}, function(err, updateData) {
                                                  if(err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                                  return res.json({resStatus:'success', msg : "You have successfully logged in", result : updateData});
                                             });
                                        }
                                   });
                              }
                              }else if (emailStatus == true) {
                                   if(userId) {
                                        UserModel.findOneAndUpdate({_id : userId },{facebookId : profile.id},{upsert : false, new : true}, function(err, updateData) {
                                             if(err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                             return res.json({resStatus:'success', msg : "Google Account has been successfully linked", result : updateData});
                                        });
                                   } else {
                                        // Step 3a. Link user accounts.
                                        UserModel.findOne({facebookId : profile.id }, function(err, existingUser) {
                                             if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                             if (existingUser) {
                                                  // UserModel.update({_id : resData._id },{isLogin : true},{upsert : false}, function(err, updateStatus) {
                                                  //      console.log("User logged into the application");
                                                  // });
                                                  return res.json({resStatus:'success', msg :AppMessages.LOGIN,  token: JwtService.issueToken(existingUser._id, req.body.platform, req.body.deviceToken),result: existingUser});
                                             } else {
                                                  return res.json({resStatus:'error', msg : AppMessages.DUPLICATE_ACCOUNT});
                                             }
                                        });
                                   }

                              } else {
                                   return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              }
                         });
                    });
               });
          }

          /**--------------------------------------------------------------------------
          Function    : google
          Description : use to signup the user with google
          --------------------------------------------------------------------------*/
          googleMobileLogin (req, res) {
               req.body.platform = req.body.platform || 'WEB';
               req.body.deviceToken = req.body.deviceToken || '';
               var reqData = req.body;
               if(reqData.email) {
                    CommonService.isEmailExist(reqData.email, UserModel, function (emailStatus) {
                         if (emailStatus === false) {
                              let newUser = {};
                              newUser.googleId = reqData.googleId;
                              newUser.name = { first : reqData.firstName, last : reqData.lastName};

                              /** code for writing image to folder */
                              let uploadDir = 'public' + AppConstants.PORTRAIT_PATH;
                              let picture = reqData.picture;
                              picture = picture.replace('?sz=50', '');
                              picture = picture.replace('?sz=200', '');
                              let ext =  picture.split('.').pop();
                              let newFileName = CommonService.generateRandom(8)+(new Date()).getTime() + CommonService.generateRandom(6) + '.' + ext;
                              let fileLOcalPath = uploadDir + '/' + newFileName;
                              newUser.picture = newFileName;
                              newUser.profile = {path : AppConstants.PORTRAIT_PATH, photo : newFileName,  photoOriginal : picture};
                              download(picture, newFileName, function(){
                                   console.log('done');
                              });
                              /** code for writing image to folder */

                              newUser.email = reqData.email;
                              newUser.status = true;
                              newUser.password = CommonService.generateOtp(10);
                              let template = AppConstants.SOCIAL_REGISTRATION_TEMPLATE;
                              template = template.replace("{{PASSWORD}}", newUser.password);
                              template = template.replace("{{USERNAME}}", newUser.name);
                              UserModel(newUser).save(function(err, resData) {
                                   if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                   let mailOptions = {
                                        from: AppConstants.EMAIL,
                                        to: resData.email,
                                        subject: "Acount Password",
                                        html: template
                                   }
                                   EmailService.send(mailOptions,function(err, response){
                                        if(err) {
                                             console.log("Email Not Sent");
                                        } else {
                                             console.log("Email Sent Succesfully");
                                        }
                                   });
                                   return res.json({resStatus:'success', msg :AppMessages.LOGIN,  token: JwtService.issueToken(resData._id, req.body.platform, req.body.deviceToken),result: resData});
                              });
                         } else if (emailStatus == true) {
                              // Step 3a. Link user accounts.
                              UserModel.findOne({ email : reqData.email, googleId : reqData.googleId }, {password : 0},function(err, existingUser) {
                                   if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                   if (existingUser) {
                                        return res.json({resStatus:'success', msg :AppMessages.LOGIN,  token: JwtService.issueToken(existingUser._id, req.body.platform, req.body.deviceToken),result: existingUser});
                                   } else {
                                        return res.json({resStatus:'error', msg : AppMessages.DUPLICATE_ACCOUNT});
                                   }
                              });
                         } else {
                              return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         }
                    });
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }
          }

          /**--------------------------------------------------------------------------
          Function    : google
          Description : use to signup the user with google
          --------------------------------------------------------------------------*/
          facebookMobileLogin (req, res) {
               req.body.platform = req.body.platform || 'WEB';
               req.body.deviceToken = req.body.deviceToken || '';
               var reqData = req.body;
               if(reqData.email) {
                    CommonService.isEmailExist(reqData.email, UserModel, function (emailStatus) {
                         if (emailStatus === false) {
                              let newUser = {};
                              newUser.facebookId = reqData.facebookId;
                              if (!reqData.facebookId) {
                                   return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              }
                              newUser.picture = reqData.picture;
                              newUser.name = { first : reqData.firstName, last : reqData.lastName};
                              newUser.profile = { photo : reqData.picture};
                              newUser.email = reqData.email;
                              newUser.status = true;
                              newUser.password = CommonService.generateOtp(10);
                              let template = AppConstants.SOCIAL_REGISTRATION_TEMPLATE;
                              template = template.replace("{{PASSWORD}}", newUser.password);
                              template = template.replace("{{USERNAME}}", newUser.name);
                              UserModel(newUser).save(function(err, resData) {
                                   if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                   let mailOptions = {
                                        from: AppConstants.EMAIL,
                                        to: resData.email,
                                        subject: "Acount Password",
                                        html: template
                                   }
                                   EmailService.send(mailOptions,function(err, response){
                                        if(err) {
                                             console.log("Email Not Sent");
                                        } else {
                                             console.log("Email Sent Succesfully");
                                        }
                                   });
                                   return res.json({resStatus:'success', msg :AppMessages.LOGIN,  token: JwtService.issueToken(resData._id, req.body.platform, req.body.deviceToken ),result: resData});
                              });
                         } else if (emailStatus == true) {
                              // Step 3a. Link user accounts.
                              UserModel.findOne({ email : reqData.email, facebookId : reqData.facebookId },{password : 0}, function(err, existingUser) {
                                   if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                   if (existingUser) {
                                        return res.json({resStatus:'success', msg :AppMessages.LOGIN,  token: JwtService.issueToken(existingUser._id, req.body.platform, req.body.deviceToken),result: existingUser});
                                   } else {
                                        return res.json({resStatus:'error', msg : AppMessages.DUPLICATE_ACCOUNT});
                                   }
                              });
                         } else {
                              return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         }
                    });
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }
          }

          unlinkSocialAccount (req, res) {
               let userId = req.params.userId;
               let updateCondn;
               let msg;
               if(req.params.type == "google") {
                    updateCondn = {
                         googleId : ""
                    };
                    msg = "Google Account has beem successfully unlinked";
               } else if (req.params.type == "facebook") {
                    updateCondn = {
                         facebookId : ""
                    };
                    msg = "Facebook Account has beem successfully unlinked";
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }
               UserModel.findOneAndUpdate({_id : userId },updateCondn,{upsert : false, new : true}, function(err, updateData) {
                    if(err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    return res.json({resStatus:'success', msg : msg, result : updateData});
               });
          }

          linkSocialAccount (req, res) {
               let userId = req.body.userId;
               let updateCondn;
               let msg;
               if(req.body.type == "google") {
                    updateCondn = {
                         googleId : req.body.socialId
                    };
                    msg = "Google Account has beem successfully linked";
               } else if (req.body.type == "facebook") {
                    updateCondn = {
                         facebookId : req.body.socialId
                    };
                    msg = "Facebook Account has beem successfully linked";
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }
               UserModel.findOneAndUpdate({_id : userId },updateCondn,{upsert : false}, function(err, updateData) {
                    if(err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    return res.json({resStatus:'success', msg : msg});
               });
          }

     }

     module.exports = new SocialController();
