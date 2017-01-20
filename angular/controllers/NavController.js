/**--------------------------------------------------------------------------
Name                   : NavController
Description            : use to authenticate the navigation item & logout functionality
--------------------------------------------------------------------------*/

module.exports =  function($LocalService, $scope, $rootScope, $state, $AuthService, $SessionService, $location, $localStorage) {


     var authUser = $SessionService.user();
     if(Object.keys(authUser).length) {
          $scope.authUser = authUser;
     }

     $scope.isAuthenticated = (authUser && authUser._id) ? true : false;

     $scope.$on('ReceiveSessionMessage', function(event, args) {
          var authUser = args.message;
          $scope.isAuthenticated = (authUser && authUser._id) ? true : false;
          $scope.authUser = $SessionService.user();
     });

     $scope.$on('ReceiveNewHeaderClass', function(event, args) {
          $scope.isNewClass = args;
     });

     $scope.logout = function() {
          $AuthService.logout(authUser._id, function (response) {
               if(response == true) {
                    $scope.isAuthenticated = false;
                    $state.go('anon.home');
               }
          });
     }

     // angular.element('a.subNavList-link, .js-navSubMenuToggle a').on('touchstart', function(e){
     //      e.stopPropagation();
     //      //angular.element('ul.subNavList').toggle();
     // });




}
