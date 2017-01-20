/*
|--------------------------------------------------------------------------
| Name                   : CountService
| Built in Dependencies  : $http
| Custom Dependencies    :  $localStorage, LocalService, AccessLevels
| Description            : use to count   user & vehicles
| Author                 : vishesh Tanwar
| Created                : 1 sept 2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
angular.module('corsaAdminApp').factory('CountService', function($q,$http, $LocalService, AccessLevels, $localStorage,$SessionService) {
     return {
          user : function (cb) {
               var obj = $http.get('account/admin/count');
               obj.then(function(response) {

                    cb(response);
               });
          },

          vehicle : function(cb) {
               var obj = $http.get('/vehicles/admin/count');
               obj.success(function(response) {
                    
                    cb(response);
               });
          }

          // complaint : function(tempId, cb) {
          //      var userInfo = $http.get('/templates/admin/=');
          //      userInfo.success(function(response) {
          //           cb(response);
          //      });
          // }


     }
});
