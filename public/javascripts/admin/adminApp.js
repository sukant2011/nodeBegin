'use strict';
/**
* @ngdoc overview
* @name sbAdminApp
* @description
* # sbAdminApp
*
* Main module of the application.
*/
var corsa_admin = angular .module('corsaAdminApp', [
     'oc.lazyLoad',
     'ui.router',
     'ui.bootstrap',
     'angular-loading-bar',
     'ngStorage',
     'textAngular',
     'ngTable'


]);

corsa_admin.run(['$rootScope', '$state', '$localStorage', '$AuthService', '$SessionService','SITE_CONSTANTS', function($rootScope, $state, $localStorage, $AuthService, $SessionService, SITE_CONSTANTS) {

     $rootScope.SITEURL = SITE_CONSTANTS.LOCALURl;

     $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            if (!$AuthService.authorize(toState.data.access)) {
                 event.preventDefault();
                 $state.go('login');
            }
          //console.log($state.$current);
          if(Object.keys($SessionService.user()).length > 0) {
               if(toState.name == "login") {
                    event.preventDefault();
                    $state.go("dashboard.home");
               }
          }
     });

     $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
          // code goes here
     });
}
]);
