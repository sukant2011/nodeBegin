/*
|--------------------------------------------------------------------------
| Name                   : emailService
| Built in Dependencies  : $http
| Custom Dependencies    :  $localStorage, LocalService, AccessLevels
| Description            : use to view and edit emails
| Author                 : vishesh Tanwar
| Created                : 20 Aug 2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
angular.module('corsaAdminApp').factory('EmailService', function($q,$http, $LocalService, AccessLevels, $localStorage,$SessionService) {
     return {
          add : function (dataObj, cb) {
               var obj = $http.post('/templates/admin/add', dataObj);
               obj.then(function(response) {
                    cb(response.data);
               });
          },

          list : function(cb) {
               var userInfo = $http.get('/templates/admin/list');
               userInfo.success(function(response) {
                    cb(response);
               });
          },

          view : function(tempId, cb) {
               var userInfo = $http.get('/templates/admin/view?reqId='+tempId);
               userInfo.success(function(response) {
                    cb(response);
               });
          },

          remove: function(tempId,cb){
               var userInfo =$http.post('/templates/admin/remove?reqId='+tempId);
               userInfo.success(function(response) {
                    cb(response);
               });

          },

          update: function(dataObj,cb){
               var userInfo =$http.post('/templates/admin/update', dataObj);
               userInfo.success(function(response) {
                    cb(response);
               });

          }
     }
});
