/**--------------------------------------------------------------------------
Name                   : AuthController
Built in Dependencies  : $AuthService
Custom Dependencies    : $scope, $state, $stateParams
Description            : use to authenticate USER
--------------------------------------------------------------------------*/
module.exports =  function ($LocalService,$scope, $rootScope, $state, $stateParams, $AuthService, $RememberService, $localStorage, $auth,$timeout,FlashService) {

     /**  configuring remember me functionality
     -----------------------------------------------*/
     $scope.User = {};
     $scope.User.remember_me = false;

     // Use to authenticate with social media
     $scope.authenticate = function(provider) {
          $auth.authenticate(provider)
          .then(function(response) {
               FlashService.show();
               var response = response.data;
               var serverMsg = {resStatus : response.resStatus, msg: response.msg}
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $LocalService.set('auth_user', JSON.stringify(response));
                    $scope.$emit('UpdateSession', {message: response.result});
                    //$state.go("user.dashboard", {message : serverMsg});
                    //$state.go("user.dashboard", {message : serverMsg});
                    $state.go("anon.home", {message: serverMsg});

               }
               FlashService.hide();
        })
     };

     /**  Check unique Email
     -----------------------------------------------*/
     var uniqueEmail = function(email) {
          $AuthService.checkUniqueEmail (email, function(response) {
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg =  serverMsg;
               }
          });
     }

     /**  Check unique Mobile
     -----------------------------------------------*/
     var uniqueMobile = function(mobile) {
          $AuthService.checkUniqueMobile (mobile, function(response) {
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.DataModel.mobile = "";
                    $scope.serverMsg =  serverMsg;
               }
          });
     }

     $scope.checkUniqueEmail = function(email) {
          if(email != undefined && email != 'undefined') {
               $scope.serverMsg = {};
               uniqueEmail(email);
          }
     }


     $scope.checkUniqueMobile = function(mobile) {
          if(mobile != undefined && mobile != 'undefined') {
               $scope.serverMsg = {};
               uniqueMobile(mobile);
          }
     },


     /**   registering the employer
     -----------------------------------------------*/
     $scope.register = function () {
          $AuthService.register($scope.DataModel, function (response) {
               FlashService.show();
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {

                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg, verifyId : response.result};
                    $scope.$emit('UpdateSession', {message: response.result});
                    //$state.go("user.dashboard", {message: serverMsg});
                    $state.go("anon.home", {message: serverMsg});

                    //$state.go('anon.verifyByMobile', {message: serverMsg});
               }
               FlashService.hide();
          })
     }

     /**   Recovering password
     -----------------------------------------------*/
     $scope.forgot = function () {
          $AuthService.forgot($scope.DataModel, function (response) {
               FlashService.show();
               var serverMsg ={resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {

                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg, verifyId : response._id};
                    $state.go("anon.verifyByMobileForgot", {message:serverMsg});
               }
               FlashService.hide();
          })
     }

     /**   signing into the application
     -----------------------------------------------*/
     $scope.login = function () {
          $AuthService.login($scope.User, function (response) {
               FlashService.show();
               var serverMsg = {resStatus : response.resStatus, msg: response.msg}
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    var serverMsg = {resStatus : response.resStatus, msg: response.msg, verifyId : response.result._id};
                    if ($scope.User.remember_me) {
                         $RememberService('email', $scope.User.email);
                         $RememberService('password', $scope.User.password);
                    } else {
                         $RememberService('email', '');
                         $RememberService('password', '');
                    }
                    $scope.$emit('UpdateSession', {message: response.result});
                    $state.go("anon.home", {message: serverMsg});
               }
               FlashService.hide();

          })
     }



     if($RememberService('email') ) {
          $scope.User.remember_me = true;
          $scope.User.email = $RememberService('email');
          $scope.User.password = $RememberService('password');
     }

     /**   Displaying flash message
     -----------------------------------------------*/
     // if($stateParams.message != null) {
     //      //$scope.statusMsg = true;
     //      FlashService.show();
     //      $scope.serverMsg = $stateParams.message;
     //      if($stateParams.message.isSession == false) {
     //           $scope.$emit('UpdateSession', {message: {}});
     //      }
     //      //FlashService.hide();
     // }

     if($stateParams.reqUrl != null && $stateParams.reqId) {
          $scope.reqUrl = $stateParams.reqUrl;
          $scope.reqId = $stateParams.reqId;
     }


}
