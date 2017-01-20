'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('corsaAdminApp')
	.directive('timeline',function() {
    return {
        templateUrl:'/javascripts/admin/directives/timeline/timeline.html',
        restrict: 'E',
        replace: true,
    }
  });
