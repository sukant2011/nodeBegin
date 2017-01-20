/*
--------------------------------------------------------------------------
Name                   : $SessionSeekerService
Description            : use to authenticate user
--------------------------------------------------------------------------
*/
angular.module('corsaAdminApp').factory('$SessionService', function($injector) {
     var LocalService = $injector.get('$LocalService');
     return {
          user: function() {
               var authUser = angular.fromJson(LocalService.get('admin_user'));
               if (authUser && authUser != undefined) {
                    return authUser.result;
               } else {
                    return {};
               }
          }
     }
});
