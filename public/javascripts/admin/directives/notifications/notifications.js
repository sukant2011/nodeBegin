'use strict';

/**
* @ngdoc directive
* @name izzyposWebApp.directive:adminPosHeader
* @description
* # adminPosHeader
*/
angular.module('corsaAdminApp')
.directive('notifications',function(){
	return {
		templateUrl:'/javascripts/admin/directives/notifications/notifications.html',
		restrict: 'E',
		replace: true,
	}
});
