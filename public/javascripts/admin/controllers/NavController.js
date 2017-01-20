/**--------------------------------------------------------------------------
Name                   : NavController
Description            : use to authenticate the navigation item & logout functionality
--------------------------------------------------------------------------*/

angular.module('corsaAdminApp').controller('NavController',['$LocalService','$scope', '$rootScope', '$state', '$AuthService', '$SessionService', '$location', '$localStorage', function($LocalService, $scope, $rootScope, $state, $AuthService, $SessionService, $location, $localStorage) {

     var authUser = $SessionService.user();
     if(authUser) {
          $scope.authUser = authUser;
     }
     $scope.isAuthenticated = (authUser && authUser._id) ? true : false;

     $scope.$on('ReceiveSessionMessage', function(event, args) {
          var authUser = args.message;
          $scope.isAuthenticated = (authUser && authUser._id) ? true : false;
          $scope.authUser = $SessionService.user();
     });

     $scope.logout = function() {
          $AuthService.logout(function (response) {
               if(response == true) {
                    $scope.isAuthenticated = false;
                    $state.go('anon.home');
               }
          });
     }






}]);
