'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('corsaAdminApp')
	.directive('headerNotification',function(){
		return {
        templateUrl:'/javascripts/admin/directives/header/header-notification/header-notification.html',
        restrict: 'E',
        replace: true,
    	}
	});
