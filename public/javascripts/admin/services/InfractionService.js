/*
|--------------------------------------------------------------------------
| Name                   : CarBrandService
| Built in Dependencies  : $http
| Custom Dependencies    :  $localStorage, LocalService, AccessLevels
| Description            : use to  view  Reports
| Author                 : vishesh Tanwar
| Created                : 9 sept 2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
angular.module('corsaAdminApp').factory('InfractionService', function($q,$http, $LocalService, AccessLevels, $localStorage,$SessionService) {
     return {
          
          list : function(cb) {
               var userInfo = $http.get('/infraction/admin/list');
               userInfo.success(function(response) {
                    cb(response);
               });
          }

          // view : function(Id, cb) {
          //      var userInfo = $http.get('/vehicles/admin/viewVariant?reqId='+Id);
          //      userInfo.success(function(response) {
          //           cb(response);
          //      });
          // },
          //

     }
});
