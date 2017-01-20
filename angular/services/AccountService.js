/*
|--------------------------------------------------------------------------
| Name                   : AccoutService
| Built in Dependencies  : $http
| Custom Dependencies    :  $localStorage, LocalService, AccessLevels
| Description            : use to view and edit profile
| Author                 : Mangal Singh
| Created                : 8 Aug 2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
module.exports =  function($q,$http, $LocalService, AccessLevels, $localStorage,$SessionService) {
     return {
          listMessage : function (userId, fromId, callback) {
               $http.get('/chat/listMessage/'+userId+"/"+fromId).then(function (data) {
                    callback(data);
               });
          },
          registerChat : function (obj, callback) {
               $http.post('/chat/register', obj).then(function (data) {
                    callback(data);
               });
          },
          view : function(userId, cb) {
               var userInfo = $http.get('/account/view?reqId='+userId);
               userInfo.success(function(response) {
                    cb(response);
               });

          },
          account: function(userId,userObj,cb){
               //console.log(userObj); return;
               var uploadImgUrl = "account/update";
               var deferred = $q.defer();
               var formData = new FormData();
               formData.append('file',userObj.file);
               formData.append('_id',userObj._id);
               formData.append('first',userObj.name.first);
               formData.append('last',userObj.name.last);
               formData.append('email',userObj.email);
               formData.append('description',userObj.profile.description);
               if (userObj.profile && userObj.profile.photo) {
                    formData.append('photoOriginal',userObj.profile.photoOriginal);
                    formData.append('photo',userObj.profile.photo);
                    formData.append('path',userObj.profile.path);
               }
               $http.post(uploadImgUrl,formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
               }) .success(function(response){
                    cb(response);
                    deferred.resolve(response);
               })
               .error(function(error){
                    deferred.reject(error);
               });
               return deferred.promise;
          },
          uploadLicense: function(userId,userObj,cb){
               var deferred = $q.defer();
               var uploadImgUrl = "account/uploadLicense";
               var formData = new FormData();
               formData.append('file',userObj.file);
               formData.append('userId',userId);
               formData.append('first',userObj.license.name.first);
               formData.append('last',userObj.license.name.last);
               formData.append('middle',userObj.license.name.middle);
               formData.append('country',userObj.license.issuer.country);
               formData.append('state',userObj.license.issuer.state);
               formData.append('number',userObj.license.number);
               formData.append('dob',userObj.license.dob);
               $http.post(uploadImgUrl,formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
               }) .success(function(response){
                    cb(response);
                    deferred.resolve(response);
               })
               .error(function(error){
                    cb(response);
                    deferred.reject(error);
               });
               return deferred.promise;
          },

          changePassword: function(userId,password,new_password,con_password,cb){

               var userPass = $http.post('account/updatePassword',
               {'reqId' : userId, 'password':password,'new_password':new_password,'con_password':con_password});
               userPass.success(function(response) {
                    cb(response);
               });
          },

          sendVerificationCode : function (dataObj, cb) {
               var userPass = $http.post('account/sendVerificationCode', dataObj);
               userPass.success(function(response) {
                    cb(response);
               });
          },

          confirmOtp : function (dataObj, cb) {
               var userPass = $http.post('account/confirmOtp', dataObj);
               userPass.success(function(response) {
                    cb(response);
               });
          },
          newsletter : function (email, cb) {
               var newslt = $http.post('newsletter/subscribe', {email : email});
               newslt.success(function(response) {
                    cb(response);
               });
          },

          getCountry : function (cb) {
               var obj = $http.get('/vehicles/listCountry');
               obj.then(function(response) {
                    cb(response.data);
               });
          },
          getStates : function (country, cb) {
               var obj = $http.get('/vehicles/listStates?country='+country);
               obj.then(function(response) {
                    cb(response.data);
               });
          },
          listUserMessage : function (userId, fromId, callback) {
               var obj = $http.get('/chat/listMessage?toId='+userId+'&fromId='+fromId);
                     obj.then(function (response){
                    callback(response.data);
               });
          },
          listUsers : function (userId, callback) {
               var obj = $http.get('/chat/listUsers?fromId='+userId);
               obj.then(function (response){
                    callback(response.data);
               });
          },

     }



}
