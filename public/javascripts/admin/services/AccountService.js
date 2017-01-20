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
angular.module('corsaAdminApp').factory('$AccountService', function($q,$http, $LocalService, AccessLevels, $localStorage,$SessionService) {
     return {
          list : function(cb) {
               var userInfo = $http.get('/account/admin/list');
               userInfo.success(function(response) {
                    cb(response);
               });

          },
          view : function(userId, cb) {
               var userInfo = $http.get('/account/admin/view?reqId='+userId);
               userInfo.success(function(response) {
                    cb(response);
               });

          },
          remove: function(userId,cb){
               var userInfo =$http.post('/account/admin/remove?reqId='+userId);
               userInfo.success(function(response) {
                    cb(response);
               });

          },
          account: function(userId,userObj,cb){
               //console.log(userObj); return;
               var uploadImgUrl = "/account/admin/update?reqId="+ userId;
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
                    cb(response);
                    deferred.reject(error);
               });
               return deferred.promise;
          },

          changePassword: function(userId,password,new_password,con_password,cb){
               var userPass = $http.post('account/admin/updatePassword?reqId='+userId,
               {'password':password,'new_password':new_password,'con_password':con_password});
               userPass.success(function(response) {
                    cb(response);
               });
          },
          status:function(userId,status,cb){
               //console.log(userId);
               var statusCar=$http.get('account/admin/status?userId='+userId +'&status=' +status);
               statusCar.success(function(response) {
                    cb(response);
               });
          },
          licenseStatus:function(userId,status,cb){
               //console.log(userId);
               var statuslicense=$http.get('account/admin/verifyDL?userId='+userId +'&status=' +status);
               statuslicense.success(function(response) {
                    cb(response);
               });
          },
          newsletter : function(cb){
               var news = $http.get('newsletter/admin/list');
               news.success(function(response) {
                    cb(response);
               });
          }

     }
});
