/**--------------------------------------------------------------------------
Name                   : AccountController
Description            : use to view  the user item & accoununt functionality
--------------------------------------------------------------------------*/

module.exports = function($stateParams,$timeout, $scope,$state, $AuthService, $SessionService, $localStorage,$AccountService, $auth,VehicleService, FlashService) {

     /** Initiating userId from session */
     var uId = $SessionService.user()._id;
     var sessionUser = $SessionService.user();

     $scope.toId = '' ;
     var socket = io();
     socket.emit('init',  { userId : sessionUser._id });

     /** socket event for getting chat messages **/
     socket.on('ChatMsg', function(obj){
          $scope.allMsg = $scope.allMsg || [];
          $scope.allMsg.push(obj);
          $scope.$apply();
     });

     /**  get User Profile */
     var getProfileData = function(){
          var userId = $SessionService.user()._id;
          $AccountService.view(userId, function (response) {
               var serverMsg;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.User = response.result;
                    $scope.DataModel = response.result;
               }
          })
     }();

     /** Function to link account with social media */
     $scope.link = function(provider) {
          $auth.link(provider, {userData : $SessionService.user()._id })
          .then(function(response) {
               FlashService.show();
               $scope.serverMsg = {resStatus : response.data.resStatus, msg: response.data.msg};
               $scope.DataModel = response.data.result;
               FlashService.hide();
          });
     };

     // Use to unlink account from social media */
     $scope.unLink = function(provider) {
          $AuthService.unLink($SessionService.user()._id, provider, function(response) {
               FlashService.show();
               $scope.serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == 'success') {
                    $scope.DataModel = response.result;
               }
               FlashService.hide();
          });
     }

     /**  Function to update User Account*/
     $scope.account = function () {
          var userId = $SessionService.user()._id;
          $scope.User = $scope.User || {};
          if ($scope.myFile) {
               $scope.User.file = $scope.myFile[0];
          }
          $AccountService.account(userId,$scope.User, function (response) {
               FlashService.show();
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "success") {
                    $scope.User = response.result;
               }
               FlashService.hide();
               $scope.serverMsg = serverMsg;
          });
     }

     /**  Change password */
     $scope.changePassword = function () {
          var userId = $SessionService.user()._id;
          $AccountService.changePassword(userId,$scope.password,$scope.new_password,$scope.con_password,function (response) {
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "success") {
                    $scope.serverMsg= {resStatus : response.resStatus, msg: response.msg};
                    $state.go("user.dashboard", {message: serverMsg});
               }
               $scope.serverMsg = serverMsg;
          });
     }

     /**  Function to get Messages */
     var getuserMessage = function(toId){
          var fromId = $SessionService.user()._id;
          $AccountService.listUserMessage(toId,fromId, function (response) {
               if(response.resStatus == "error") {
                    $scope.serverMsg = {resStatus : response.resStatus, msg: response.msg};
               } else if(response.resStatus == "success") {
                    $scope.allMsg = response.result;
                    if($localStorage.toId) {
                         delete $localStorage.toId;
                    }
                    if($localStorage.msg) {
                         $scope.serverMsg = {resStatus : "success", msg: $localStorage.msg};
                         delete $localStorage.msg;
                    }
               }
          })
     };

     /**  Function to get Messages */
     var getUsers = function(){
          var userId = $SessionService.user()._id;
          $AccountService.listUsers(userId, function (response) {
               if(response.resStatus == "error") {
                    $scope.serverMsg = {resStatus : response.resStatus, msg: response.msg};
               } else if(response.resStatus == "success") {
                    $scope.users = response.result;
               }
          })
     }();

     $scope.replyMsg = function(msg) {
          var obj = obj || {};
          obj.message = msg;
          obj.to = $scope.toId ;
          obj.from = $SessionService.user()._id;
          VehicleService.addMsg (obj, function (response) {
               if(response.resStatus == "error") {
                    $scope.serverMsg = {resStatus : response.resStatus, msg: response.msg};
               } else if(response.resStatus == "success") {
                    $localStorage.toId = obj.to;
                    $localStorage.msg = response.msg;
                    $state.reload();
               }
          });
     };

     $scope.getUserData = function(toId){
          $scope.toId = toId;
          getuserMessage(toId);
     }

     /**  Display of Flash Messages if exist */
     if($stateParams.message != null) {
          FlashService.show();
          $scope.serverMsg = $stateParams.message;
          FlashService.hide();
     }

     if ($localStorage.toId){
          $scope.toId = $localStorage.toId;
          if( $state.current.name == 'user.message') {
               getuserMessage($localStorage.toId);
          }
     }

}
