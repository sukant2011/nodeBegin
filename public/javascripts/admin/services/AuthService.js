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
angular.module('corsaAdminApp').factory('$AuthService', function($http, $LocalService, AccessLevels, $localStorage) {
     return {
          authorize: function(access) {
               if (access === AccessLevels.user) {
                    return this.isAuthenticated();
               } else {
                    return true;
               }
          },
          isAuthenticated: function() {
               if($LocalService.get('admin_user')) {
                    return ($LocalService.get('admin_user'));
               }
          },
          login: function(credentials, cb) {
               var serviceInstance = $http.post('/auth/admin/login', credentials);
               serviceInstance.success(function(response) {
                    if(response.resStatus == "success") {
                         if(response.result.role == "ADMIN") {
                              $LocalService.set('admin_user', JSON.stringify(response));
                         }
                    }
                    cb(response);
               });
          },

          logout: function( cb) {
               $LocalService.unset('admin_user');
               cb(true);
          }
     }
})
