/**--------------------------------------------------------------------------
Name                   : CountController
Description            : use to Count Number of user and vehicle  and  complaints
--------------------------------------------------------------------------*/


angular.module('corsaAdminApp').controller('ChatController',['$LocalService','$scope', '$rootScope', '$state', '$AuthService', '$SessionService', '$location', '$localStorage','$AccountService','ChatService','$timeout','$anchorScroll', '$location',function($LocalService, $scope, $rootScope, $state, $AuthService, $SessionService, $location, $localStorage,$AccountService,ChatService, $timeout, $anchorScroll, $location) {

     $anchorScroll.yOffset = 50;
     $scope.username =($SessionService.user().fullname)?$SessionService.user().fullname : "";
     $scope.profilePic =($SessionService.user().profile.photo)?$SessionService.user().profile.photo : "";
     $localStorage.toObj = $localStorage.toObj || {};
     $scope.toObj = $localStorage.toObj;

     var socket = io();

     socket.emit('init',  { userId : $SessionService.user()._id });

     socket.emit('list onlineUsers');

     socket.on('list onlineUsers', function(users){
          //$timeout(function () {
               $scope.users = users;
          //}, 1000);
     });

     var getChatMsg = function () {
          ChatService.listMessage($SessionService.user()._id, $localStorage.toObj._id,  function (response) {
               if(response.status == 200) {
                    $scope.messages = response.data.result;
               } else {
                    $scope.messages = [];
               }
          });
     }

     if($localStorage.toObj && $localStorage.toObj._id) {
          getChatMsg();
     }



     $scope.selectUser = function (obj) {
          $localStorage.toObj = obj;
          $scope.toObj = $localStorage.toObj;
          getChatMsg();
     }

     // socket.emit('list message');
     //
     // socket.on('list message', function(msgArr){
     //      $timeout(function () {
     //           $scope.messages = msgArr;
     //      }, 1000);
     // });

     angular.element('.panel-footer form').submit(function(){
          var obj = {};
          obj.from = $SessionService.user()._id;
          obj.to = $scope.toObj._id;
          obj.message = $scope.msg;
          socket.emit('chat message', obj);
          var clone = "<li class='clearfix'><div class='chat-body clearfix'><div class='header'><strong class='primary-font'>"+ $SessionService.user().fullname.toUpperCase()+"</strong><small class='pull-right text-muted'><i class='fa fa-clock-o fa-fw'></i> 12 mins ago</small></div><p>"+obj.message+"</p></div></li>";
          angular.element('ul.chat').append(clone);
          $scope.msg = "";
          return false;
     });

     socket.on('chat message', function(obj){
          var clone = "<li class='clearfix'><div class='chat-body clearfix'><div class='header'><strong class='primary-font'>"+obj.from.fullname.toUpperCase()+"</strong><small class='pull-right text-muted'><i class='fa fa-clock-o fa-fw'></i> 12 mins ago</small></div><p>"+obj.message+"</p></div></li>";
          //var clone = angular.element("ul.chat").find("li:last").clone();
          //clone.find('p').html(obj.message);
          //clone.find('strong').html(obj.from.fullname);
          angular.element('ul.chat').append(clone);
     });

}]);
