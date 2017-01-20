'use strict';

/**
* @ngdoc directive
* @name izzyposWebApp.directive:adminPosHeader
* @description
* # adminPosHeader
*/

angular.module('corsaAdminApp')
.directive('sidebar',['$location',function() {
     return {
          templateUrl:'/javascripts/admin/directives/sidebar/sidebar.html',
          restrict: 'E',
          replace: true,
          scope: {
          },
          controller:function($scope, $SessionService){
               var authUser = $SessionService.user();
               if(authUser) {
                    $scope.authUser = authUser;
                    $scope.isAuthenticated = true;
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
}]);
