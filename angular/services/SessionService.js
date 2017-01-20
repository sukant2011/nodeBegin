/*
--------------------------------------------------------------------------
Name                   : $SessionSeekerService
Description            : use to authenticate user
--------------------------------------------------------------------------
*/
module.exports =  function($injector) {
     var LocalService = $injector.get('$LocalService');
     return {
          user: function() {
               var authUser = angular.fromJson(LocalService.get('auth_user'));
               if (authUser && authUser != undefined) {
                    return authUser.result;
               } else {
                    return {};
               }
          }
     }
}
