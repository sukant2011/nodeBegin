/*
|--------------------------------------------------------------------------
| Name                   : AuthService
| Built in Dependencies  : $http
| Custom Dependencies    :  $localStorage, LocalService, AccessLevels
| Description            : use to authenticate seeker & register
| Author                 : Sunny Chauhan
| Created                : 18jan2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
module.exports = function($http, $LocalService, AccessLevels, $localStorage) {
     return {
          authorize: function(access) {
               if (access === AccessLevels.user) {
                    return this.isAuthenticated();
               } else {
                    return true;
               }
          },
          isAuthenticated: function() {
               if($LocalService.get('auth_user')) {
                    return ($LocalService.get('auth_user'));
               }
          },
          unLink : function(userId, type, cb) {
               var serviceInstance = $http.get('/auth/unlink/'+userId + '/' + type);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },
          login: function(credentials, cb) {
               var serviceInstance = $http.post('/auth/login', credentials);
               serviceInstance.success(function(response) {
                    if(response.resStatus == "success") {
                         if(response.result.role == "USER") {
                              $LocalService.set('auth_user', JSON.stringify(response));
                         }
                    }
                    cb(response);
               });
               //console.log("response = ",login);
               //return login;
          },

          logout: function(userId, cb) {
               var serviceInstance = $http.get('/auth/logOut?uId='+userId);
               serviceInstance.success(function(response) {
                    if(response.resStatus == "success") {
                         $LocalService.unset('auth_user');
                    }
                    cb(true);
               });
          },
          register: function(formData, cb) {
               $LocalService.unset('auth_user');
               var serviceInstance = $http.post('/auth/register', formData);
               serviceInstance.success(function(response) {
                    if(response.resStatus == "success") {
                         if(response.result.role == "USER") {
                              $LocalService.set('auth_user', JSON.stringify(response));
                         }
                    }
                    cb(response);
               });
               // serviceInstance.success(function(response) {
               //      cb(response);
               // });
          },

          confirmEmail: function(token,reqId,cb) {
               var email = $http.get('/auth/varifyEmail?token='+token + '&id='+reqId);
               email.success(function(response) {
                    cb(response);
               });
          },

          confirmOtp: function(formData, cb) {
               var serviceInstance = $http.post('/auth/confirmAccount',formData);
               serviceInstance.success(function(response) {
                    if(response.resStatus == "success") {
                         if(response.result.role == "USER") {
                              $LocalService.set('auth_user', JSON.stringify(response));
                         }
                    }
                    cb(response);
               });
          },
          confirmOtpForgot: function(formData, cb) {
               var serviceInstance = $http.post('/auth/confirmAccountForgot',formData);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },
          reSendOtp: function(formData, cb) {
               var serviceInstance = $http.post('/auth/reSendOtp', formData);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },
          forgot: function(formData, cb) {
               var serviceInstance = $http.post('/auth/forgot-password', formData);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },
          verifyByEmail: function(activationToken,email, cb) {
               var serviceInstance = $http.get('/auth/verifyByEMail?token='+activationToken+'&email='+email);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },
          verifyByReset: function(activationToken,email, cb) {
               var serviceInstance = $http.get('/auth/verifyByReset?token='+activationToken+'&email='+email);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },

          resetPassword: function(postData, cb) {
               var serviceInstance = $http.post('/auth/resetPassword', postData);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },
          checkUniqueEmail : function (reqEmail, cb) {
               var serviceInstance = $http.get('/auth/checkUniqueEmail/?reqEmail='+reqEmail);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },
          checkUniqueMobile : function (reqMobile, cb) {
               var serviceInstance = $http.get('/auth/checkUniqueMobile/?reqMobile='+reqMobile);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },

          viewSeeker: function(reqId, cb) {
               var serviceInstance = $http.get('/auth/Api/seeker_profile/?reqId='+reqId);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },

          viewUser: function(reqId, cb) {
               var serviceInstance = $http.get('/auth/Api/user_profile/?reqId='+reqId);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },

          getNotificationCount: function(reqId, cb) {
               var serviceInstance = $http.get('/auth/Api/getNotificationCount/?reqId='+reqId);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          }


     }
}
