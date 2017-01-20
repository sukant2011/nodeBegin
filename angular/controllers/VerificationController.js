/**
|--------------------------------------------------------------------------
| Name                   : VerificationController
| Built in Dependencies  : $AuthService
| Custom Dependencies    : $scope, $stateParams, $state
| Description            : use to verify the seeker identity
| Author                 : Sunny Chauhan
| Created                : 17jan2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
module.exports = function($scope, $rootScope, $stateParams, $state, $AuthService, $localStorage, $SessionService, $LocalService,FlashService) {

     // angular.element("#alert-success").fadeTo(2000, 500).slideUp(500, function(){
     //           angular.element(this).slideUp(500);
     // });

     /** storing the params in scope & localstorage*/
     if($stateParams.message != null) {
          $scope.serverMsg = {};
          $localStorage.verifyId = $stateParams.message.verifyId;
          $scope.serverMsg = $stateParams.message;
     } else {
          $scope.serverMsg = {};
     }

     /** Redirect to the login, when verifyId is null or undefined*/
     if($localStorage.verifyId  == null || $localStorage.verifyId == undefined) {
          $state.go("anon.login");
     }

     /** Resend the OTP if user doesn't receive the OTP*/
     $scope.reSendOtp = function() {
          $scope.DataModel = $scope.DataModel || {};
          $scope.DataModel._id = $localStorage.verifyId;
          $AuthService.reSendOtp($scope.DataModel, function(response) {
               FlashService.show();
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.serverMsg = serverMsg;
               }
          })
     }

     /** Authenticate the account by matching the OTP*/
     $scope.confirmOtp = function() {
          $scope.DataModel._id = $localStorage.verifyId;
          $AuthService.confirmOtp($scope.DataModel, function(response) {
               FlashService.show();
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    delete $localStorage.verifyId;
                    $scope.$emit('UpdateSession', {message: response.result});
                    $state.go("user.dashboard", {message:serverMsg});
               }
          })
     }

     /** Authenticate the account in case of forget password by matching the OTp*/
     $scope.confirmOtpForgot = function() {
          $scope.DataModel._id = $localStorage.verifyId;
          $AuthService.confirmOtpForgot($scope.DataModel, function(response) {
               FlashService.show();
               var serverMsg = {resStatus : response.resStatus, msg: response.msg, verifyId : response._id };
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    delete $localStorage.verifyId;
                    $state.go("anon.resetPassword", {message:serverMsg});
               }
          })
     }

     /**   reseting the password
     -----------------------------------------------*/
     $scope.resetPassword = function () {
          $scope.DataModel._id = $localStorage.verifyId;
          $AuthService.resetPassword($scope.DataModel, function (response) {
               FlashService.show();
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    delete $localStorage.verifyId;
                    $state.go("anon.login", {message:serverMsg});
               }
          })
     }

var verifyEmail = function(){
     //alert("helloo")
     $AuthService.confirmEmail($stateParams.token,$stateParams.id,function (response) {

          var serverMsg;
          if(response.resStatus == "error") {
               serverMsg = {resStatus : response.resStatus, msg: response.msg};
               $scope.serverMsg = serverMsg;
          } else if(response.resStatus == "success") {
               serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if ($SessionService.user()._id) {
                    $state.go("user.dashboard", {message:serverMsg});
               } else {
                    $LocalService.set('auth_user', JSON.stringify(response));
                    $scope.$emit('UpdateSession', {message: response.result});
                    $state.go("anon.home", {message: serverMsg});
               }
          }
     })
}
     if($state.current.name == "anon.verifyEmail") {
          verifyEmail();
   }
     /**   verifying the seeker
     -----------------------------------------------*/
     // if($state.current.name == "anon.verifyByEmail") {
     //       $AuthService.verifyByEmail($stateParams.token,$stateParams.email, function (response) {
     //             var serverMsg = {resStatus : response.resStatus, msg: response.msg};
     //             if(response.resStatus == "error") {
     //                   $scope.serverMsg = serverMsg;
     //             } else if(response.resStatus == "success") {
     //                   $scope.serverMsg = serverMsg;
     //             }
     //       })
     // }

     // if($state.current.name == "anon.resetByEmail") {
     //       $AuthService.verifyByReset($stateParams.actToken, $stateParams.email, function (response) {
     //             var serverMsg = {resStatus : response.resStatus, msg: response.msg};
     //             if(response.resStatus == "error") {
     //                   $scope.serverMsg = serverMsg;
     //             } else if(response.resStatus == "success") {
     //                   $scope.serverMsg = serverMsg;
     //                   $scope.authId = response.authId;
     //             }
     //       })
     // }
}
