/**--------------------------------------------------------------------------
Name                   : AuthController
Built in Dependencies  : $AuthService
Custom Dependencies    : $scope, $state, $stateParams
Description            : use to authenticate USER
--------------------------------------------------------------------------*/
angular.module('corsaAdminApp').controller('AuthController', ['$LocalService','$scope','$rootScope', '$state', '$stateParams', '$AuthService', '$RememberService', '$localStorage', function ($LocalService,$scope, $rootScope, $state, $stateParams, $AuthService, $RememberService, $localStorage) {

     /**  configuring remember me functionality
     -----------------------------------------------*/
     $scope.User = {};
     $scope.User.remember_me = false;

     if($RememberService('email') ) {
          $scope.User.remember_me = true;
          $scope.User.email = $RememberService('email');
          $scope.User.password = $RememberService('password');
     }

     /**   Displaying flash message
     -----------------------------------------------*/
     if($stateParams.message != null) {
          $scope.serverMsg = $stateParams.message;
     }

     /**   signing into the application
     -----------------------------------------------*/
     $scope.login = function () {
          $AuthService.login($scope.User, function (response) {
               var serverMsg = {resStatus : response.resStatus, msg: response.msg}
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg, verifyId : response.result};
                    if ($scope.User.remember_me) {
                         $RememberService('email', $scope.User.email);
                         $RememberService('password', $scope.User.password);
                    } else {
                         $RememberService('email', '');
                         $RememberService('password', '');
                    }
                    //$scope.$emit('UpdateSession', {message: response.result});
                    //console.log($rootScope.isAuthenticated);
                    $state.go("dashboard.home", {message: serverMsg});
               }
          })
     }
}])
