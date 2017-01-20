/*
|--------------------------------------------------------------------------
| Name                   : FlashService
| Built in Dependencies  :  --
| Custom Dependencies    :  --
| Description            : use to hide flash Message
| Author                 : Sunny Chauaham
| Created                : 07 Sep 2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
module.exports = function($rootScope, $timeout) {
          return {
               hide : function() {
                    $timeout(function(){
                         $rootScope.statusMsg = false;
                    }, 5000);
               },
               show : function () {
                    $rootScope.statusMsg = true;
               }
          }
     }
