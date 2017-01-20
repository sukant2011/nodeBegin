

module.exports = function($LocalService, $scope, $rootScope, $state, $AuthService, $SessionService, $location, $localStorage,$AccountService, $timeout, $filter) {

     /** Initiate Admin Id  **/
     $scope.adminId = '57c0befe0de1792f2a8e7cc8';

     /** Checking the existence of sessionUser **/
     $scope.sessionUser = Object.keys($SessionService.user()).length ? $SessionService.user() : "";

     /** Initiate socket on client **/
     var socket = io();

     /** socket event for getting chat messages **/
     socket.on('chat message', function(obj){
          var clone = "<div class='onchatis'><h4>"+ getFirstLetter(obj.from.fullname) + "</h4><h5>"+obj.message+"</h5></div>";
          angular.element('.popusagesd').append(clone);
     });

     /** socket event for registering User on socket **/
     var registerUser = function () {
          socket.emit('init',  { userId : $scope.sessionUser._id });
     }

     /** function for showing chat box **/
     var showChatBox = function () {
          angular.element('#qnimate').addClass('popup-box-on');
     }

     /** function for hiding chat box **/
     var hideChatBox = function () {
          angular.element('#qnimate').removeClass('popup-box-on');
     }

     /** function for hitting Api for getting past messages **/
     var getChatMsg = function () {
          $AccountService.listMessage($scope.sessionUser._id, $scope.adminId,  function (response) {
               if(response.status == 200) {
                    $scope.messages = response.data.result;
               }
          });
     }

     var getFirstLetter = function (userName) {
          return userName.charAt(userName).toUpperCase();
     }

     /** function for posting chat message **/
     var postMsg = function (fromId, toId, msg) {
          var obj = {};
          obj.from = fromId;
          obj.to = toId;
          obj.message = msg;
          socket.emit('chat message', obj);
          var clone = "<div class='onchatis'><h4>"+ getFirstLetter($scope.sessionUser.fullname) + "</h4><h5>"+obj.message+"</h5></div>";
          angular.element('.popusagesd').append(clone);
          $scope.msg = "";
          return false;
     }

     /** Event for showing Chat box **/
     $scope.showChat = function () {
          showChatBox();
     }

     /** Event for hiding Chat box **/
     $scope.hideChat = function () {
          hideChatBox();
     }

     /** Event for posting chat message **/
     $scope.chat = function () {
          postMsg($scope.sessionUser._id, $scope.adminId, $scope.msg);
     }

     /** Event for registering new anonymous Chat User**/
     $scope.registerChatUser = function (obj) {
          $AccountService.registerChat(obj, function (response) {
               if(response.status == 200) {
                    registerUser();
                    $scope.sessionUser = response.data.result;
                    postMsg($scope.sessionUser._id, $scope.adminId, obj.msg);
               }
          });
     }

     /** Regis **/
     if($scope.sessionUser) {
          registerUser();
     }
}
