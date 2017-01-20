/*
|--------------------------------------------------------------------------
| Name                   : LocalService
| Built in Dependencies  :  --
| Custom Dependencies    :  --
| Description            : use to authenticate seeker & register
| Author                 : Sunny Chauhan
| Created                : 18jan2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
angular.module('corsaAdminApp').factory('$LocalService', function() {
          return {
                    get: function(key) {
                         return localStorage.getItem(key);
                    },
                    set: function(key, val) {
                         return localStorage.setItem(key, val);
                    },
                    unset: function(key) {
                         return localStorage.removeItem(key);
                    }
          }
     }
);
