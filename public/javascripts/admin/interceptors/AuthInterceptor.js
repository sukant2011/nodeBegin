/*
|--------------------------------------------------------------------------
| Name                   : AuthInterceptor
| Built in Dependencies  :  $q, $injector
| Custom Dependencies    :  LocalService
| Description            : use to authenticate admin
|--------------------------------------------------------------------------
*/
angular.module('corsaAdminApp').config(function($httpProvider) {

     function AuthUserInterceptor ($q, $injector) {
          var LocalService = $injector.get('$LocalService');
          //console.log(angular.fromJson(LocalService.get('auth_token')).result);
          return {
               request: function(config) {

                    if (LocalService.get('admin_user') && LocalService.get('admin_user') != 'undefined') {
                         var token;
                         token = angular.fromJson(LocalService.get('admin_user')).token;
                         if (token) {
                              config.headers.Authorization = 'Bearer ' + token;
                         }

                    }
                    return config;
               },
               responseError: function(response) {
                    if (response.status === 401 || response.status === 403) {
                         LocalService.unset('admin_user');
                         $injector.get('$state').go('anon.login',{message:{resStatus:"error",msg:"Your session has been expired, Please login again"}});
                    }
                    return $q.reject(response);
               }
          }
     }

     $httpProvider.interceptors.push(AuthUserInterceptor);
});
