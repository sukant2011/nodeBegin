'use strict';

/**
* @ngdoc directive
* @name izzyposWebApp.directive:adminPosHeader
* @description
* # adminPosHeader
*/
angular.module('corsaAdminApp')
.directive('chat',function(){
	return {
		templateUrl:'/javascripts/admin/directives/chat/chat.html',
		restrict: 'E',
		replace: true,
		controller: 'ChatController',
	}
});
