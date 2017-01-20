/*
|--------------------------------------------------------------------------
| Name                   : SettingService
| Built in Dependencies  : $http
| Custom Dependencies    :
| Description            : use to add uurls
| Author                 : vishesh Tanwar
| Created                : 16 sept 2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
angular.module('corsaAdminApp').factory('settingService', function($q,$http, $LocalService, AccessLevels, $localStorage,$SessionService) {
     return {
          add : function (Obj, cb) {
               console.log(Obj);
               var obj = $http.post('/config/admin/add', Obj);
               obj.then(function(response) {
                    cb(response.data);
               });
          },

          list : function(cb) {
               var userInfo = $http.get('/config/admin/list');
               userInfo.success(function(response) {
                    cb(response);
               });
          },

          update: function(dataObj,cb){
               var userInfo =$http.post('/config/admin/update', dataObj);
               userInfo.success(function(response) {
                    cb(response);
               });

          }

      }
});
