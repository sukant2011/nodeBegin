'use strict';

/**
* @ngdoc directive
* @name izzyposWebApp.directive:adminPosHeader
* @description
* # adminPosHeader
*/
angular.module('corsaAdminApp')
.directive('header',function(){
	return {
		templateUrl:'/javascripts/admin/directives/header/header.html',
		restrict: 'E',
		replace: true,
		controller:function($scope, $SessionService, $state, $AuthService){
               var authUser = $SessionService.user();
               if(authUser) {
				$scope.authUser = authUser;
                    $scope.isAuthenticated = true;
               }

			$scope.logout = function() {
		          $AuthService.logout(function (response) {
		               if(response == true) {
		                    $scope.isAuthenticated = false;
		                    $state.go('login');
		               }
		          });
		     }

               $scope.selectedMenu = 'dashboard';
               $scope.collapseVar = 0;
               $scope.multiCollapseVar = 0;
               $scope.check = function(x){

                    if(x==$scope.collapseVar)
                    $scope.collapseVar = 0;
                    else
                    $scope.collapseVar = x;
               };

               $scope.multiCheck = function(y){

                    if(y==$scope.multiCollapseVar)
                    $scope.multiCollapseVar = 0;
                    else
                    $scope.multiCollapseVar = y;
               };
          }
	}
});
