/*
|--------------------------------------------------------------------------
| Name                   : AuthInterceptor
| Built in Dependencies  :  $q, $injector
| Custom Dependencies    :  LocalService
| Description            : use to authenticate user
|--------------------------------------------------------------------------
*/
module.exports = function($httpProvider) {

     function AuthUserInterceptor ($q, $injector) {
          var LocalService = $injector.get('$LocalService');
          //console.log(angular.fromJson(LocalService.get('auth_token')).result);
          return {
               request: function(config) {

                    if (LocalService.get('auth_user') && LocalService.get('auth_user') != 'undefined') {
                         var token;
                         token = angular.fromJson(LocalService.get('auth_user')).token;
                         if (token) {
                              config.headers.Authorization = 'BearerS ' + token;
                         }

                    }
                    return config;
               },
               responseError: function(response) {
                    if (response.status === 403 || response.status === 401) {
                         LocalService.unset('auth_user');
                         var msg = (response.data && response.data.err) ? response.data.err : response.err;
                         //$injector.get('$state').go('anon.login',{message:{resStatus:"error",msg:"Your session has been expired, Please login again"}});
                         $injector.get('$state').go('anon.login',{message:{resStatus:"error",msg : msg, isSession : false}});

                    } else if (response.status === 404) {
                         $injector.get('$state').go('anon.404');
                    } else if (response.status === 500) {
                         $injector.get('$state').go('anon.500');
                    }
                    return $q.reject(response);
               }
          }
     }

     $httpProvider.interceptors.push(AuthUserInterceptor);
}
