/**--------------------------------------------------------------------------
Name                   : AccountController
Description            : use to view  the user item & accoununt functionality
--------------------------------------------------------------------------*/

angular.module('corsaAdminApp').controller('AccountController',['$LocalService','$scope', '$rootScope', '$state', '$AuthService', '$SessionService', '$location', '$localStorage','$AccountService', function($LocalService, $scope, $rootScope, $state, $AuthService, $SessionService, $location, $localStorage,$AccountService) {

     /**  View  Profile User */

     var getProfileData = function(){
          var userId = $SessionService.user()._id;
          $AccountService.view(userId, function (response) {
               var serverMsg;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.User = response.result;
                  //console.log($scope.User);
               }
          })
     }();

     $scope.account = function () {
          var userId = $SessionService.user()._id;
          $scope.User = $scope.User || {};
          if ($scope.myFile) {
               $scope.User.file = $scope.myFile[0];
          }
          $AccountService.account(userId,$scope.User, function (response) {
               var serverMsg;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               }else if(response.resStatus == "success") {
                    $scope.serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.User = response.result;
                    $state.go('dashboard.user',{message:serverMsg});
               }
          });

     }

     /**  Change password */
     $scope.changePassword = function () {
          var userId = $SessionService.user()._id;
          $AccountService.changePassword(userId,$scope.password,$scope.new_password,$scope.con_password,function (response) {
               var serverMsg;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               }else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $state.go("user.dashboard", {message: serverMsg});
                    //$scope.User = response.result;
               }
          });
     }
     

}]);
