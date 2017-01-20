(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//var anguShare = require('./directives/anguShare.js');
//require('angular');
// ...and add 'ui.router' as a dependency
//var myApp = angular.module('myApp', ['angular-ui-router','ngStorage','angular-messages']);
angular.module('templates', []);
var corsaApp = angular.module('corsa', ['ui.router', 'ngMessages', 'ui.bootstrap', 'ngStorage','gm', 'satellizer', 'templates', 'rzModule', 'ngAnimate','anguShare','ngSanitize','ngTable','infinite-scroll']);

corsaApp.run(['$rootScope', '$state', '$localStorage', '$AuthService', '$SessionService','SITE_CONSTANTS','$anchorScroll','$anchorScroll', function($rootScope, $state, $localStorage, $AuthService, $SessionService, SITE_CONSTANTS, $anchorScroll) {

          $rootScope.SITEURL = SITE_CONSTANTS.LOCALURl;
          $anchorScroll.yOffset = 50;
          $rootScope.$on('UpdateSession', function(event, args) {
               $rootScope.$broadcast('ReceiveSessionMessage', args);
          });
          $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams) {
               $anchorScroll();
               if (!$AuthService.authorize(toState.data.access)) {
                    event.preventDefault();
                    $state.go('anon.login');
               }

               if(Object.keys($SessionService.user()).length > 0) {
                    if(toState.name == "anon.login") {
                         event.preventDefault();
                         $state.go("user.dashboard");
                    }
               }
          });

          $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){

               if($state.current.name == "anon.blog" || $state.current.name == "anon.blogview") {
                         $rootScope.$broadcast('ReceiveNewHeaderClass', true);
               } else {
                    $rootScope.$broadcast('ReceiveNewHeaderClass', false);
               }

          });
     }
]);

corsaApp.config(["$stateProvider","$urlRouterProvider","$locationProvider","$authProvider","AccessLevels", function($stateProvider, $urlRouterProvider, $locationProvider, $authProvider, AccessLevels) {

     // $locationProvider.html5Mode(true);

     // Optional: For client-side use (Implicit Grant), set responseType to 'token' (default: 'code')
     $authProvider.facebook({
          clientId: '1757686401155551',
     });

     $authProvider.google({
          clientId: '682489641376-tevritvf7g2npjq2oeb7rb3emn0s71fk.apps.googleusercontent.com'
     });

     $stateProvider
     .state('anon', {
          abstract: true,
          template: '<ui-view/>',
          data: {
               access: AccessLevels.anon
          }
     })
     .state('anon.test', {
          url: '/test',
          templateUrl: '/templates/front/test.html',
          controller: 'TestController'
     })
     .state('anon.home', {
          url: '/',
          templateUrl: '/templates/front/index.html',
          controller: 'HomeController as ctrl'
     })
     .state('anon.404', {
          url: '/404',
          templateUrl: '/templates/front/404.html',
          controller: 'HomeController as ctrl'
     })
     .state('anon.500', {
          url: '/500',
          templateUrl: '/templates/front/500.html',
          controller: 'HomeController as ctrl'
     })
     .state('anon.how-corsa-works', {
          url: '/how-corsa-works',
          templateUrl: '/templates/front/how-corsa-works.html',
          controller: 'HomeController'
     })
     .state('anon.support', {
          url: '/support',
          templateUrl: '/templates/front/support.html',
          controller: 'SupportController'
     })
     .state('anon.rent', {
          url: '/rent',
          templateUrl: '/templates/front/rent.html',
          controller: 'HomeController'
     })
     .state('anon.list-your-car', {
          url: '/list-your-car',
          templateUrl: '/templates/front/list-your-car.html',
          controller: 'SupportController'
     })
     .state('anon.airport-parking', {
          url: '/airport-parking',
          templateUrl: '/templates/front/airport-parking.html',
          controller: 'HomeController'
     })
     .state('anon.trust-and-safety', {
          url: '/trust-and-safety',
          templateUrl: '/templates/front/trust-and-safety.html',
          controller: 'HomeController'
     })
     .state('anon.policy', {
          url: '/policy',
          templateUrl: '/templates/front/policy.html',
          controller: 'HomeController'
     })
     .state('anon.about', {
          url: '/about',
          templateUrl: '/templates/front/about.html',
          controller: 'HomeController'
     })
     .state('anon.terms', {
          url: '/terms',
          templateUrl: '/templates/front/term_condition.html',
          controller: 'HomeController'
     }).state('anon.privacy', {
          url: '/privacy',
          templateUrl: '/templates/front/privacy.html',
          controller: 'HomeController'
     })
     .state('anon.insurance', {
          url: '/insurance',
          templateUrl: '/templates/front/insurance.html',
          controller: 'HomeController'
     })
     .state('anon.insurancefaq', {
          url: '/insurancefaq',
          templateUrl: '/templates/front/insurancefaq.html',
          controller: 'HomeController'
     })
     .state('anon.renterfaq', {
          url: '/renterfaq',
          templateUrl: '/templates/front/renterfaq.html',
          controller: 'HomeController'
     })
     .state('anon.ownerfaq', {
          url: '/ownerfaq',
          templateUrl: '/templates/front/ownerfaq.html',
          controller: 'HomeController'
     })
     .state('anon.search', {
          url: '/search',
          templateUrl: '/templates/front/search.html',
          controller: 'SearchController',
          params :{
               message :null
          }
     })
     .state('anon.search.list', {
          url: '/list',
          templateUrl: '/templates/front/search_list.html',
     })
     .state('anon.search.map', {
          url: '/map',
          templateUrl: '/templates/front/search_map.html',
          controller: 'SearchController'
     })
     .state('anon.vehicleDetail', {
          url: '/vehicle/detail?refId',
          templateUrl: '/templates/front/detail.html',
          controller: 'VehicleDetailController'
     })
     .state('anon.publicProfile', {
          url: '/drivers/:userId',
          templateUrl: '/templates/front/public_profile.html',
          controller: 'VehicleDetailController'
     })
     .state('anon.login', {
          url: '/login',
          templateUrl: '/templates/front/login.html',
          controller: 'AuthController',
          params :{
               message :null
          }
     })
     .state('anon.blog', {
          url: '/blog',
          templateUrl: '/templates/front/blog.html',
          controller: 'BlogController'
     })
     .state('anon.blogview', {
          url: '/blogview?blogId',
          templateUrl: '/templates/front/blogView.html',
          controller: 'BlogController'
     })

     .state('anon.register', {
          url: '/register?code',
          templateUrl: '/templates/front/register.html',
          controller: 'AuthController'
     })
     .state('anon.email', {
          url: '/register/email',
          templateUrl: '/templates/front/email.html',
          controller: 'AuthController'
     })
     .state('anon.verifyByMobile', {
          url: '/auth/verifyByMobile',
          templateUrl: '/templates/front/otp.html',
          controller: 'VerificationController',
          params :{
               message :null
          }
     })
     .state('anon.verifyEmail', {
          url: '/auth/verifyEmail?token&id',
          templateUrl: '/templates/front/varifyEmail.html',
          controller: 'VerificationController',
          params :{
               message :null
          }
     })
     .state('anon.forgot', {
          url: '/auth/password-forgot',
          templateUrl: '/templates/front/forgot.html',
          controller: 'AuthController'
     })
     .state('anon.verifyByMobileForgot', {
          url: '/auth/verifyByMobileForgort',
          templateUrl: '/templates/front/otpForgot.html',
          controller: 'VerificationController',
          params :{
               message :null
          }
     })
     .state('anon.resetPassword', {
          url: '/auth/resetPassword',
          templateUrl: '/templates/front/reset_password.html',
          controller: 'VerificationController',
          params :{
               message :null

          }
     });


     $stateProvider
     .state('user', {
          abstract: true,
          template: '<ui-view/>',
          data: {
               access: AccessLevels.user
          }
     })
     .state('user.dashboard', {
          url: '/user/dashboard',
          templateUrl: '/templates/front/dashboard.html',
          controller : "DashboardController",
          params :{
               message :null
          }
     })
     .state('user.order', {
          url: '/user/order',
          templateUrl: '/templates/front/orders.html',
          controller : "OrderController",
          params :{
               message :null
          }
     })
     .state('user.paypalInfo', {
          url: '/user/paypalInfo?vehicleId&token&PayerID',
          templateUrl: '/templates/front/orderProcess.html',
          controller : "VehicleDetailController",
          params :{
               message :null
          }
     })
     .state('user.message', {
          url: '/user/message',
          templateUrl: '/templates/front/messages.html',
          controller : "AccountController",
          params :{
               message :null
          }
     })
     .state('user.referrals', {
          url: '/user/referrals',
          templateUrl: '/templates/front/referrals.html',
          controller : "ReferralController",
          params :{
               message :null
          }
     })
     .state('user.referralInvitation', {
          url: '/user/referral/Invitation?referCode',
          templateUrl: '/templates/front/referralIntro.html',
          controller : "ReferralController",
          params :{
               message :null
          }
     })
     .state('user.profile', {
          url: '/user/profile',
          templateUrl: '/templates/front/profile.html',
          controller : "AccountController",
          params :{
               message :null

          }
     })
     .state('user.viewBookingUser', {
          url: '/viewBookingUser?bookingId',
          templateUrl: '/templates/front/viewBookingUser.html',
          controller : "VehicleController",
          params :{
               message :null
          }

     })
     .state('user.account', {
          url: '/user/account',
          templateUrl: '/templates/front/account.html',
          controller : "AccountController",
          params :{
               message :null
          }
     })
     .state('user.invoice', {
          url: '/user/invoice',
          templateUrl: '/templates/front/invoice.html',
          controller : "OrderController",
          params :{
               message :null
          }
     })
     .state('user.trips', {
          url: '/user/trips',
          templateUrl: '/templates/front/trips.html',
          controller : "AccountController",
          params :{
               message :null
          }
     })
     .state('user.changePassword', {
          url: '/user/changePassword',
          templateUrl: '/templates/front/update_password.html',
          controller : "AccountController",
          params :{
               message :null
          }
     })
     .state('user.report_listing', {
          url: '/user/report_listing',
          templateUrl: '/templates/front/report_listing.html',
          controller:"ListController",
          params :{
               message :null
          }
     })
     .state('user.myCars', {
          url: '/myCars',
          templateUrl: '/templates/front/myCars.html',
          controller : "DashboardController",
     })
     .state('user.mobileVerification', {
          url: '/mobileVerification?refId',
          templateUrl: '/templates/front/mobile_verification.html',
          controller : "VehicleController",
          params :{
               message :null
          }
     })
     .state('user.mobileOTP', {
          url: '/mobileOTP?refId',
          templateUrl: '/templates/front/mobileOtp.html',
          controller : "VehicleController",
          params :{
               message :null
          }
     })
     .state('user.driverlicense', {
              url: '/driverlicense?refId',
               templateUrl: '/templates/front/listcar_driverlicense.html',
               controller :'VehicleController',
               params :{
                    message :null
               }
     })
     .state('user.listcarIntro', {
          url: '/intro?refId',
          templateUrl: '/templates/front/listcar_intro.html',
          controller : 'VehicleController',
          params :{
               message :null
          }
     })
     .state('user.listcarAvailability', {
          url: '/availability?refId',
          templateUrl: '/templates/front/listcar_availability.html',
          controller : 'VehicleController',
          params :{
               message :null
          }
     })
     .state('user.listcarDetails', {
          url: '/details?refId',
          templateUrl: '/templates/front/listcar_detail.html',
          controller : 'VehicleController',
          params :{
               message :null
          }
     })
     .state('user.listcarPhotos', {
          url: '/photos?refId',
          templateUrl: '/templates/front/listcar_photos.html',
          controller : 'VehicleController',
          params :{
               message :null
          }
     })
     .state('user.listcarPublish', {
          url: '/publish?refId',
          templateUrl: '/templates/front/listcar_publish.html',
          controller : 'VehicleController',
          params :{
               message :null
          }
     })
     .state('user.liscarLanding', {
          url: '/landingPage',
          templateUrl: '/templates/front/listcar_landing.html',
          controller : "VehicleController as ctrl",
          params :{
               message :null
          }
     })
     .state('user.trip_detail', {
           url: '/trip_detail',
          templateUrl: '/templates/front/trip_detail.html',
          controller : "VehicleController",
          params :{
               message :null
          }
     })
     .state('user.liscarLanding.calendar', {
          url: '/calendar?refId',
          templateUrl: '/templates/front/listcar_landing_calendar.html',
          parent : 'user.liscarLanding'
     })
     .state('user.liscarLanding.pricing', {
          url: '/pricing?refId',
          templateUrl: '/templates/front/listcar_landing_pricing.html',
          parent : 'user.liscarLanding'
     })
     .state('user.liscarLanding.location', {
          url: '/location?refId',
          templateUrl: '/templates/front/listcar_landing_location.html',
          parent : 'user.liscarLanding'
     })
     .state('user.liscarLanding.delivery', {
          url: '/delivery?refId',
          templateUrl: '/templates/front/listcar_landing_delivery.html',
          parent : 'user.liscarLanding'
     })
     .state('user.liscarLanding.tripPreference', {
          url: '/trip-preference?refId',
          templateUrl: '/templates/front/listcar_landing_preference.html',
          parent : 'user.liscarLanding'
     })
     .state('user.liscarLanding.photos', {
          url: '/photos?refId',
          templateUrl: '/templates/front/listcar_landing_photos.html',
          parent : 'user.liscarLanding',
          controller : 'VehicleController'
     })
     .state('user.liscarLanding.detail', {
          url: '/details?refId',
          templateUrl: '/templates/front/listcar_landing_details.html',
          parent : 'user.liscarLanding'
     })
     .state('user.liscarLanding.distance', {
          url: '/distance?refId',
          templateUrl: '/templates/front/listcar_landing_distance.html',
          parent : 'user.liscarLanding'
     })
     .state('user.liscarLanding.protection', {
           url: '/protection?refId',
          templateUrl: '/templates/front/listcar_landing_protection.html'
     })
     .state('user.liscarLanding.trip_history', {
           url: '/trip_history?refId',
          templateUrl: '/templates/front/listcar_landing_trip_history.html',
          //parent : 'user.liscarLanding'
          controller : "VehicleController"
     })
     /**-------- Provider Angular Routes -------- */
     $urlRouterProvider.otherwise('/');
}]);


corsaApp.config(['$httpProvider', require('./interceptors/AuthInterceptor.js')]);

corsaApp.constant('AccessLevels', {
    anon: 0,
    user: 1
});

corsaApp.constant('SITE_CONSTANTS', {
     LOCALURl : 'localhost:3000',
     DEVURl  : 'http://turo.mobilytedev.com:3000/',
     LIVEURL : 'http://rentcorsa.com'
});


// corsaApp.constant('AccessLevels', [function () {
//           return {
//               anon: 0,
//               user: 1
//           }
// }]);

// corsaApp.constant('SITE_CONSTANTS', [function () {
//           return {
//                LOCALURl : 'localhost:3000',
//               DEVURl  : 'http://turo.mobilytedev.com:3000/',
//               LIVEURL : 'http://rentcorsa.com'
//           }
// }]);


// corsaApp.constant('SITE_CONSTANTS', {
//      LOCALURl : 'localhost:3000',
//      DEVURl  : 'http://turo.mobilytedev.com:3000/',
//      LIVEURL : 'http://rentcorsa.com'
// });

corsaApp.factory('$AuthService', ['$http', '$LocalService', 'AccessLevels', '$localStorage', require('./services/AuthService.js')]);
corsaApp.factory('$AccountService', ['$q','$http', '$LocalService', 'AccessLevels', '$localStorage', '$SessionService', require('./services/AccountService.js')]);
corsaApp.factory('$LocalService', [require('./services/LocalService.js')]);
corsaApp.factory('BlogService', ['$http', require('./services/BlogService.js')]);
corsaApp.factory('FlashService', ['$rootScope', '$timeout', require('./services/FlashService.js')]);
corsaApp.factory('$RememberService', [ require('./services/RememberMeService.js')]);
corsaApp.factory('$SessionService', ['$injector', require('./services/SessionService.js')]);
corsaApp.factory('VehicleService', ['$http', '$q', require('./services/VehicleService.js')]);

corsaApp.filter('startFrom', [require('./filters/StartFrom.js')]);
corsaApp.filter('FirstChar', [require('./filters/FirstChar.js')]);

corsaApp.directive('aDisabled', [require('./directives/disableLink.js')]);
corsaApp.directive('fileModel', ['$parse', require('./directives/FileUpload.js')]);
corsaApp.directive('loading', ['$http', require('./directives/loader.js')]);
corsaApp.directive('compile', ['$compile', require('./directives/nghtmlCompiler.js')]);
corsaApp.directive('starRating', [require('./directives/RatingDirective.js')]);

corsaApp.controller('AccountController', ['$stateParams','$timeout','$scope', '$state', '$AuthService', '$SessionService', '$localStorage','$AccountService','$auth','VehicleService', 'FlashService', require('./controllers/AccountController.js')]);
corsaApp.controller('AuthController', ['$LocalService','$scope','$rootScope', '$state', '$stateParams', '$AuthService', '$RememberService', '$localStorage','$auth','$timeout','FlashService', require('./controllers/AuthController.js')]);
corsaApp.controller('BlogController', ['$scope','$state','$stateParams','BlogService','$localStorage', require('./controllers/BlogController.js')]);
corsaApp.controller('DashboardController', ['$timeout','$scope', '$rootScope', '$state','$stateParams','$SessionService','VehicleService', require('./controllers/DashboardController.js')]);
corsaApp.controller('HomeController', ['$scope', '$state','$uibModal','$sce','$AccountService','$location','$anchorScroll','$window', require('./controllers/HomeController.js')]);
corsaApp.controller('InfocarController', ['$scope', require('./controllers/InfocarController.js')]);
corsaApp.controller('ListController', ['$scope', '$rootScope', '$state','$stateParams', require('./controllers/ListController.js')]);
corsaApp.controller('ModalInstanceController', ['$uibModalInstance', '$scope', 'items', require('./controllers/ModalInstanceController.js')]);
corsaApp.controller('ModalPaymentController', ['$uibModalInstance', '$scope', 'items', 'VehicleService', '$localStorage', '$location', require('./controllers/ModalPaymentController.js')]);
corsaApp.controller('ModalReferralController', ['$uibModalInstance','items','$scope', 'VehicleService', require('./controllers/ModalReferralController.js')]);
corsaApp.controller('ModelListStatusController', ['$uibModalInstance','items','$scope', 'VehicleService','$rootScope','$timeout','$state','$uibModal','$filter', require('./controllers/ModelListStatusController.js')]);
corsaApp.controller('ModalSendMessage', ['$state','$uibModalInstance', '$scope','items','VehicleService','$localStorage','$location','$SessionService', require('./controllers/ModelSendMessage.js')]);
corsaApp.controller('NavController', ['$LocalService','$scope', '$rootScope', '$state', '$AuthService', '$SessionService', '$location', '$localStorage', require('./controllers/NavController.js')]);
corsaApp.controller('OrderController', ['$timeout','$scope', '$state','$stateParams','$SessionService','VehicleService','$uibModal','NgTableParams' ,'$templateCache','$filter', require('./controllers/OrderController.js')]);
corsaApp.controller('ReferralController', ['$scope', '$state','$stateParams','$SessionService','VehicleService','$uibModal','$location', require('./controllers/ReferralController.js')]);
corsaApp.controller('SearchController', ['$scope', '$stateParams', 'VehicleService','$state','$timeout','$location', require('./controllers/SearchController.js')]);
corsaApp.controller('TestController', ['$scope', '$state','$stateParams','$SessionService','VehicleService','$timeout', require('./controllers/TestController.js')]);
corsaApp.controller('VehicleController', ['$timeout','$scope', '$rootScope','$stateParams', '$state', '$localStorage', '$location', '$http','VehicleService','$SessionService','$AccountService', '$uibModal', '$log','NgTableParams', require('./controllers/VehicleController.js')]);
corsaApp.controller('VehicleDetailController', ['$timeout','$scope', '$rootScope','$stateParams', '$state', '$localStorage', '$location', '$http','VehicleService','$SessionService','$uibModal', require('./controllers/VehicleDetailController.js')]);
corsaApp.controller('VerificationController', ['$scope', '$rootScope', '$stateParams', '$state', '$AuthService', '$localStorage','$SessionService', '$LocalService','FlashService', require('./controllers/VerificationController.js')]);
corsaApp.controller('SupportController', ['$LocalService','$scope', '$rootScope', '$state', '$AuthService', '$SessionService', '$location', '$localStorage','$AccountService','$timeout','$filter', require('./controllers/SupportController.js')]);

},{"./controllers/AccountController.js":2,"./controllers/AuthController.js":3,"./controllers/BlogController.js":4,"./controllers/DashboardController.js":5,"./controllers/HomeController.js":6,"./controllers/InfocarController.js":7,"./controllers/ListController.js":8,"./controllers/ModalInstanceController.js":9,"./controllers/ModalPaymentController.js":10,"./controllers/ModalReferralController.js":11,"./controllers/ModelListStatusController.js":12,"./controllers/ModelSendMessage.js":13,"./controllers/NavController.js":14,"./controllers/OrderController.js":15,"./controllers/ReferralController.js":16,"./controllers/SearchController.js":17,"./controllers/SupportController.js":18,"./controllers/TestController.js":19,"./controllers/VehicleController.js":20,"./controllers/VehicleDetailController.js":21,"./controllers/VerificationController.js":22,"./directives/FileUpload.js":23,"./directives/RatingDirective.js":24,"./directives/disableLink.js":25,"./directives/loader.js":26,"./directives/nghtmlCompiler.js":27,"./filters/FirstChar.js":28,"./filters/StartFrom.js":29,"./interceptors/AuthInterceptor.js":30,"./services/AccountService.js":31,"./services/AuthService.js":32,"./services/BlogService.js":33,"./services/FlashService.js":34,"./services/LocalService.js":35,"./services/RememberMeService.js":36,"./services/SessionService.js":37,"./services/VehicleService.js":38}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
/**--------------------------------------------------------------------------
Name                   : AuthController
Built in Dependencies  : $AuthService
Custom Dependencies    : $scope, $state, $stateParams
Description            : use to authenticate USER
--------------------------------------------------------------------------*/
module.exports =  function ($LocalService,$scope, $rootScope, $state, $stateParams, $AuthService, $RememberService, $localStorage, $auth,$timeout,FlashService) {

     /**  configuring remember me functionality
     -----------------------------------------------*/
     $scope.User = {};
     $scope.User.remember_me = false;

     // Use to authenticate with social media
     $scope.authenticate = function(provider) {
          $auth.authenticate(provider)
          .then(function(response) {
               FlashService.show();
               var response = response.data;
               var serverMsg = {resStatus : response.resStatus, msg: response.msg}
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $LocalService.set('auth_user', JSON.stringify(response));
                    $scope.$emit('UpdateSession', {message: response.result});
                    //$state.go("user.dashboard", {message : serverMsg});
                    //$state.go("user.dashboard", {message : serverMsg});
                    $state.go("anon.home", {message: serverMsg});

               }
               FlashService.hide();
        })
     };

     /**  Check unique Email
     -----------------------------------------------*/
     var uniqueEmail = function(email) {
          $AuthService.checkUniqueEmail (email, function(response) {
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg =  serverMsg;
               }
          });
     }

     /**  Check unique Mobile
     -----------------------------------------------*/
     var uniqueMobile = function(mobile) {
          $AuthService.checkUniqueMobile (mobile, function(response) {
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.DataModel.mobile = "";
                    $scope.serverMsg =  serverMsg;
               }
          });
     }

     $scope.checkUniqueEmail = function(email) {
          if(email != undefined && email != 'undefined') {
               $scope.serverMsg = {};
               uniqueEmail(email);
          }
     }


     $scope.checkUniqueMobile = function(mobile) {
          if(mobile != undefined && mobile != 'undefined') {
               $scope.serverMsg = {};
               uniqueMobile(mobile);
          }
     },


     /**   registering the employer
     -----------------------------------------------*/
     $scope.register = function () {
          $AuthService.register($scope.DataModel, function (response) {
               FlashService.show();
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {

                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg, verifyId : response.result};
                    $scope.$emit('UpdateSession', {message: response.result});
                    //$state.go("user.dashboard", {message: serverMsg});
                    $state.go("anon.home", {message: serverMsg});

                    //$state.go('anon.verifyByMobile', {message: serverMsg});
               }
               FlashService.hide();
          })
     }

     /**   Recovering password
     -----------------------------------------------*/
     $scope.forgot = function () {
          $AuthService.forgot($scope.DataModel, function (response) {
               FlashService.show();
               var serverMsg ={resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {

                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg, verifyId : response._id};
                    $state.go("anon.verifyByMobileForgot", {message:serverMsg});
               }
               FlashService.hide();
          })
     }

     /**   signing into the application
     -----------------------------------------------*/
     $scope.login = function () {
          $AuthService.login($scope.User, function (response) {
               FlashService.show();
               var serverMsg = {resStatus : response.resStatus, msg: response.msg}
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    var serverMsg = {resStatus : response.resStatus, msg: response.msg, verifyId : response.result._id};
                    if ($scope.User.remember_me) {
                         $RememberService('email', $scope.User.email);
                         $RememberService('password', $scope.User.password);
                    } else {
                         $RememberService('email', '');
                         $RememberService('password', '');
                    }
                    $scope.$emit('UpdateSession', {message: response.result});
                    $state.go("anon.home", {message: serverMsg});
               }
               FlashService.hide();

          })
     }



     if($RememberService('email') ) {
          $scope.User.remember_me = true;
          $scope.User.email = $RememberService('email');
          $scope.User.password = $RememberService('password');
     }

     /**   Displaying flash message
     -----------------------------------------------*/
     // if($stateParams.message != null) {
     //      //$scope.statusMsg = true;
     //      FlashService.show();
     //      $scope.serverMsg = $stateParams.message;
     //      if($stateParams.message.isSession == false) {
     //           $scope.$emit('UpdateSession', {message: {}});
     //      }
     //      //FlashService.hide();
     // }

     if($stateParams.reqUrl != null && $stateParams.reqId) {
          $scope.reqUrl = $stateParams.reqUrl;
          $scope.reqId = $stateParams.reqId;
     }


}

},{}],4:[function(require,module,exports){
/**--------------------------------------------------------------------------
Name                   : InfoController
Description            :get blogs
--------------------------------------------------------------------------*/

module.exports =  function($scope,$state,$stateParams,BlogService,$localStorage) {

     var blogId = (  $stateParams.blogId ) ? $stateParams.blogId : "";
     //$scope.allBlog= $localStorage.user3;
     //console.log($scope.allBlog);


     $scope.listBlogs =  function () {
     //console.log($scope.allBlog);
          BlogService.list(function (response) {
               var serverMsg;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.allBlog = response.result;

                    $scope.currentPage = 1;
                    $scope.totalItems = $scope.allBlog.length;
                    $scope.entryLimit = 200; // items per page
                    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

               }
            });
     }
     var serviceApi = {

          ViewBlog : function (blogId) {
               BlogService.view(blogId, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         //$scope.htmlcontent = response.result.description;
                         $scope.DataModel = response.result;
                    }
               });
          }

};
     //=========================view blog  list=====================================
     if($state.current.name == 'anon.blog') {
          $scope.listBlogs();
     }

     if(blogId) {
          serviceApi.ViewBlog(blogId);
     }
}

},{}],5:[function(require,module,exports){
/**--------------------------------------------------------------------------
Name                   : DashboardController
Description            : use to authenticate the navigation item & logout functionality
--------------------------------------------------------------------------*/

module.exports = function($timeout,$scope, $rootScope, $state, $stateParams, $SessionService, VehicleService) {

     /**   Displaying flash message */
     if($stateParams.message != null) {
          $scope.statusMsg = true;
          $scope.serverMsg = $stateParams.message;


     }
     $timeout(function(){
          $scope.statusMsg = false;
          console.log("changed");
     }, 5000);




     var getCities = function () {
          VehicleService.getCities(function (response){
               serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.citiesArr = response.result;
               }
          });
     }();

     /** Get All cars to aparticualr User*/
     if($state.current.name == 'user.myCars') {
          VehicleService.myVehicles($SessionService.user()._id, function (response){
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.dataArr = response.result;
               }
          });
     }

     $scope.search=function(obj){
          var obj = obj || {};
          if($scope.autocomplete) {
               if($scope.autocomplete.getPlace()) {
                    obj.location = $scope.autocomplete.getPlace().formatted_address;
                    var location = $scope.autocomplete.getPlace().geometry.location;
                    var placeObj = $scope.autocomplete.getPlace();
                    obj.lat = location.lat();
                    obj.lon = location.lng();
                    placeObj.address_components.forEach(function (item) {
                         for(i=0; i<item.types.length; i++) {
                              if(item.types[i] =='locality'){
                                   obj.city = item.long_name ? item.long_name : "";
                              }
                              if(item.types[i] =='country'){
                                   obj.country = item.long_name ? item.long_name : "";
                              }
                              if(item.types[i] =='administrative_area_level_1'){
                                   obj.state = item.long_name ? item.long_name : "";
                              }
                         }
                    });
                    $state.go('anon.search.list', {message : obj});
               }
          }
     }


}

},{}],6:[function(require,module,exports){


//Angular App Module and Controller

module.exports = function ($scope, $state, $uibModal, $sce,$AccountService,$location,$anchorScroll,$window) {

     var momentObj = moment("12:15 AM", ["h:mm A"])




     var getDate = function (days) {
          var today = new Date();
          if(days) {
               today.setDate(today.getDate() + days);
          }
          var dd = today.getDate();
          var mm = today.getMonth()+1; //January is 0!
          var yyyy = today.getFullYear();

          if(dd<10) {
               dd='0'+dd
          }

          if(mm<10) {
               mm='0'+mm
          }

          return mm+'/'+dd+'/'+yyyy;
     }

     function customRange(input){
          return {
               minDate: (input.id == "endDate" ? angular.element("#startDate").datepicker("getDate") : new Date())
          };
     }

     // To set maxdate in startdate
     function customRangeStart(input){
          return {
               maxDate:(input.id == "startDate" ?angular.element("#endDate").datepicker("getDate") : null)
          };
     }

     $scope.searchVehicle=function(obj){
          var obj = obj || {};
          if($scope.autocomplete) {
               if($scope.autocomplete.getPlace()) {
                    obj.location = $scope.autocomplete.getPlace().formatted_address;
                    var location = $scope.autocomplete.getPlace().geometry.location;
                    var placeObj = $scope.autocomplete.getPlace();
                    obj.lat = location.lat();
                    obj.lon = location.lng();
                    placeObj.address_components.forEach(function (item) {
                         for(i=0; i<item.types.length; i++) {
                              if(item.types[i] =='locality'){
                                   obj.city = item.long_name ? item.long_name : "";
                              }
                              if(item.types[i] =='country'){
                                   obj.country = item.long_name ? item.long_name : "";
                              }
                              if(item.types[i] =='administrative_area_level_1'){
                                   obj.state = item.long_name ? item.long_name : "";
                              }
                         }
                    });
                    //console.log("===========");
                    $state.go('anon.search.list', {message : obj});
                    //$state.go("user.dashboard", {message:serverMsg});
               } else {
                    //console.log("===========");
                    $scope.isRequired = true;
               }
          } else {
               $scope.isRequired = true;
          }
     }

     $scope.playVideo = function () {
          var modalInstance = $uibModal.open({
               //animation: $ctrl.animationsEnabled,
               ariaLabelledBy: 'modal-title',
               ariaDescribedBy: 'modal-body',
               templateUrl: '/elements/videoPopup.html',
               controller: 'ModalInstanceController',
               resolve: {
                    items : $sce.trustAsResourceUrl('https://www.youtube.com/embed/67Z6cGQIUTQ')
               }
          });
          modalInstance.result.then(function (selectedItem) {

          }, function () {

          });
     }

     $scope.dispalyDuration = function () {
          $scope.showDuration = true;
     }

     angular.element('#startDate').datepicker({
               //beforeShow: customRangeStart,
               minDate: new Date(),
     });

     // $scope.watch(
     //      function () {
     //           return $scope.ctrl.fromTime;
     //      },
     //      function (old, newVal) {
     //           console.log(old+"======"+newVal);
     //      }
     // );

     angular.element('#endDate').datepicker({
               beforeShow: customRange,
     });

     $scope.fromDate = getDate();
     $scope.toDate = getDate(7);

     // $scope.$watch('fromDate', function (newValue, oldValue, scope) {
     //       console.log(newValue+"======"+oldValue);
     //      //Do anything with $scope.letters
     // });

     $scope.submitNewsletter = function(){
          $AccountService.newsletter($scope.email,function(response){
               var serverMsg;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
                    //console.log($scope.serverMsg )
               }
          });
     }

     //
     $scope.gotoAnchor = function(x) {
          var newHash = 'anchor' + x;
          if ($location.hash() !== newHash) {
               $location.hash('anchor' + x);
          } else {
               $anchorScroll();
          }
     };

     $scope.gotoTop = function(){
          $window.scrollTo(0, 0);
          }

}

},{}],7:[function(require,module,exports){
/**--------------------------------------------------------------------------
Name                   : InfoController
Description            :get data from autocomplete address fields
--------------------------------------------------------------------------*/

module.exports = function($scope) {

		  $scope.lat = undefined;
		  $scope.lng = undefined;
	       $scope.city = undefined;
            $scope.country = undefined;
		  $scope.vehicle = {};


		  $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
			  var location = $scope.autocomplete.getPlace().geometry.location;
			  var add = $scope.autocomplete.getPlace();

			  $scope.lat = location.lat();
			  $scope.lng = location.lng();
			  $scope.vehicle.lat= $scope.lat;
			  $scope.vehicle.lng= $scope.lng;
				add.address_components.forEach(function (item) {

                       for(i=0;i<item.types.length;i++)
                       {
                       	if(item.types[i] =='locality'){
					  $scope.city=item.long_name;
					  $scope.vehicle.cityname= $scope.city;
					}
						if(item.types[i] =='country'){
					  $scope.country=item.long_name;
					  $scope.vehicle.country= $scope.country;
					}
					if(item.types[i] =='administrative_area_level_1'){
						$scope.state =item.long_name;
					 $scope.vehicle.state= $scope.state;
					}


					}

				});
			  $scope.$apply();
			});

			$scope.saveInfo=function(vehicle){
				console.log(vehicle);
			}

//for car features

   //for driver details





		  }

},{}],8:[function(require,module,exports){
/**--------------------------------------------------------------------------
Name                   : DashboardController
Description            : use to authenticate the navigation item & logout functionality
--------------------------------------------------------------------------*/

module.exports =  function($scope, $rootScope, $state, $stateParams) {

     /**   Displaying flash message
     -----------------------------------------------*/
     if($stateParams.message != null) {
          console.log($stateParams.message);
          $scope.serverMsg = $stateParams.message;
     }

     $scope.saveCarInfo = function (carInfo) {
          console.log(carInfo);
     }

     $scope.reportSave = function(){
           console.log($scope.report);

     }

}

},{}],9:[function(require,module,exports){
module.exports =  function ($uibModalInstance, $scope, items ) {

     $scope.videoSrc = items;

     $scope.ok = function (obj) {
          $uibModalInstance.close(true);
     };

     $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
     };

}

},{}],10:[function(require,module,exports){
module.exports =  function ($uibModalInstance, $scope, items, VehicleService,$localStorage, $location) {

     /** initialise paymentObj with informations */
     $scope.paymentObj = items;
     
     /** use for get the fee */
     $scope.setFee= function (fee) {
          $scope.paymentObj.fee = fee;
     }

     /** use for location */
     $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
          if($scope.paymentObj.autocomplete && $scope.paymentObj.autocomplete.getPlace()) {
               var location = $scope.paymentObj.autocomplete.getPlace().geometry.location;
               var add = $scope.paymentObj.autocomplete.getPlace();
               $scope.paymentObj.location = add.formatted_address;
               $scope.paymentObj.lat = location.lat();
               $scope.paymentObj.lon = location.lng();
          }
          $scope.$apply();
     });

     /** Function to initialize the Payment **/
     $scope.paypal = function(){
          var obj = {};
          var urlObj = {};

          if($scope.paymentObj.location){
               obj.location = $scope.paymentObj.location;
               obj.fee = $scope.paymentObj.fee;
               obj.deliveryType = 'CAR_LOCATION';
          }
          if($scope.paymentObj.guestLocation){
               obj.location = $scope.paymentObj.location
               obj.lat = $scope.paymentObj.lat
               obj.lon = $scope.paymentObj.lon
               obj.fee = $scope.paymentObj.fee;
               obj.deliveryType = 'GUEST_LOCATION';
          }
          if($scope.paymentObj.airport){
               obj.location =  $scope.paymentObj.airport;
               obj.fee = $scope.paymentObj.fee;
               obj.deliveryType = 'AIRPORT_LOCATION';
          }
          obj.startDate = $scope.paymentObj.startDate;
          obj.endDate = $scope.paymentObj.endDate;
          obj.price = $scope.paymentObj.price;
          obj.vehicleName = $scope.paymentObj.vehicleName;
          obj.vehicleId = $scope.paymentObj.vehicleId;
          urlObj.price = obj.price;
          urlObj.specifications = $scope.paymentObj.specifications;

          VehicleService.paypal(urlObj, function(response){
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $localStorage.paymentObj = obj;
                    window.location.href = response.result;
               }
          });
     }

     /** Use for Rendering Rating */
     $scope.rating = 1;
     $scope.isReadonly = true;
     $scope.rateFunction = function(rating) {
          $scope.paymentObj.rating = rating;
     };

     /** Use for saving reviews */
     $scope.saveReview  = function(obj){
          if(obj.comment){
               obj.comment = obj.comment;
          }
          obj.userId = $scope.paymentObj.userId;
          obj.rating = $scope.paymentObj.rating ? $scope.paymentObj.rating : 1;
          obj.vehicleId = $scope.paymentObj.vehicleId;
          VehicleService.review(obj,function(response){
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.ok("Hello");
               }
          });
     }

     /** Use for Closing Modal */
     $scope.ok = function (obj) {
          $uibModalInstance.close(true);
     };

     /** Use for Closing Modal */
     $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
     };

}

},{}],11:[function(require,module,exports){
module.exports =  function ($uibModalInstance,items,$scope, VehicleService) {

     $scope.referObj = items;

     $scope.sendEmailReferral = function(){
          if($scope.referObj && $scope.referObj.email && Object.keys($scope.referObj.email).length) {
               VehicleService.sendReferrals($scope.referObj, function (response) {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    if(response.resStatus == "error") {
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.serverMsg = serverMsg;
                    }
               });
          }
     }

     $scope.ok = function (obj) {
          $uibModalInstance.close(true);
     };

     $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
     };
}

},{}],12:[function(require,module,exports){
module.exports =  function ($uibModalInstance,items,$scope, VehicleService,$rootScope,$timeout,$state,$uibModal,$filter) {

     angular.element('#datePickerSnoozed').datepicker({
        //beforeShow: customRangeStart,
               minDate: new Date(),
     });
     /** function for get date **/

       var getDate = function (days) {
                      var today = new Date();
                      if(days) {
                           today.setDate(today.getDate() + days);
                      }
                      var dd = today.getDate();
                      var mm = today.getMonth()+1; //January is 0!
                      var yyyy = today.getFullYear();

                      if(dd<10) {
                           dd='0'+dd
                      }

                      if(mm<10) {
                           mm='0'+mm
                      }

                      return mm+'/'+dd+'/'+yyyy;
       }

       function customRange(input){
            return {
                 minDate: (input.id == "endDate" ? angular.element("#startDate").datepicker("getDate") : new Date())
            };
       }

       $scope.snoozedDate = getDate();
       angular.element('#datePickerSnoozedCancel').datepicker({
            minDate: new Date(),
       });

 //*********************snoozed date end ********************//

     $scope.statusObj = items;
//console.log($scope.statusObj);return;

     /** function for hude flash message after 5 second **/
     var hideFlash = function(){
          $timeout(function(){
               $scope.statusMsg = false;
               console.log("changed");
          }, 5000);
     }

/**----------- function for Update snnozed Status -----------------------**/
/**---------------------------------------------------------------------**/
     $scope.updateSnooze = function(endDate) {
              var obj = obj ||  {} ;
              obj.snozzedDate = endDate;
              obj._id = $scope.statusObj.vehicleId;
              obj.listingStatus = $scope.statusObj.listingStatus;
            VehicleService.update (obj, function (response) {
               $scope.statusMsg = true;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
                    hideFlash();
               } else  {
                serverMsg = {resStatus : response.resStatus, msg: response.msg}
                 $scope.serverMsg = serverMsg;

              }
             hideFlash();
         });
      }
      $scope.updateCancelSnooze = function(status,enddate) {
              var obj = obj ||  {} ;
              obj.snozzedDate =  enddate ? enddate : " ";
              obj._id = $scope.statusObj.vehicleId;
              obj.listingStatus = status;

            VehicleService.update (obj, function (response) {
               $scope.statusMsg = true;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
                    hideFlash();
               } else  {
                serverMsg = {resStatus : response.resStatus, msg: response.msg}
                 $scope.serverMsg = serverMsg;
                 $scope.cancel();
              }
             hideFlash();
         });
      }

     /**----------- function for Unlisted  Status -----------------------**/
     $scope.unlistShow=false;
     $scope.snoozedate = $scope.statusObj.snozzedDate ? $filter('date')($scope.statusObj.snozzedDate, 'MM/dd/yyyy') : '';
       $scope.nextModel = function(modeChecked){
              $scope.cancel();
            if(modeChecked == 'TEMPORARY'){

                 var modalInstance = $uibModal.open({
                      //animation: $ctrl.animationsEnabled,
                      ariaLabelledBy: 'modal-title',
                      ariaDescribedBy: 'modal-body',
                      templateUrl: 'TEMPORARY.html',
                      controller: 'ModelListStatusController',
                      controllerAs: '$ctrl',
                      resolve: {
                           items: function () {
                                return $scope.statusObj;
                           }
                      }
                 });
                 modalInstance.result.then(function (selectedItem) {
                 }, function () {
                 }); return;
            }else if(modeChecked == 'CAR_UNAVAILABLE'){
                 var modalInstance = $uibModal.open({
                      //animation: $ctrl.animationsEnabled,
                      ariaLabelledBy: 'modal-title',
                      ariaDescribedBy: 'modal-body',
                      templateUrl: 'CAR_UNAVAILABLE.html',
                      controller: 'ModelListStatusController',
                      controllerAs: '$ctrl',
                      resolve: {
                           items: function () {
                                return $scope.statusObj;
                           }
                      }
                });
                modalInstance.result.then(function (selectedItem) {
                }, function () {
                }); return;
            }else if(modeChecked == 'INSURANCE_CONCERNS'){
                 var modalInstance = $uibModal.open({
                     //animation: $ctrl.animationsEnabled,
                     ariaLabelledBy: 'modal-title',
                     ariaDescribedBy: 'modal-body',
                     templateUrl: 'INSURANCE_CONCERNS.html',
                     controller: 'ModelListStatusController',
                     controllerAs: '$ctrl',
                     resolve: {
                          items: function () {
                                return $scope.statusObj;
                          }
                     }
               });
               modalInstance.result.then(function (selectedItem) {
               }, function () {
               }); return;
            }
            else if(modeChecked == 'INSUFFICIENT_EARNINGS'){
                 var modalInstance = $uibModal.open({
                     //animation: $ctrl.animationsEnabled,
                     ariaLabelledBy: 'modal-title',
                     ariaDescribedBy: 'modal-body',
                     templateUrl: 'INSUFFICIENT_EARNINGS.html',
                     controller: 'ModelListStatusController',
                     controllerAs: '$ctrl',
                     resolve: {
                          items: function () {
                                return $scope.statusObj;
                          }
                     }
               });
               modalInstance.result.then(function (selectedItem) {
               }, function () {
               }); return;
            }
            else if(modeChecked == 'TIME_CONSUMING'){
                 var modalInstance = $uibModal.open({
                     //animation: $ctrl.animationsEnabled,
                     ariaLabelledBy: 'modal-title',
                     ariaDescribedBy: 'modal-body',
                     templateUrl: 'TIME_CONSUMING.html',
                     controller: 'ModelListStatusController',
                     controllerAs: '$ctrl',
                     resolve: {
                          items: function () {
                                return $scope.statusObj;
                          }
                     }
               });
               modalInstance.result.then(function (selectedItem) {
               }, function () {
               }); return;
            }else if(modeChecked == 'NEGATIVE_EXPERIENCE'){
                 var modalInstance = $uibModal.open({
                     //animation: $ctrl.animationsEnabled,
                     ariaLabelledBy: 'modal-title',
                     ariaDescribedBy: 'modal-body',
                     templateUrl: 'NEGATIVE_EXPERIENCE.html',
                     controller: 'ModelListStatusController',
                     controllerAs: '$ctrl',
                     resolve: {
                          items: function () {
                                return $scope.statusObj;
                          }
                     }
               });
               modalInstance.result.then(function (selectedItem) {
               }, function () {
               }); return;
            }else{
                 var modalInstance = $uibModal.open({
                     //animation: $ctrl.animationsEnabled,
                     ariaLabelledBy: 'modal-title',
                     ariaDescribedBy: 'modal-body',
                     templateUrl: 'OTHER.html',
                     controller: 'ModelListStatusController',
                     controllerAs: '$ctrl',
                     resolve: {
                          items: function () {
                                return $scope.statusObj;
                          }
                     }
               });
               modalInstance.result.then(function (selectedItem) {
               }, function () {
               }); return;
            }
       }

//******************update unliststatus***********************//

       $scope.updateUnlistSts = function(unliststatus,feedback) {
               var obj = obj ||  {} ;
               obj.listingStatus = unliststatus;
               obj._id = $scope.statusObj.vehicleId;
               obj.unlistedStatus = feedback ? feedback : '';
             VehicleService.update (obj, function (response) {
                $scope.statusMsg = true;
                if(response.resStatus == "error") {
                     serverMsg = {resStatus : response.resStatus, msg: response.msg};
                     $scope.serverMsg = serverMsg;
                     hideFlash();
                } else  {
                 serverMsg = {resStatus : response.resStatus, msg: response.msg}
                  $scope.serverMsg = serverMsg;
                  $scope.cancel();

               }
              hideFlash();
          });
       }


 /**---------------------------------------------------------------------**/


     $scope.ok = function (obj) {
          $uibModalInstance.close(true);
     };

     $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
          $state.reload();
     };

}

},{}],13:[function(require,module,exports){

module.exports =  function ($state,$uibModalInstance, $scope,items,VehicleService,$localStorage,$location,$SessionService) {
// save massage
$scope.messageObj = items;

$scope.SendMsg = function(obj) {
     obj.to = $scope.messageObj.toUserId._id;
     console.log(obj.to );
     obj.from = $SessionService.user()._id;
      VehicleService.addMsg (obj, function (response) {
           if(response.resStatus == "error") {
                serverMsg = {resStatus : response.resStatus, msg: response.msg};
                $scope.serverMsg = serverMsg;
           } else if(response.resStatus == "success") {
                serverMsg = {resStatus : response.resStatus, msg: response.msg};
                $scope.ok('hell');
                $state.go('user.message', {message: serverMsg});
                }
      });
};
// save model
$scope.ok = function (obj) {
     $uibModalInstance.close(true);
};
// clear model
$scope.cancel = function () {
     $uibModalInstance.dismiss('cancel');
};

}

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
/**--------------------------------------------------------------------------
Name                   : DashboardController
Description            : use to authenticate the navigation item & logout functionality
--------------------------------------------------------------------------*/

module.exports = function($timeout,$scope, $state, $stateParams, $SessionService, VehicleService,$uibModal,NgTableParams,$templateCache, $filter) {
     if($SessionService.user()._id) {
          VehicleService.getTransactions($SessionService.user()._id, function(response){
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.orders = response.result;
                    console.log($scope.orders);
                    $scope.ordersTable = new NgTableParams({}, {dataset: $scope.orders});
                    //console.log($scope.ordersTable);
               }
          });
     }

     //for checkAvailability popup
     $scope.review = function(userId,vehicleId){
          var modalInstance = $uibModal.open({
               //animation: $ctrl.animationsEnabled,
               ariaLabelledBy: 'modal-title',
               ariaDescribedBy: 'modal-body',
               templateUrl: 'review.html',
               controller: 'ModalPaymentController',
               controllerAs: '$ctrl',
               resolve: {
                    items: function () {
                         return {userId:userId,vehicleId:vehicleId};
                    }
               }
          });
          modalInstance.result.then(function (msg) {
               $scope.statusMsg = true;
               $scope.serverMsg = {resStatus : "success", "msg" : "Review has been added"};
               hideFlash();
          }, function () {
               //$log.info('Modal dismissed at: ' + new Date());
          }); return;
     }

     /** function for hude flash message after 5 second **/
     var hideFlash = function(){
          $timeout(function(){
               $scope.statusMsg = false;
               console.log("changed");
          }, 5000);
     }


     $scope.massage = function(userId,toUserId,name){
          //console.log(toUserId._id);
          var modalInstance = $uibModal.open({
               //animation: $ctrl.animationsEnabled,
               ariaLabelledBy: 'modal-title',
               ariaDescribedBy: 'modal-body',
               templateUrl: 'msg.html',
               controller: 'ModalSendMessage',
               controllerAs: '$ctrl',
               resolve: {
                    items: function () {
                         return {userId:userId,toUserId:toUserId,name:name};
                    }
               }
          });
          modalInstance.result.then(function (msg) {
               $scope.statusMsg = true;
               $scope.serverMsg = {resStatus : "success", "msg" : "Massage has been send"};
               hideFlash();

          }, function () {
               //$log.info('Modal dismissed at: ' + new Date());
          }); return;
     }

     var dynamicTemp = function (order) {
          var date = order.transactionId.timeStamp;
          var orderDate = $filter('date')(new Date(), 'M/d/yy h:mm');
          console.log(order);
          var data = [
               order.vehicleId.specifications.make + " " + order.vehicleId.specifications.model + " " + order.vehicleId.specifications.year, order.transactionId.amount.toString(), order.transactionId.amount.toString()

          ]
          var dd = {
               content: [
                    //    {
                    //   text: 'Invoice',
                    //   alignment: 'left',
                    //   style: 'h5'
                    // },
                    {
                         text: 'Order # '+ order.transactionId.invoice,
                         alignment: 'center',
                         style: 'h5'
                    },
                    '\n\n',
                    {
                         alignment: 'justify',
                         columns: [
                              {
                                   text: 'Billed To:\nMobilyte INDIA.Tech.Pvt.Ltd  \nE-40 \n Phase-8 \n Mohali, Punjab 160035'
                              },
                              {
                                   text: 'Shipped To:\n ' + order.userId.fullname + '\n 1234 Main \n Apt. 4B \n Springfield, ST 54321'
                              }
                         ]
                    },
                    '\n\n',
                    {
                         alignment: 'justify',
                         columns: [
                              {
                                   text: 'Payment Method: \n ' + order.transactionId.paymentType + '\n' + order.userId.email
                              },
                              {

                                   text: 'Order Date: \n' +  orderDate
                              }
                         ]
                    },
                    '\n\n',
                    {
                         style: 'demoTable',
                         table: {
                              widths: ['*', '*', '*'],
                              body: [
                                   [{text: 'Item', style: 'tableheader'}, {text: 'Price($)', style: 'tableheader'},
                                   {text: 'Total($)', style: 'tableheader'}
                              ],
                              data
                         ]
                    }
               }
          ],
          styles: {
               tableheader: {
                    fontSize: 18,
                    bold: true,
               },
               h5: {
                    fontSize: 30,
                    bold: true,
               },
               bigger: {
                    fontSize: 20,
                    italics: true,
               }
          },
          defaultStyle: {
               columnGap: 20,
          }
     };
     pdfMake.createPdf(dd).download();
}

$scope.downloadPdf = function(order) {
     dynamicTemp(order);
};

}

},{}],16:[function(require,module,exports){
/**--------------------------------------------------------------------------
Name                   : ReferraController
Description            :
--------------------------------------------------------------------------*/

module.exports = function($scope, $state, $stateParams, $SessionService, VehicleService,$uibModal,$location) {

     if($state.current.name == "user.referrals"){
          var getReferralCode= function(){
               $scope.referCode = $SessionService.user()._id;
               $scope.referCodeUrl = $location.protocol() + '://'+ $location.host() +':'+  $location.port()   + '/#/user/referral/Invitation?referCode=' + $scope.referCode;
                 //console.log($scope.referCodeUrl);
          }();
     }

     if($state.current.name == "user.referralInvitation"){
          var getReferralData = function(){
               /** Function to get Referral Info */
               VehicleService.referralData($stateParams.referCode, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    } else if(response.resStatus == "success") {
                         $scope.DataModel = response.result;
                         $scope.DataModel.code = $stateParams.referCode;
                         if (response.result.profile.path == undefined) {
                              $scope.DataModel.profilePhoto = response.result.profile.photo;
                         } else {
                              $scope.DataModel.profilePhoto = response.result.profile.path + response.result.profile.photo;
                         }
                         //$scope.DataModel.profilePhoto = "/media/u_default.png";
                    }
               });
          }();
     }

     $scope.emailFormPopup=function(){
          var modalInstance = $uibModal.open({
               ariaLabelledBy: 'modal-title',
               ariaDescribedBy: 'modal-body',
               templateUrl: 'emailpopup.html',
               controller: 'ModalReferralController',
               controllerAs: '$ctrl',
               resolve: {
                    items: function () {
                         return { referCode : $scope.referCode, referCodeUrl : $scope.referCodeUrl};
                    }
               }
          });
          modalInstance.result.then(function (obj) {

          }, function () {
               //$log.info('Modal dismissed at: ' + new Date());
          });
     }

}

},{}],17:[function(require,module,exports){
/**--------------------------------------------------------------------------
Name                   : SearchController
Description            :
--------------------------------------------------------------------------*/

module.exports = function( $scope,$stateParams,VehicleService,$state, $timeout, $location) {

     var serverMsg;
     $scope.myCars = $scope.myCars || [];

     function customRange(input) {
          return {
               minDate: (input.id == "endDate" ? angular.element("#startDate").datepicker("getDate") : new Date())
          };
     }

     // To set maxdate in startdate
     function customRangeStart(input){
          return {
               maxDate:(input.id == "startDate" ?angular.element("#endDate").datepicker("getDate") : null)
          };
     }


     angular.element('#datetimepicker4').datepicker({
          beforeShow: customRangeStart,
          minDate: new Date(),
     });

     angular.element('#datetimepicker5').datepicker({
          beforeShow: customRange,
     });

     $scope.openFromDatepicker = function () {
          angular.element("#datetimepicker5").focus();
     }

     $scope.openToDatepicker = function () {
          angular.element("#datetimepicker4").focus();
     }


     /*** search api **/
     var serviceApi = {

          initQueryParameters : function (){
               $scope.SearchParams = {
                    'transmission' : '',
                    'feature' : '',
                    'minPrice' : '',
                    'maxPrice' : '',
                    'maxDistance' : '',
                    'minDistance' : '',
                    'sort' : '',
                    'vehicleType' : '',
                    'make' : '',
                    'model' : '',
                    'year' : '',
                    'color' : '',
                    'fromDate' : '',
                    'toDate' : '',
                    'fromTime' : '',
                    'toTime' : '',
                    'lat' : '',
                    'lon' : '',
                    'city' : '',
                    'state' : '',
                    'country' : '',
                    'location' : '',
               };
          },

          initRangeSliders : function () {
               /** Range slider config */
               $scope.priceRangeSlider = {
                    minValue: 0,
                    maxValue: 1500,
                    options: {
                         floor: 0,
                         ceil: 1500,
                         step: 5
                    }
               };
               $scope.distanceRangeSlider = {
                    minValue: 0,
                    maxValue: 1500,
                    options: {
                         floor: 0,
                         ceil: 1500,
                         step: 5
                    }
               };
               $scope.slider_callbacks = {
                    value: 100,
                    options: {
                         onStart: function () {
                              // function to execute after slider reach near the end
                         },
                         onChange: function () {
                              // function to execute on change of slider
                              $scope.SearchParams.minPrice = $scope.priceRangeSlider.minValue;
                              $scope.SearchParams.maxPrice = $scope.priceRangeSlider.maxValue;
                              $scope.SearchParams.minDistance = $scope.distanceRangeSlider.minValue;
                              $scope.SearchParams.maxDistance = $scope.distanceRangeSlider.maxValue;
                         },
                         onEnd: function () {
                              // function to execute after slider interaction ends
                              $scope.searchList();
                         }
                    }
               };
          },

          serialize : function(obj) {
               var str = [];
               for(var p in obj)
               if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
               }
               return str.join("&");
          },

          updateQuery : function() {
               for (var key in $scope.SearchParams) {
                    if ($scope.SearchParams[key] != '') {
                         $location.search(key, $scope.SearchParams[key]);
                    } else {
                         // remove empty filters
                         $location.search(key, null);
                    }
               }
          },

          getQuery : function (queryStr) {
               var qs = $location.search();
               for (var key in $scope.SearchParams) {
                    if (key in qs) {
                         $scope.SearchParams[key] = qs[key];
                    }
               }
          },

          renderMap : function(cities) {
               //if($state.current.name == 'anon.search.map') {
               var mapOptions = {
                    componentRestrictions: {country: "us"},
                    zoom: 4,
                    center: new google.maps.LatLng(41.850033, -87.6500523),
                    mapTypeId: google.maps.MapTypeId.TERRAIN
               }

               $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

               $scope.markers = [];

               var infoWindow = new google.maps.InfoWindow();

               var createMarker = function (info){
                    //console.log(info);
                    var marker = new google.maps.Marker({
                         map: $scope.map,
                         position: new google.maps.LatLng(info.address.lat, info.address.lon),
                         title: info.specifications.make+ " - " + info.specifications.model  + " "+info.specifications.year,
                         vehicleId : info._id,
                         VehiclePhots:info.gallery.photos[0],
                         VehiclePath:info.gallery.path,
                         ridingCost:info.ridingCost
                    });
                    google.maps.event.addListener(infoWindow, 'domready', function() {


                         var iwOuter = $('.gm-style-iw');
                         var iwBackground = iwOuter.prev();
                         var closeDiv = iwOuter.next();
                         closeDiv.addClass('infoWindowClose');
                         iwBackground.children(':nth-child(2)').css({'display' : 'none'});
                         iwBackground.children(':nth-child(2)').addClass('infoWindowBlock');
                         iwBackground.children(':nth-child(3)').addClass('infoWindowBlockArrow');
                         iwBackground.children(':nth-child(4)').css({'display' : 'none'});
                    });


                    google.maps.event.addListener(marker, 'click', function(){
                         infoWindow.setContent("<div class = 'customMapPop'><a href='#/vehicle/detail?refId="+marker.vehicleId+"'>"+"<img  src='"+marker.VehiclePath+marker.VehiclePhots+"'class='img1'>"+"<br><h6>"+marker.title+'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<b>'+'$'+marker.ridingCost+"/Per-Day</b></h6>"+"</a></div>");
                         infoWindow.open($scope.map, marker);
                    });


                    //<a ui-sref="anon.vehicleDetail({refId :id})">
                    $scope.markers.push(marker);
               }

               for (i = 0; i < cities.length; i++){
                    createMarker(cities[i]);
               }

               $scope.openInfoWindow = function(e, selectedMarker){
                    e.preventDefault();
                    google.maps.event.trigger(selectedMarker, 'click');
               }


          },


          listCars : function(queryStr){
               $scope.lodingData = true;
               VehicleService.listCars(queryStr, function (response) {
                    if(response.resStatus == "error") {
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         if(response.result.length){
                              $scope.lodingData = false;
                              $scope.myCars = $scope.myCars.concat(response.result);
                              //$scope.$apply();
                              $scope.SearchParams.offset =  $scope.SearchParams.offset  + response.result.length;
                         }else{
                              $scope.lodingData = true;
                         }
                         if($state.current.name == 'anon.search.map') {
                              $timeout(function () {
                                   serviceApi.renderMap($scope.myCars);
                              }, 1000);
                         }
                    }
               });
          },

          getCarModelsYear : function (brand, model) {
               if(brand) {
                    VehicleService.getCarModelsYear(brand, model, function (response) {
                         if(response.resStatus == "error") {
                              serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         } else if(response.resStatus == "success") {
                              $scope.yearArr = response.result;
                         }
                    });
               }
          },

          getCarModels : function (brand) {
               if(brand) {
                    VehicleService.getCarModels(brand, function (response) {
                         if(response.resStatus == "error") {
                              serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         } else if(response.resStatus == "success") {
                              if(response.result.length && response.result[0].models.length) {
                                   $scope.modelArr = response.result[0].models;
                                   if($scope.SearchParams.model) {
                                        serviceApi.getCarModelsYear($scope.SearchParams.make, $scope.SearchParams.model);
                                   }
                              }
                         }
                    });
               }
          },

          /** Function to get car brands */
          getCarBrands : function () {
               VehicleService.getCarBrands(function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    } else if(response.resStatus == "success") {
                         $scope.makes = response.result;
                         if($scope.SearchParams.make) {
                              serviceApi.getCarModels($scope.SearchParams.make);
                         }
                    }
               });
          }

     };

     $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
          if($scope.autocomplete && $scope.autocomplete.getPlace()) {
               var location = $scope.autocomplete.getPlace().geometry.location;
               var add = $scope.autocomplete.getPlace();
               $scope.SearchParams.location = add.formatted_address;
               $scope.SearchParams.lat = location.lat();
               $scope.SearchParams.lon = location.lng();
               add.address_components.forEach(function (item) {

                    for(i=0;i<item.types.length;i++) {
                         if(item.types[i] =='locality'){
                              $scope.SearchParams.city = item.long_name;
                         }
                         if(item.types[i] =='country'){
                              $scope.SearchParams.country = item.long_name;
                         }
                         if(item.types[i] =='administrative_area_level_1'){
                              $scope.SearchParams.state = item.long_name;
                         }
                    }
               });
          }
          $scope.$apply();
     });
     // $scope.myFunc = function(vehicleRefId){
     //           VehicleService.view (vehicleRefId, function (response) {
     //                if(response.resStatus == "error") {
     //                     serverMsg = {resStatus : response.resStatus, msg: response.msg};
     //                     $scope.serverMsg = serverMsg;
     //                } else if(response.resStatus == "success") {
     //                     $scope.DataModel = response.result;
     //                     //console.log($scope.DataModel);
     //                     //createMarker(response.result.address);
     //                     //$state.go("user.dashboard", {message: serverMsg});
     //                }
     //           });
     //      };




     serviceApi.initRangeSliders();
     serviceApi.initQueryParameters();

     /** Checking Search Parameters **/
     $scope.searchList = function () {
          if($scope.SearchParams.make) {
               serviceApi.getCarModels($scope.SearchParams.make);
          }
          serviceApi.updateQuery();
          var queryStr = $scope.SearchParams?serviceApi.serialize($scope.SearchParams) : "";
          serviceApi.listCars(queryStr);
     };

     /** Checking Search Parameters **/
     $scope.searchVehicle = function() {
          serviceApi.updateQuery();
          var queryStr = $scope.SearchParams?serviceApi.serialize($scope.SearchParams) : "";
          serviceApi.listCars(queryStr);
     }

     $scope.clearFilters = function() {
          serviceApi.initRangeSliders();
          serviceApi.initQueryParameters();
          serviceApi.updateQuery();
          var queryStr = $scope.SearchParams?serviceApi.serialize($scope.SearchParams) : "";
          serviceApi.listCars(queryStr);
     }

     $scope.lodingScrollData = function(){
          var queryStr = $scope.SearchParams ? serviceApi.serialize( $scope.SearchParams ) : "";
          serviceApi.listCars(queryStr);
     }


     if($stateParams.message) {
          $scope.SearchParams = $stateParams.message;
          serviceApi.updateQuery();
     }

     serviceApi.getQuery();
     if($scope.SearchParams) {
          $scope.SearchParams.limit = 10;
          $scope.SearchParams.offset = 0;
     }

     var queryStr = $scope.SearchParams ? serviceApi.serialize( $scope.SearchParams ) : "";
     serviceApi.listCars(queryStr);
     serviceApi.getCarBrands();
}

},{}],18:[function(require,module,exports){


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

},{}],19:[function(require,module,exports){
/**--------------------------------------------------------------------------
Name                   : DashboardController
Description            : use to authenticate the navigation item & logout functionality
--------------------------------------------------------------------------*/

module.exports = function($scope, $state, $stateParams, $SessionService, VehicleService, $timeout) {
     $scope.events=[] ;
     $scope.eventSources1 = [
  {
    "title": "All Day Event",
    "start": "2016-09-01"
  },
  {
    "title": "Long Event",
    "start": "2016-09-07",
    "end": "2016-09-10"
  },
  {
    "id": "999",
    "title": "Repeating Event",
    "start": "2016-09-09T16:00:00-05:00"
  },
  {
    "id": "999",
    "title": "Repeating Event",
    "start": "2016-09-16T16:00:00-05:00"
  },
  {
    "title": "Conference",
    "start": "2016-09-11",
    "end": "2016-09-13"
  },
  {
    "title": "Meeting",
    "start": "2016-09-12T10:30:00-05:00",
    "end": "2016-09-12T12:30:00-05:00"
  },
  {
    "title": "Lunch",
    "start": "2016-09-12T12:00:00-05:00"
  },
  {
    "title": "Meeting",
    "start": "2016-09-12T14:30:00-05:00"
  },
  {
    "title": "Happy Hour",
    "start": "2016-09-12T17:30:00-05:00"
  },
  {
    "title": "Dinner",
    "start": "2016-09-12T20:00:00"
  },
  {
    "title": "Birthday Party",
    "start": "2016-09-13T07:00:00-05:00"
  },
  {
    "title": "Click for Google",
    "url": "http://google.com/",
    "start": "2016-09-28"
  }
];
     /* config object */
$timeout(function () {
     $scope.eventSources = [];
     $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };
}, 2000);

}

},{}],20:[function(require,module,exports){
/**--------------------------------------------------------------------------
Name                   : VehicleController
Description            : Use to add & update vehicle Info
Author :               : Sunny Chauhan
--------------------------------------------------------------------------*/

module.exports = function($timeout, $scope, $rootScope, $stateParams, $state, $localStorage, $location, $http, VehicleService, $SessionService, $AccountService, $uibModal, $log,NgTableParams) {

     angular.element('#datePickerSnoozed').datepicker({
          minDate: new Date(),
     });

     angular.element('#datePickerSnoozedCancel').datepicker({
          minDate: new Date(),
     });

     $scope.airportsArr = $scope.airportsArr || [];

     //$scope.checkFeaturesArr = $scope.checkFeaturesArr || [];

     angular.element('#datetimepicker6').datepicker();

     /** Use for Active & Inactive Link in list car Navigation */
     $scope.linkArr = [];
     if($state.current.name == 'user.listcarIntro') {
          $scope.linkArr = [];
     } else if($state.current.name == 'user.listcarAvailability') {
          $scope.linkArr = ['Available'];
     } else if($state.current.name == 'user.listcarDetails') {
          $scope.linkArr = ['Available', 'Detail'];
     } else if($state.current.name == 'user.listcarPhotos') {
          $scope.linkArr = ['Available','Detail','Photo'];
     }  else if($state.current.name == 'user.listcarPublish') {
          $scope.linkArr = ['Available','Detail','Photo', 'Publish'];
     }

     var BookingId = ($stateParams.bookingId) ? $stateParams.bookingId : "";

     $scope.statusMsg = false;

     /** configuration For slider  */
     $scope.myInterval = 5000;
     $scope.noWrapSlides = false;
     $scope.active = 0;

     /** use to retrieve the session user id */
     var userId = ($SessionService.user()) ? $SessionService.user()._id : "";

     /** Checking if current state is child of some user.liscarLanding*/
     var isParent = ($state.current.parent && $state.current.parent == 'user.liscarLanding') ? true : false;

     /** Declaring flash message variable*/
     var serverMsg = {};

     /** Check if vehicle Id exist */
     $scope.vehicleRefId = (Object.keys($location.search()).length) ? $location.search().refId : "";

     $scope.vehicle1 = {};
     $scope.deliveryObj = [];

     /** Function to get car brands */
     var getCarBrands = function () {
          VehicleService.getCarBrands(function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
               } else if(response.resStatus == "success") {
                    $scope.makeArr = response.result;
                    if($scope.vehicleRefId) {
                         getCarModels($scope.DataModel.specifications.make);
                    }
               }
          });
     }
      //check airport

     var checkedAirports = function (airportsArr) {
          var indexArr = [];
          if (airportsArr) {
               for (var airport in airportsArr) {
                    var obj = {};
                    obj.id = airportsArr[airport].id._id;
                    obj.fee = airportsArr[airport].fee.toString();
                    $scope.airportsArr.push(obj);
                    for(var airportIndex in $scope.airports) {
                         if (airportsArr[airport].id._id  == $scope.airports[airportIndex]._id ) {
                              indexArr.push(airportIndex);
                         }
                    }
               }
          }
          if(indexArr) {
               for(newIndex in indexArr) {
                    var setIndex = indexArr[newIndex];
                    $scope.DataModel.delivery.airports[setIndex] = $scope.DataModel.delivery.airports[setIndex] || {};
                    $scope.DataModel.delivery.airports[setIndex].checked = '1';
                    $scope.DataModel.delivery.airports[setIndex].fee = '0';
               }
          }
     }
      //check feature

//      var checkedFeature =  function (featureArr) {
//           var indexArr = [];
//           if (featureArr) {
//                console.log(featureArr)
//                for(var feature=0; feature <= featureArr.length; feature++ ){
//                      $scope.checkFeaturesArr.push(featureArr[feature]);
//                      console.log($scope.checkFeaturesArr);
//                }
//                // for (var feature in featureArr) {
//                //      $scope.checkFeaturesArr.push(feature);
//                //      for(var featureIndex in $scope.checkFeaturesArr) {
//                //           console.log(featureIndex);
//                //           // if (featureArr[feature]  == $scope.checkFeaturesArr[featureIndex] ) {
//                //           //      indexArr.push(featureIndex);
//                //           //      console.log(indexArr);
//                //           // }
//                //      }
//                // }
//           }
//           if(indexArr) {
//                for(newIndex in indexArr) {
//                     var setIndex = indexArr[newIndex];
//                     $scope.DataModel.details.features[setIndex] = $scope.DataModel.details.features[setIndex] || [];
//                     $scope.DataModel.details.features[setIndex].checked = '1';
//                }
//      }
// }
     /** Function to get car brands */
     var getAirports = function () {
          VehicleService.getAirports(function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
               } else if(response.resStatus == "success") {
                    $scope.airports = response.result;
                    //$scope.DataModel.delivery.airports[0].id = '1';
                    var airportsArr = $scope.DataModel.delivery.airports || [];
                    checkedAirports(airportsArr);
                    // var indexArr = [];
                    // if (airportsArr) {
                    //      for (var airport in airportsArr) {
                    //           var obj = {};
                    //           obj.id = airportsArr[airport].id._id;
                    //           obj.fee = airportsArr[airport].fee.toString();
                    //           $scope.airportsArr.push(obj);
                    //           for(var airportIndex in $scope.airports) {
                    //                if (airportsArr[airport].id._id  == $scope.airports[airportIndex]._id ) {
                    //                     indexArr.push(airportIndex);
                    //                }
                    //           }
                    //      }
                    // }
                    // if(indexArr) {
                    //      for(newIndex in indexArr) {
                    //           var setIndex = indexArr[newIndex];
                    //           $scope.DataModel.delivery.airports[setIndex] = $scope.DataModel.delivery.airports[setIndex] || {};
                    //           $scope.DataModel.delivery.airports[setIndex].checked = '1';
                    //      }
                    // }
               }
          });
     }

     /** Function to get car models */
     var getCarModels = function (brand) {
          if(brand) {
               VehicleService.getCarModels(brand, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    } else if(response.resStatus == "success") {
                         if(response.result.length && response.result[0].models.length) {
                              $scope.modelArr = response.result[0].models;
                         } else {
                              $scope.modelArr = [];
                         }
                    }
               });
          } else {
               $scope.modelArr = [];
          }
     }

     /** function to show preview of selected iimages */
     var checkFileSize = function(file, callback){
          var status;
          var img = new Image();
          img.src = window.URL.createObjectURL( file );
          img.onload = function() {
               var width = img.naturalWidth,
               height = img.naturalHeight;
               window.URL.revokeObjectURL( img.src );
               if( (width ==  640 || width >  640) && (height ==  320 || height >  320) ) {
                    callback(true, file);
               }
               else {
                    $scope.myFile = [];
                    alert("Please upload file image of size 640px by 320px or higher");
                    callback(false);
               }
          };
     }

     /** function to show preview of selected iimages */
     var previewImages = function(fileList){
          var anyWindow = window.URL || window.webkitURL;
          for(var i = 0; i < fileList.length; i++){
               if (fileList[i].type.match('image.*')) {
                    checkFileSize(fileList[i], function (status, file) {
                         if(status) {
                              var objectUrl = anyWindow.createObjectURL(file);
                              var clone = "<div class='col-sm-3 previewFiles'><div class='car-img'><img src="+objectUrl+" class='img-responsive' alt='preview'/></div></div>";
                              angular.element(clone).insertBefore(angular.element("#selectIMg"));
                              window.URL.revokeObjectURL(file);
                         }
                    });
               } else {
                    alert("Only Image files are supprted");
                    return false;
               }
          }
     }

     /** function for hude flash message after 5 second **/
     var hideFlash = function(){
          $timeout(function(){
               $scope.statusMsg = false;
          }, 5000);
     }

     /** Function to get attributes of address */
     var getLocationsObj = function () {
          $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
               var location = $scope.autocomplete.getPlace().geometry.location;
               var add = $scope.autocomplete.getPlace();
               $scope.lat = location.lat();
               $scope.lng = location.lng();
               $scope.vehicle.lat= $scope.lat;
               $scope.vehicle.lng= $scope.lng;
               add.address_components.forEach(function (item) {
                    for(i=0;i<item.types.length;i++) {
                         if(item.types[i] =='locality'){
                              $scope.city=item.long_name;
                              $scope.vehicle1.cityname= $scope.city;
                         }
                         if(item.types[i] =='country'){
                              $scope.country=item.long_name;
                              $scope.vehicle1.country= $scope.country;
                         }
                         if(item.types[i] =='administrative_area_level_1'){
                              $scope.state =item.long_name;
                              $scope.vehicle1.state= $scope.state;
                         }
                    }
               });
               $scope.$apply();
          });
     }

     /** function to call when vehicle photos uploaded */
     var uploadComplete = function (imgArr) {
          if (isParent) {
               $state.reload();
          } else {
               $state.go('user.listcarPublish', {refId : $scope.vehicleRefId ,message: {resStatus : "success", msg: "Photo have been updated successfully"}});
          }

     }

     var getvehicleData = function() {
          VehicleService.view ($scope.vehicleRefId, function (response) {

               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {

                    $scope.DataModel = response.result.view;
                    $scope.trips = response.result.trips;

                    if($scope.DataModel.specifications) {
                         if (!$scope.DataModel.name) {
                              $scope.DataModel.name = $SessionService.user().name.first + '\'s ' + $scope.DataModel.specifications.make;
                         }
                         $scope.DataModel.specifications.year = $scope.DataModel.specifications.year.toString();
                         //addres=$scope.DataModel;
                    }

                    if($state.current.name == 'user.liscarLanding.delivery') {
                         getAirports();
                    }

                    if(response.result.view.details){
                         $scope.checkFeaturesArr = (response.result.view.details.features.length) ? response.result.view.details.features : [];
                    }

                    if($scope.DataModel.distance) {
                         $scope.DataModel.distance.day = $scope.DataModel.distance.day.toString();
                         $scope.DataModel.distance.week = $scope.DataModel.distance.week.toString();
                         $scope.DataModel.distance.month = $scope.DataModel.distance.month.toString();
                    }

                    if($scope.DataModel.delivery) {
                         $scope.DataModel.delivery.guestLocation.fee = $scope.DataModel.delivery.guestLocation.fee.toString();
                         $scope.DataModel.delivery.guestLocation.distance = $scope.DataModel.delivery.guestLocation.distance.toString();
                    }

                    /** check if photo uploaded */
                    $scope.isPhotoUploaded = ($scope.DataModel.gallery && $scope.DataModel.gallery.photos.length) ?
                    $scope.DataModel.gallery.photos.length : 0;

                    if($scope.vehicleRefId && $state.current.name == 'user.listcarIntro') {
                         getCarBrands();
                    }
               }
          });
     }

     var tripDeatil = function(id){
          VehicleService.tripView(id, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.trip = response.result;
                    $scope.tripsTable = new NgTableParams({ count: 10 }, {data: $scope.trip});
               }
          });
     };


     var bookingDetail = function(id){
          VehicleService.bookingView(id, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.Details = response.result;
               }
          });
     };

     var getCountry = function () {
          $AccountService.getCountry(function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
               } else if(response.resStatus == "success") {
                    $scope.makeArr = response.result;
               }
          });
     }

     /** Function to get car models */
     var getStates = function (country) {
          if(country) {
               $AccountService.getStates(country, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    } else if(response.resStatus == "success") {
                         if(response.result.length && response.result[0].models.length) {
                              $scope.modelArr = response.result[0].models;
                         } else {
                              $scope.modelArr = [];
                         }
                    }
               });
          } else {
               $scope.modelArr = [];
          }
     }

     var removeByAttr = function(arr, attr, value){
          var i = arr.length;
          while(i--){
               if( arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value ) ){
                         arr.splice(i,1);
                    }
               }
               return arr;
     }

     /** Use to save vehicle Info */
     $scope.saveInfo = function (obj, activeLInk) {
          obj.userId = userId;
          obj.address = obj.address || {};
          if($scope.autocomplete && $scope.autocomplete.getPlace()) {
               obj.address.location = $scope.autocomplete.getPlace().formatted_address;
               var location = $scope.autocomplete.getPlace().geometry.location;
               var placeObj = $scope.autocomplete.getPlace();
               obj.address.lat = location.lat();
               obj.address.lon = location.lng();
               obj.address.geoLocation = {
                    type : 'Point',
                    coordinates : [obj.address.lon, obj.address.lat]
               };
               placeObj.address_components.forEach(function (item) {
                    for(i=0; i<item.types.length; i++) {
                         if(item.types[i] =='locality'){
                              obj.address.city = item.long_name ? item.long_name : "";
                         }
                         if(item.types[i] =='country'){
                              obj.address.country = item.long_name ? item.long_name : "";
                         }
                         if(item.types[i] =='administrative_area_level_1'){
                              obj.address.state = item.long_name ? item.long_name : "";
                         }
                    }
               });
          } else {
               $scope.isRequired = true;
          }
          VehicleService.add (obj, function (response) {
               $scope.statusMsg = true;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
                    hideFlash();
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
                    hideFlash();
                    if(response.result.mobileVerification == false) {
                         $state.go('user.mobileVerification', {refId : response.result.info._id ,message: serverMsg});
                    } else if (response.result.licenseVerification == false){
                         $state.go('user.driverlicense', {refId : response.result.info._id ,message: serverMsg});
                    }else {
                         $state.go('user.listcarAvailability', {refId : response.result.info._id ,message: serverMsg});
                    }
               }
          });
          $scope.autocomplete = " ";
     }

     /** Use to update vehicle Info */
     $scope.updateInfo = function (obj, activeLInk) {

           //obj.details.features = $scope.selection;
          //console.log(obj.details.features+'hello');

          if($scope.color) {
               obj.details.color = $scope.color;
          }
          if($scope.airportsArr){
               obj.delivery.airports = $scope.airportsArr;
          }
          // if($scope.checkFeaturesArr){
          //      obj.details.features =  $scope.checkFeaturesArr;
          // }

          if($scope.autocomplete && $scope.autocomplete.getPlace()) {
               obj.address.location = ($scope.autocomplete.getPlace()) ? $scope.autocomplete.getPlace().formatted_address : "";
               var location = ($scope.autocomplete.getPlace()) ? $scope.autocomplete.getPlace().geometry.location : "";
               var placeObj = ($scope.autocomplete.getPlace())?$scope.autocomplete.getPlace() : "";
               if(location) {
                    obj.address.lat = location.lat();
                    obj.address.lon = location.lng();
                    obj.address.geoLocation = {
                         type : 'Point',
                         coordinates : [obj.address.lon, obj.address.lat]
                    };
                    placeObj.address_components.forEach(function (item) {
                         for(i=0; i<item.types.length; i++) {
                              if(item.types[i] =='locality'){
                                   obj.address.city = item.long_name ? item.long_name : "";
                              }
                              if(item.types[i] =='country'){
                                   obj.address.country = item.long_name ? item.long_name : "";
                              }
                              if(item.types[i] =='administrative_area_level_1'){
                                   obj.address.state = item.long_name ? item.long_name : "";
                              }
                         }
                    });
               }
          } else {
               $scope.isRequired = true;
          }
          obj._id = $scope.vehicleRefId;
          obj.userId = userId;
          if ($scope.autocomplete && $scope.autocomplete.getPlace() && $scope.autocomplete.getPlace().formatted_address) {
               obj.address = obj.address || {};
               obj.address.location = $scope.autocomplete.getPlace().formatted_address;
          }
          VehicleService.update (obj, function (response) {
               $scope.statusMsg = true;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
                    hideFlash();
               } else if(response.resStatus == "success") {
                    //console.log(result);
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    var airportsArr = response.result.update.delivery.airports || [];
                    var featureArr = response.result.update.details.features || [];
                    $localStorage.featArr=featureArr;



                    checkedAirports(airportsArr);


                    if (isParent) {
                         $scope.serverMsg = serverMsg;
                         hideFlash();
                    } else {
                         if(response.result.mobileVerification == false) {
                              $state.go('user.mobileVerification', {refId : response.result.update._id ,message: serverMsg});
                         }else if (response.result.licenseVerification == false){
                              $state.go('user.driverlicense', {refId : response.result.update._id ,message: serverMsg});
                         }else if ($state.current.name == 'user.listcarIntro') {
                              $state.go('user.listcarAvailability', {refId : response.result.update._id ,message: serverMsg});
                         }else if ($state.current.name == 'user.listcarAvailability') {
                              $state.go('user.listcarDetails', {refId : response.result.update._id ,message: serverMsg});
                         } else if ($state.current.name == 'user.listcarDetails') {
                              $state.go('user.listcarPhotos', {refId : response.result.update._id ,message: serverMsg});
                         } else if ($state.current.name == 'user.listcarPhotos') {
                              $state.go('user.listcarPublish', {refId : response.result.update._id ,message: serverMsg});
                         }
                    }
               }
          });
     }

     /** Use to Send Verification Code */
     $scope.sendVerificationCode  = function(User) {
          User.userId = $SessionService.user()._id;
          $AccountService.sendVerificationCode(User, function (response) {
               var serverMsg;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
                    hideFlash();
               }else if(response.resStatus == "success") {
                    $state.go('user.mobileOTP', {refId : $scope.vehicleRefId ,message: serverMsg});
                    hideFlash();
               }
          });
     }

     /** Authenticate the account by matching the OTP*/
     $scope.confirmOtp = function(User) {
          User.userId = $SessionService.user()._id;
          $AccountService.confirmOtp(User, function(response) {
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    if(response.licenseVerification == false) {
                         $state.go('user.driverlicense', {refId : $scope.vehicleRefId ,message: serverMsg});
                    } else {
                         $state.go('user.listcarAvailability', {refId : response.result._id ,message: serverMsg});
                    }
               }
          })
     }

     /** Resend the OTP if user doesn't receive the OTP*/
     $scope.reSendOtp = function() {
          $scope.DataModel = $scope.DataModel || {};
          $scope.DataModel._id = $localStorage.verifyId;
          $AccountService.reSendOtp($scope.DataModel, function(response) {
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.serverMsg = serverMsg;
               }
          })
     }

     /** Use to upload License */
     $scope.uploadLicense = function (obj) {
          var userId = $SessionService.user()._id;
          if ($scope.myFile) {
               obj.file = $scope.myFile[0];
          }
          $AccountService.uploadLicense(userId, obj, function (response) {
               var serverMsg;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               }else if(response.resStatus == "success") {
                    $state.go('user.listcarAvailability', {refId : $scope.vehicleRefId ,message: serverMsg});
               }
          });
     }

     /** Use to upload vehicle photos */
     $scope.addPhotos =function(activeLInk){
          var totalFiles = angular.element("div.col-sm-12 > div").length;
          var fileArr = $scope.myFile;
          if(fileArr && fileArr.length) {
               if(totalFiles > 20) {
                    return false;
               }
               var length = fileArr.length;
               var uploadImgUrl = '/vehicles/upload';
               var imgArr = [];
               var finalCounter = 0;
               var obj = {};
               var formData = new FormData();
               var length = fileArr.length;
               for(var i = 0; i < length; i++) {
                    var obj = {};
                    var formData = new FormData();
                    formData.append('file',fileArr[i]);
                    formData.append('vehicleId',$scope.vehicleRefId);
                    formData.append('userId',userId);
                    $http.post(uploadImgUrl,formData, {
                         transformRequest: angular.identity,
                         headers: {'Content-Type': undefined}
                    }).then(function (response) {
                         if (response.data.resStatus == "success") {
                              imgArr.push(response.data.result);
                              finalCounter++;
                              if(finalCounter == length) {
                                   return uploadComplete(imgArr);
                              }
                         }
                    });
               }
          } else if ($scope.isPhotoUploaded){
               if (!isParent) {
                    $state.go('user.listcarPublish', {refId : $scope.vehicleRefId ,message: {resStatus : "success", msg: "Info has successfully added"}});
               }
          }
     }

     /** Use to remove vehicle photo */
     $scope.removePhoto = function (vehicleId, img) {
          var modalInstance = $uibModal.open({
               //animation: $ctrl.animationsEnabled,
               ariaLabelledBy: 'modal-title',
               ariaDescribedBy: 'modal-body',
               templateUrl: 'myModalContent.html',
               controller: 'ModalInstanceController',
               controllerAs: '$ctrl',
               size: 'sm',
               resolve: {
                    items: function () {
                         return 1;
                    }
               }
          });
          modalInstance.result.then(function (selectedItem) {
               VehicleService.removePhoto (vehicleId, img, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $state.reload();
                    }
               });
          }, function () {
               //$log.info('Modal dismissed at: ' + new Date());
          });
     }

     /** Use to publish Car */
     $scope.publish = function () {
          $scope.DataModel.isPublish = true;
          $scope.DataModel.status = true;
          VehicleService.update ($scope.DataModel, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $state.go('user.liscarLanding.delivery', {refId : $scope.vehicleRefId ,message: serverMsg});
               }
          });
     }

     /** Use to Set protection */
     $scope.setProtection = function (plan, price) {
          $scope.DataModel.vehicleProtection.type = plan;
          $scope.DataModel.vehicleProtection.price = price;
          $scope.updateInfo($scope.DataModel);
     }

     /** Use to Set Color */
     $scope.setColor = function (color) {
          $scope.color = color;
          $scope.DataModel.details.color = color;
     }

     /** Use to Set Listing Status */

     $scope.setListingStatus = function (listingStatus,vehicleId) {
          $scope.DataModel = $scope.DataModel || {};
          if($scope.DataModel.listingStatus == 'SNOOZED'){
               var modalInstance = $uibModal.open({
                    //animation: $ctrl.animationsEnabled,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'snoozed.html',
                    controller: 'ModelListStatusController',
                    controllerAs: '$ctrl',
                    resolve: {
                         items: function () {
                              return {listingStatus:listingStatus,vehicleId:vehicleId,snozzedDate:$scope.DataModel.snozzedDate ? $scope.DataModel.snozzedDate : ''}
                         }
                    }
               });
               modalInstance.result.then(function (selectedItem) {
               }, function () {

               }); return;
          }else if($scope.DataModel.listingStatus == 'UNLISTED'){
               var modalInstance = $uibModal.open({
                    //animation: $ctrl.animationsEnabled,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'unlisted.html',
                    controller: 'ModelListStatusController',
                    controllerAs: '$ctrl',
                    resolve: {
                         items: function () {
                              return {listingStatus:listingStatus,vehicleId:vehicleId,snozzedDate:$scope.DataModel.snozzedDate ? $scope.DataModel.snozzedDate : ''}
                         }
                    }
               });
               modalInstance.result.then(function (selectedItem) {
               }, function () {

               }); return;
          }else{
               $scope.DataModel.listingStatus = listingStatus;
               $scope.updateInfo($scope.DataModel);
          }
     }


     /** function push the featurs **/
     // $scope.setFeatures = function(index,isChecked,value) {
     //      if(isChecked == 1) {
     //           $scope.checkFeaturesArr.push(value);
     //      }else {
     //           let indexOfArr = $scope.checkFeaturesArr.indexOf(value);
     //           $scope.checkFeaturesArr.splice(indexOfArr,1);
     //      }
     // }

     /** function for set the airport for delevary **/
     $scope.setAirports = function(index, isChecked, value, fee) {
          if(fee == undefined) {
               fee = 0;
          }
          if(isChecked == 1) {
               var obj = {};
               obj.id = value;
               obj.fee = fee;
               $scope.airportsArr.splice(index, 0, obj);
          } else {
               removeByAttr($scope.airportsArr, 'id', value );
          }
     }

     $scope.setFee = function(index, isChecked, value, fee) {
          $scope.airportsArr = $scope.airportsArr || [];
          if(fee) {
               $scope.airportsArr[index].fee = fee;
          }
     }


     /** Use to remove car listing */
     $scope.delete = function (vehicleId) {
          var modalInstance = $uibModal.open({
               //animation: $ctrl.animationsEnabled,
               ariaLabelledBy: 'modal-title',
               ariaDescribedBy: 'modal-body',
               templateUrl: 'deleteListing.html',
               controller: 'ModalInstanceController',
               controllerAs: '$ctrl',
               resolve: {
                    items: function () {
                         return 1;
                    }
               },
               size: 'sm'
          });
          modalInstance.result.then(function (selectedItem) {
               VehicleService.delete (vehicleId, userId, function (response) {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    if(response.resStatus == "error") {
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $state.go('user.dashboard', {message: serverMsg});
                    }
               });
          }, function () {
               //$log.info('Modal dismissed at: ' + new Date());
          });
     }

     /** Use to retrive car models */
     $scope.getCarModels  = function (brand) {
          getCarModels(brand);
     }

     /** Use to retrive car brands & models */
     if($state.current.name == 'user.listcarIntro' && !$scope.vehicleRefId) {
          getCarBrands();
          $scope.getCarModels  = function (brand) {
               getCarModels(brand);
          }
     }
     /** Use to retrive car models */
     $scope.getStates  = function (country) {
          getStates(country);
     }

     /* get countries*/
     if($state.current.name == 'user.driverlicense') {
          getCountry();
          $scope.getStates  = function (country) {
               getStates(country);
          }
     }

     /** Use to trigger browse button */
     angular.element("#uploadTrigger").click(function(){
          angular.element("#uploadFile").click();
     });

     /** Use to show preview of selected iimages */
     angular.element("#uploadFile").change(function () {
          var uploadedFiles = $scope.isPhotoUploaded;
          var newSelect = this.files.length;
          var totalFiles = uploadedFiles + newSelect;
          previewImages(this.files);
     });

     /** get vehicle Info */
     if($scope.vehicleRefId) {
          getvehicleData();
          if($state.current.name == 'user.liscarLanding.trip_history') {
               tripDeatil($scope.vehicleRefId);
          }
     }

     if(BookingId ) {
          bookingDetail(BookingId);
     }

     /** Displaying flash message  */
     if($stateParams.message != null) {
          $scope.statusMsg = true;
          $scope.serverMsg = $stateParams.message;
          hideFlash();
     }




}

},{}],21:[function(require,module,exports){
/**--------------------------------------------------------------------------
Name                   : VehicleDetailController
Description            : Use to add & update vehicle Info
Author :               : Sunny Chauhan
--------------------------------------------------------------------------*/

module.exports = function($timeout, $scope, $rootScope, $stateParams, $state, $localStorage, $location, $http, VehicleService, $SessionService,$uibModal) {

     /** Variablels defined **/
     $scope.sessionUserId = $SessionService.user()._id ? $SessionService.user()._id : "";
     var vehicleRefId = (Object.keys($location.search()).length) ? $location.search().refId : "";
     var userId = ($stateParams.userId) ? $stateParams.userId : "";
     $scope.isAuthenticated = ($SessionService.user() && $SessionService.user()._id) ? true : false;
     $scope.isFavourite = false;
     $scope.myInterval = 5000;
     $scope.noWrapSlides = false;
     $scope.active = 0;
     var slides = $scope.slides = [];
     var currIndex = 0;
     $scope.trip = {};
     $scope.check=true;

     /** Function to create cmarker on google Map */
     var createMarker = function (info){
          var mapOptions = {
               zoom: 4,
               center: new google.maps.LatLng(info.lat, info.lon),
               mapTypeId: google.maps.MapTypeId.TERRAIN
          }

          $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

          $scope.markers = [];

          var infoWindow = new google.maps.InfoWindow();

          $scope.openInfoWindow = function(e, marker){
               e.preventDefault();
               google.maps.event.trigger(marker, 'load');
          }

          var marker = new google.maps.Marker({
               map: $scope.map,
               position: new google.maps.LatLng(info.lat, info.lon),
               title: info.country ? info.country : 'N/A'
          })
          marker.content = '<div class="infoWindowContent">' + info.location + '</div>';

          google.maps.event.addDomListener(marker, 'load', function(){
               infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
               infoWindow.open($scope.map, marker);
          });
           infoWindow.setContent('<h2 style="color:black;">' + marker.title + '</h2><small style="color:black;">' + marker.content+'</small>');
          infoWindow.open($scope.map, marker);

          $scope.markers.push(marker);

     }

     /** Function to get Data for vehicle */
     var getvehicleData = function() {
          VehicleService.view (vehicleRefId, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;

               } else if(response.resStatus == "success") {
                    $scope.DataModel = response.result.view;
                    $scope.rating = response.result.rating;
                    $scope.trips = response.result.trips;
                    $scope.reviews = response.result.reviews;
                    //console.log($scope.reviews);
                    createMarker(response.result.view.address);
               }
          });
     }

     /** Function to check favorite car */
     var checkFavourite = function () {
          VehicleService.checkFavourite($SessionService.user()._id, vehicleRefId, function(response){
               serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    if(response.result == true) {
                         $scope.isFavourite = true;
                    } else {
                         $scope.isFavourite = false;
                    }
               }
          });
     }

     /** Function to create cmarker on google Map */
     var getProfile = function () {
          VehicleService.myVehicles(userId, function (response){
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.cbResponse = response.result;
               }
          });
     }

     /** Function to concatenate date & time */
     var combine = function(dt, timeString) {
          var startDateTime;
          var parts = /^(\d+):(\d+) (AM|PM)$/.exec(timeString);
          if (parts) {
               hours = parseInt(parts[1], 10);
               minutes = parseInt(parts[2], 10);
               if (parts[3] === "PM" && hours !== 12) {
                    hours += 12;
               }
               else if (parts[3] === "AM" && hours === 12) {
                    hours = 0;
               }
               if (!isNaN(hours) && !isNaN(minutes)) {
                    startDateTime = new Date(dt.getTime());
                    startDateTime.setHours(hours);
                    startDateTime.setMinutes(minutes);
               }
          }
          return startDateTime;
     }


     /** Function to report car **/
     $scope.reports= function(){
          $scope.reportObj.vehicleId = $scope.DataModel._id;
          $scope.reportObj.userId = $SessionService.user()._id;
          VehicleService.report($scope.reportObj,function(response){
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.report = response.result;
                    if(serverMsg.resStatus == "success"){
                         angular.element('#myModal').modal('toggle');
                         alert(serverMsg.msg);
                    }
               }
          });
     }


     /** Function to assign  a car favourite **/
     $scope.favorite = function(key) {
          VehicleService.favourite(key, $SessionService.user()._id, vehicleRefId, function(response){
               serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    if(key == 1) {
                         $scope.isFavourite = true;
                    } else {
                         $scope.isFavourite = false;
                    }
               }
          });
     }

     /** Function to check availability of car */
     $scope.checkAvailability = function() {
          if($scope.payment.startDate &&  $scope.payment.endDate) {
               // if($scope.payment.startTime == '' || $scope.payment.startTime == undefined) {
               //      $scope.payment.startTime = "12:00 AM";
               // }
               // if($scope.payment.endTime == '' || $scope.payment.endTime == undefined) {
               //      $scope.payment.endTime = "12:00 AM";
               // }
               var startDate = ($scope.payment.startTime)?combine(new Date($scope.payment.startDate), $scope.payment.startTime) : new Date($scope.payment.startDate);
               var endDate = ($scope.payment.endTime)?combine(new Date($scope.payment.endDate), $scope.payment.endTime) : new Date($scope.payment.endDate);

               if (endDate > startDate) {
                    $scope.isRequired = false;
                    var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    $scope.trip.price  = diffDays * $scope.DataModel.ridingCost;
                    VehicleService.checkAvailability(startDate, endDate, vehicleRefId,function(response){
                         serverMsg = {resStatus : response.resStatus, msg: response.msg,result :response.result };
                         if(response.resStatus == "success") {
                              $scope.payment.modifiedStartDate = startDate;
                              $scope.payment.modifiedEndDate = endDate;
                              if(response.result == false) {
                                   $scope.check = false;
                              } else {
                                   $scope.check = true;
                              }
                         }
                         $scope.serverMsg = serverMsg;
                    });
               } else {
                    $scope.check = true;
                    $scope.isRequired = true;
               }
          }
     }


     /** Function to open a popup for choosing car location*/
     $scope.rentForCar = function(){
          var dataToSent = {
                              address : $scope.DataModel.address,
                              delivery : $scope.DataModel.delivery,
                              price: $scope.trip.price ? $scope.trip.price : $scope.DataModel.ridingCost,
                              startDate: $scope.payment.modifiedStartDate,
                              endDate: $scope.payment.modifiedEndDate,
                              vehicleId : vehicleRefId,
                              specifications :$scope.DataModel.specifications
                         };
          var modalInstance = $uibModal.open({
               //animation: $ctrl.animationsEnabled,
               ariaLabelledBy: 'modal-title',
               ariaDescribedBy: 'modal-body',
               templateUrl: 'checkAvailability.html',
               controller: 'ModalPaymentController',
               controllerAs: '$ctrl',
               resolve: {
                    items: function () {
                         return dataToSent;
                    }
               }
          });
          modalInstance.result.then(function (selectedItem) {
          }, function () {
               //$log.info('Modal dismissed at: ' + new Date());
          }); return;
     }

     /** For Paypal express checkout**/
     if($stateParams.token && $stateParams.PayerID || $state.current.name == "user.order") {
          var obj = {};
          obj.token = $stateParams.token;
          obj.PayerID = $stateParams.PayerID;
          obj.vehicleId = $localStorage.paymentObj.vehicleId;
          obj.startDate = $localStorage.paymentObj.startDate;
          obj.endDate = $localStorage.paymentObj.endDate;
          obj.userId = $SessionService.user()._id;
          obj.location = $localStorage.paymentObj.location;
          obj.fee = $localStorage.paymentObj.fee;
          obj.deliveryType = $localStorage.paymentObj.deliveryType;
          VehicleService.savePaypalTransaction(obj, function(response){
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    delete $localStorage.paymentObj;
                    $state.go('user.order');
               }
          });
     }

     if(userId) {
          getProfile();
     }

     if($state.current.name == 'anon.vehicleDetail') {
          getvehicleData();
     }

     if($SessionService.user()._id && vehicleRefId) {
          checkFavourite();
     }

     function customRange(input){
          return {
               minDate: (input.id == "endDate" ? angular.element("#startDate").datepicker("getDate") : new Date())
          };
     }

     // To set maxdate in startdate
     function customRangeStart(input){
          return {
               maxDate:(input.id == "startDate" ?angular.element("#endDate").datepicker("getDate") : null)
          };
     }

     angular.element('#startDate').datepicker({
          beforeShow: customRangeStart,
          minDate: new Date(),
     });

     angular.element('#endDate').datepicker({beforeShow: customRange});

}

},{}],22:[function(require,module,exports){
/**
|--------------------------------------------------------------------------
| Name                   : VerificationController
| Built in Dependencies  : $AuthService
| Custom Dependencies    : $scope, $stateParams, $state
| Description            : use to verify the seeker identity
| Author                 : Sunny Chauhan
| Created                : 17jan2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
module.exports = function($scope, $rootScope, $stateParams, $state, $AuthService, $localStorage, $SessionService, $LocalService,FlashService) {

     // angular.element("#alert-success").fadeTo(2000, 500).slideUp(500, function(){
     //           angular.element(this).slideUp(500);
     // });

     /** storing the params in scope & localstorage*/
     if($stateParams.message != null) {
          $scope.serverMsg = {};
          $localStorage.verifyId = $stateParams.message.verifyId;
          $scope.serverMsg = $stateParams.message;
     } else {
          $scope.serverMsg = {};
     }

     /** Redirect to the login, when verifyId is null or undefined*/
     if($localStorage.verifyId  == null || $localStorage.verifyId == undefined) {
          $state.go("anon.login");
     }

     /** Resend the OTP if user doesn't receive the OTP*/
     $scope.reSendOtp = function() {
          $scope.DataModel = $scope.DataModel || {};
          $scope.DataModel._id = $localStorage.verifyId;
          $AuthService.reSendOtp($scope.DataModel, function(response) {
               FlashService.show();
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.serverMsg = serverMsg;
               }
          })
     }

     /** Authenticate the account by matching the OTP*/
     $scope.confirmOtp = function() {
          $scope.DataModel._id = $localStorage.verifyId;
          $AuthService.confirmOtp($scope.DataModel, function(response) {
               FlashService.show();
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    delete $localStorage.verifyId;
                    $scope.$emit('UpdateSession', {message: response.result});
                    $state.go("user.dashboard", {message:serverMsg});
               }
          })
     }

     /** Authenticate the account in case of forget password by matching the OTp*/
     $scope.confirmOtpForgot = function() {
          $scope.DataModel._id = $localStorage.verifyId;
          $AuthService.confirmOtpForgot($scope.DataModel, function(response) {
               FlashService.show();
               var serverMsg = {resStatus : response.resStatus, msg: response.msg, verifyId : response._id };
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    delete $localStorage.verifyId;
                    $state.go("anon.resetPassword", {message:serverMsg});
               }
          })
     }

     /**   reseting the password
     -----------------------------------------------*/
     $scope.resetPassword = function () {
          $scope.DataModel._id = $localStorage.verifyId;
          $AuthService.resetPassword($scope.DataModel, function (response) {
               FlashService.show();
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    delete $localStorage.verifyId;
                    $state.go("anon.login", {message:serverMsg});
               }
          })
     }

var verifyEmail = function(){
     //alert("helloo")
     $AuthService.confirmEmail($stateParams.token,$stateParams.id,function (response) {

          var serverMsg;
          if(response.resStatus == "error") {
               serverMsg = {resStatus : response.resStatus, msg: response.msg};
               $scope.serverMsg = serverMsg;
          } else if(response.resStatus == "success") {
               serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if ($SessionService.user()._id) {
                    $state.go("user.dashboard", {message:serverMsg});
               } else {
                    $LocalService.set('auth_user', JSON.stringify(response));
                    $scope.$emit('UpdateSession', {message: response.result});
                    $state.go("anon.home", {message: serverMsg});
               }
          }
     })
}
     if($state.current.name == "anon.verifyEmail") {
          verifyEmail();
   }
     /**   verifying the seeker
     -----------------------------------------------*/
     // if($state.current.name == "anon.verifyByEmail") {
     //       $AuthService.verifyByEmail($stateParams.token,$stateParams.email, function (response) {
     //             var serverMsg = {resStatus : response.resStatus, msg: response.msg};
     //             if(response.resStatus == "error") {
     //                   $scope.serverMsg = serverMsg;
     //             } else if(response.resStatus == "success") {
     //                   $scope.serverMsg = serverMsg;
     //             }
     //       })
     // }

     // if($state.current.name == "anon.resetByEmail") {
     //       $AuthService.verifyByReset($stateParams.actToken, $stateParams.email, function (response) {
     //             var serverMsg = {resStatus : response.resStatus, msg: response.msg};
     //             if(response.resStatus == "error") {
     //                   $scope.serverMsg = serverMsg;
     //             } else if(response.resStatus == "success") {
     //                   $scope.serverMsg = serverMsg;
     //                   $scope.authId = response.authId;
     //             }
     //       })
     // }
}

},{}],23:[function(require,module,exports){
//************use for upload image
module.exports =  function ($parse) {
     return {
          restrict: 'A',
          link: function(scope, element, attrs) {
               var model = $parse(attrs.fileModel);
               var modelSetter = model.assign;
               element.bind('change', function(){
                    scope.$apply(function(){
                         modelSetter(scope, element[0].files);
                    });
               });
          }
     };
}

},{}],24:[function(require,module,exports){
module.exports =  function () {
    return {
      restrict: 'A',
      template: '<ul class="rating">' +
                  '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
                    '\u2605' +
                  '</li>' +
                '</ul>',
      scope: {
        ratingValue: '=',
        max: '=',
        readonly: '@',
        onRatingSelected: '&'
      },
      link: function (scope, elem, attrs) {

        var updateStars = function() {
          scope.stars = [];
          for (var  i = 0; i < scope.max; i++) {
            scope.stars.push({filled: i < scope.ratingValue});
          }
        };

        scope.toggle = function(index) {
          if (scope.readonly && scope.readonly === 'true') {
            return;
          }
          scope.ratingValue = index + 1;
          scope.onRatingSelected({rating: index + 1});
        };

        scope.$watch('ratingValue', function(oldVal, newVal) {
          if (newVal) {
            updateStars();
          }
        });
      }
    }
  }

},{}],25:[function(require,module,exports){
module.exports = function() {
    return {
        compile: function(tElement, tAttrs, transclude) {
            //Disable ngClick
            tAttrs["ngClick"] = "!("+tAttrs["aDisabled"]+") && ("+tAttrs["ngClick"]+")";

            //return a link function
            return function (scope, iElement, iAttrs) {

                //Toggle "disabled" to class when aDisabled becomes true
                scope.$watch(iAttrs["aDisabled"], function(newValue) {
                    if (newValue !== undefined) {
                        iElement.toggleClass("disabled", newValue);
                    }
                });

                //Disable href on click
                iElement.on("click", function(e) {
                    if (scope.$eval(iAttrs["aDisabled"])) {
                        e.preventDefault();
                    }
                });
            };
        }
    };
}

},{}],26:[function(require,module,exports){
module.exports = function ($http) {
     return {
          restrict: 'A',
          link: function (scope, elm, attrs)
          {
               scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
               };

               scope.$watch(scope.isLoading, function (v)
               {
                    if(v){
                         elm.show();
                    }else{
                         elm.hide();
                    }
               });
          }
     };

}

},{}],27:[function(require,module,exports){
module.exports =  function($compile) {
     // directive factory creates a link function
     return function(scope, element, attrs) {
          scope.$watch(
               function(scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
               },
               function(value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);
                    // compile the new DOM and link it to the current
                    // scope.
                    $compile(element.contents())(scope);
               }
          );
     };

}

},{}],28:[function(require,module,exports){
module.exports =  function (str) {
     return function( input ) {
          return str.charAt(0);
     }
}

},{}],29:[function(require,module,exports){
module.exports =  function () {
     return function (input, start) {
          if (input) {
               start = +start;
               return input.slice(start);
          }
          return [];
     };
}

},{}],30:[function(require,module,exports){
/*
|--------------------------------------------------------------------------
| Name                   : AuthInterceptor
| Built in Dependencies  :  $q, $injector
| Custom Dependencies    :  LocalService
| Description            : use to authenticate user
|--------------------------------------------------------------------------
*/
module.exports = function($httpProvider) {

     function AuthUserInterceptor ($q, $injector) {
          var LocalService = $injector.get('$LocalService');
          //console.log(angular.fromJson(LocalService.get('auth_token')).result);
          return {
               request: function(config) {

                    if (LocalService.get('auth_user') && LocalService.get('auth_user') != 'undefined') {
                         var token;
                         token = angular.fromJson(LocalService.get('auth_user')).token;
                         if (token) {
                              config.headers.Authorization = 'BearerS ' + token;
                         }

                    }
                    return config;
               },
               responseError: function(response) {
                    if (response.status === 403 || response.status === 401) {
                         LocalService.unset('auth_user');
                         var msg = (response.data && response.data.err) ? response.data.err : response.err;
                         //$injector.get('$state').go('anon.login',{message:{resStatus:"error",msg:"Your session has been expired, Please login again"}});
                         $injector.get('$state').go('anon.login',{message:{resStatus:"error",msg : msg, isSession : false}});

                    } else if (response.status === 404) {
                         $injector.get('$state').go('anon.404');
                    } else if (response.status === 500) {
                         $injector.get('$state').go('anon.500');
                    }
                    return $q.reject(response);
               }
          }
     }

     $httpProvider.interceptors.push(AuthUserInterceptor);
}

},{}],31:[function(require,module,exports){
/*
|--------------------------------------------------------------------------
| Name                   : AccoutService
| Built in Dependencies  : $http
| Custom Dependencies    :  $localStorage, LocalService, AccessLevels
| Description            : use to view and edit profile
| Author                 : Mangal Singh
| Created                : 8 Aug 2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
module.exports =  function($q,$http, $LocalService, AccessLevels, $localStorage,$SessionService) {
     return {
          listMessage : function (userId, fromId, callback) {
               $http.get('/chat/listMessage/'+userId+"/"+fromId).then(function (data) {
                    callback(data);
               });
          },
          registerChat : function (obj, callback) {
               $http.post('/chat/register', obj).then(function (data) {
                    callback(data);
               });
          },
          view : function(userId, cb) {
               var userInfo = $http.get('/account/view?reqId='+userId);
               userInfo.success(function(response) {
                    cb(response);
               });

          },
          account: function(userId,userObj,cb){
               //console.log(userObj); return;
               var uploadImgUrl = "account/update";
               var deferred = $q.defer();
               var formData = new FormData();
               formData.append('file',userObj.file);
               formData.append('_id',userObj._id);
               formData.append('first',userObj.name.first);
               formData.append('last',userObj.name.last);
               formData.append('email',userObj.email);
               formData.append('description',userObj.profile.description);
               if (userObj.profile && userObj.profile.photo) {
                    formData.append('photoOriginal',userObj.profile.photoOriginal);
                    formData.append('photo',userObj.profile.photo);
                    formData.append('path',userObj.profile.path);
               }
               $http.post(uploadImgUrl,formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
               }) .success(function(response){
                    cb(response);
                    deferred.resolve(response);
               })
               .error(function(error){
                    deferred.reject(error);
               });
               return deferred.promise;
          },
          uploadLicense: function(userId,userObj,cb){
               var deferred = $q.defer();
               var uploadImgUrl = "account/uploadLicense";
               var formData = new FormData();
               formData.append('file',userObj.file);
               formData.append('userId',userId);
               formData.append('first',userObj.license.name.first);
               formData.append('last',userObj.license.name.last);
               formData.append('middle',userObj.license.name.middle);
               formData.append('country',userObj.license.issuer.country);
               formData.append('state',userObj.license.issuer.state);
               formData.append('number',userObj.license.number);
               formData.append('dob',userObj.license.dob);
               $http.post(uploadImgUrl,formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
               }) .success(function(response){
                    cb(response);
                    deferred.resolve(response);
               })
               .error(function(error){
                    cb(response);
                    deferred.reject(error);
               });
               return deferred.promise;
          },

          changePassword: function(userId,password,new_password,con_password,cb){

               var userPass = $http.post('account/updatePassword',
               {'reqId' : userId, 'password':password,'new_password':new_password,'con_password':con_password});
               userPass.success(function(response) {
                    cb(response);
               });
          },

          sendVerificationCode : function (dataObj, cb) {
               var userPass = $http.post('account/sendVerificationCode', dataObj);
               userPass.success(function(response) {
                    cb(response);
               });
          },

          confirmOtp : function (dataObj, cb) {
               var userPass = $http.post('account/confirmOtp', dataObj);
               userPass.success(function(response) {
                    cb(response);
               });
          },
          newsletter : function (email, cb) {
               var newslt = $http.post('newsletter/subscribe', {email : email});
               newslt.success(function(response) {
                    cb(response);
               });
          },

          getCountry : function (cb) {
               var obj = $http.get('/vehicles/listCountry');
               obj.then(function(response) {
                    cb(response.data);
               });
          },
          getStates : function (country, cb) {
               var obj = $http.get('/vehicles/listStates?country='+country);
               obj.then(function(response) {
                    cb(response.data);
               });
          },
          listUserMessage : function (userId, fromId, callback) {
               var obj = $http.get('/chat/listMessage?toId='+userId+'&fromId='+fromId);
                     obj.then(function (response){
                    callback(response.data);
               });
          },
          listUsers : function (userId, callback) {
               var obj = $http.get('/chat/listUsers?fromId='+userId);
               obj.then(function (response){
                    callback(response.data);
               });
          },

     }



}

},{}],32:[function(require,module,exports){
/*
|--------------------------------------------------------------------------
| Name                   : AuthService
| Built in Dependencies  : $http
| Custom Dependencies    :  $localStorage, LocalService, AccessLevels
| Description            : use to authenticate seeker & register
| Author                 : Sunny Chauhan
| Created                : 18jan2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
module.exports = function($http, $LocalService, AccessLevels, $localStorage) {
     return {
          authorize: function(access) {
               if (access === AccessLevels.user) {
                    return this.isAuthenticated();
               } else {
                    return true;
               }
          },
          isAuthenticated: function() {
               if($LocalService.get('auth_user')) {
                    return ($LocalService.get('auth_user'));
               }
          },
          unLink : function(userId, type, cb) {
               var serviceInstance = $http.get('/auth/unlink/'+userId + '/' + type);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },
          login: function(credentials, cb) {
               var serviceInstance = $http.post('/auth/login', credentials);
               serviceInstance.success(function(response) {
                    if(response.resStatus == "success") {
                         if(response.result.role == "USER") {
                              $LocalService.set('auth_user', JSON.stringify(response));
                         }
                    }
                    cb(response);
               });
               //console.log("response = ",login);
               //return login;
          },

          logout: function(userId, cb) {
               var serviceInstance = $http.get('/auth/logOut?uId='+userId);
               serviceInstance.success(function(response) {
                    if(response.resStatus == "success") {
                         $LocalService.unset('auth_user');
                    }
                    cb(true);
               });
          },
          register: function(formData, cb) {
               $LocalService.unset('auth_user');
               var serviceInstance = $http.post('/auth/register', formData);
               serviceInstance.success(function(response) {
                    if(response.resStatus == "success") {
                         if(response.result.role == "USER") {
                              $LocalService.set('auth_user', JSON.stringify(response));
                         }
                    }
                    cb(response);
               });
               // serviceInstance.success(function(response) {
               //      cb(response);
               // });
          },

          confirmEmail: function(token,reqId,cb) {
               var email = $http.get('/auth/varifyEmail?token='+token + '&id='+reqId);
               email.success(function(response) {
                    cb(response);
               });
          },

          confirmOtp: function(formData, cb) {
               var serviceInstance = $http.post('/auth/confirmAccount',formData);
               serviceInstance.success(function(response) {
                    if(response.resStatus == "success") {
                         if(response.result.role == "USER") {
                              $LocalService.set('auth_user', JSON.stringify(response));
                         }
                    }
                    cb(response);
               });
          },
          confirmOtpForgot: function(formData, cb) {
               var serviceInstance = $http.post('/auth/confirmAccountForgot',formData);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },
          reSendOtp: function(formData, cb) {
               var serviceInstance = $http.post('/auth/reSendOtp', formData);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },
          forgot: function(formData, cb) {
               var serviceInstance = $http.post('/auth/forgot-password', formData);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },
          verifyByEmail: function(activationToken,email, cb) {
               var serviceInstance = $http.get('/auth/verifyByEMail?token='+activationToken+'&email='+email);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },
          verifyByReset: function(activationToken,email, cb) {
               var serviceInstance = $http.get('/auth/verifyByReset?token='+activationToken+'&email='+email);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },

          resetPassword: function(postData, cb) {
               var serviceInstance = $http.post('/auth/resetPassword', postData);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },
          checkUniqueEmail : function (reqEmail, cb) {
               var serviceInstance = $http.get('/auth/checkUniqueEmail/?reqEmail='+reqEmail);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },
          checkUniqueMobile : function (reqMobile, cb) {
               var serviceInstance = $http.get('/auth/checkUniqueMobile/?reqMobile='+reqMobile);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },

          viewSeeker: function(reqId, cb) {
               var serviceInstance = $http.get('/auth/Api/seeker_profile/?reqId='+reqId);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },

          viewUser: function(reqId, cb) {
               var serviceInstance = $http.get('/auth/Api/user_profile/?reqId='+reqId);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          },

          getNotificationCount: function(reqId, cb) {
               var serviceInstance = $http.get('/auth/Api/getNotificationCount/?reqId='+reqId);
               serviceInstance.success(function(response) {
                    cb(response);
               });
          }


     }
}

},{}],33:[function(require,module,exports){
/*
|--------------------------------------------------------------------------
| Name                   : BlogService
| Built in Dependencies  :  --
| Custom Dependencies    :  --
| Description            : use to get blogs
| Author                 : vishesh Tanwar
| Created                : 28 sept 2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
module.exports =  function($http) {
          return {
               list : function(cb) {
                    var obj = $http.get('/blog/list');
                    obj.success(function(response) {
                         cb(response);
                    });
               },

               view : function(blogId, cb) {
                    var obj = $http.get('/blog/view?blogId='+blogId);
                    obj.success(function(response) {
                         cb(response);
                    });
               }
          }
     }

},{}],34:[function(require,module,exports){
/*
|--------------------------------------------------------------------------
| Name                   : FlashService
| Built in Dependencies  :  --
| Custom Dependencies    :  --
| Description            : use to hide flash Message
| Author                 : Sunny Chauaham
| Created                : 07 Sep 2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
module.exports = function($rootScope, $timeout) {
          return {
               hide : function() {
                    $timeout(function(){
                         $rootScope.statusMsg = false;
                    }, 5000);
               },
               show : function () {
                    $rootScope.statusMsg = true;
               }
          }
     }

},{}],35:[function(require,module,exports){
/*
|--------------------------------------------------------------------------
| Name                   : LocalService
| Built in Dependencies  :  --
| Custom Dependencies    :  --
| Description            : use to authenticate seeker & register
| Author                 : Sunny Chauhan
| Created                : 18jan2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
module.exports =  function() {
          return {
                    get: function(key) {
                         return localStorage.getItem(key);
                    },
                    set: function(key, val) {
                         return localStorage.setItem(key, val);
                    },
                    unset: function(key) {
                         return localStorage.removeItem(key);
                    }
          }
     }

},{}],36:[function(require,module,exports){
module.exports =  function() {
           function fetchValue(name) {
                var gCookieVal = document.cookie.split("; ");
                for (var i=0; i < gCookieVal.length; i++)
                {
                    // a name/value pair (a crumb) is separated by an equal sign
                    var gCrumb = gCookieVal[i].split("=");
                    if (name === gCrumb[0])
                    {
                        var value = '';
                        try {
                           value = angular.fromJson(gCrumb[1]);
                        } catch(e) {
                           value = unescape(gCrumb[1]);
                        }
                        return value;
                    }
                }
                // a cookie with the requested name does not exist
                return null;
           }
           return function(name, values) {
                if(arguments.length === 1) return fetchValue(name);
                var cookie = name + '=';
                if(typeof values === 'object') {
                    var expires = '';
                    cookie += (typeof values.value === 'object') ? angular.toJson(values.value) + ';' : values.value + ';';
                    if(values.expires) {
                        var date = new Date();
                        date.setTime( date.getTime() + (values.expires * 24 *60 * 60 * 1000));
                        expires = date.toGMTString();
                    }
                    cookie += (!values.session) ? 'expires=' + expires + ';' : '';
                    cookie += (values.path) ? 'path=' + values.path + ';' : '';
                    cookie += (values.secure) ? 'secure;' : '';
                } else {
                    cookie += values + ';';
                }
                document.cookie = cookie;
           }
        }

},{}],37:[function(require,module,exports){
/*
--------------------------------------------------------------------------
Name                   : $SessionSeekerService
Description            : use to authenticate user
--------------------------------------------------------------------------
*/
module.exports =  function($injector) {
     var LocalService = $injector.get('$LocalService');
     return {
          user: function() {
               var authUser = angular.fromJson(LocalService.get('auth_user'));
               if (authUser && authUser != undefined) {
                    return authUser.result;
               } else {
                    return {};
               }
          }
     }
}

},{}],38:[function(require,module,exports){
/**
Name                   : VehicleService
Built in Dependencies  : $http
Custom Dependencies    :
Description            : use to add & update vehicle Data
Author                 : Sunny Chauhan
Created                : 20 Aug 2016
ModifyBy               : ---
*/
module.exports =  function($http, $q) {
     return {

          getAirports : function (cb) {
               var obj = $http.get('/vehicles/airports');
               obj.then(function(response) {
                    cb(response.data);
               });
          },
          getCarBrands : function (cb) {
               var obj = $http.get('/vehicles/brands');
               obj.then(function(response) {
                    cb(response.data);
               });
          },
          getCarModels : function (brand, cb) {
               var obj = $http.get('/vehicles/models?brand='+brand);
               obj.then(function(response) {
                    cb(response.data);
               });
          },
          getCarModelsYear : function (brand, model, cb) {
               var obj = $http.get('/vehicles/modelYears?brand='+brand+"&model="+model);
               obj.then(function(response) {
                    cb(response.data);
               });
          },
          add : function (dataObj, cb) {
               var obj = $http.post('/vehicles/add', dataObj);
               obj.then(function(response) {
                    cb(response.data);
               });
          },

          update : function (dataObj, cb) {
               var obj = $http.post('/vehicles/update', dataObj);
               obj.then(function(response) {
                    cb(response.data);
               });
          },

          view : function (refId, cb) {
               var obj = $http.get('/vehicles/view?refId='+ refId);
               obj.then(function(response) {
                    cb(response.data);
               });
          },

          delete : function (vehicleId, userId, cb) {
               var obj = $http.get('/vehicles/delete?refId='+ vehicleId + '&uId='+userId);
               obj.then(function(response) {
                    cb(response.data);
               });
          },

          removePhoto : function (vehicleId, img, cb) {
               var obj = $http.get('/vehicles/removePhoto?refId='+ vehicleId + "&img="+img);
               obj.then(function(response) {
                    cb(response.data);
               });
          },

          myVehicles : function (userId, cb) {
               var obj = $http.get('/vehicles/myvehicles?uId='+ userId);
               obj.then(function(response) {
                    cb(response.data);
               });
          },
          listCars : function (queryStr, cb) {
               var search = $http.get('/vehicles/list?'+queryStr);
               search.then(function(response) {
                    cb(response.data);
               });
          },
          favourite : function (key, userId, vehicleId, cb) {
               var search = $http.get('/vehicles/addToFavourites?key='+key+'&refId='+vehicleId+'&uId='+userId);
               search.then(function(response) {
                    cb(response.data);
               });
          },
          checkFavourite : function (userId, vehicleId, cb) {
               var search = $http.get('/vehicles/checkFavourite?refId='+vehicleId+'&uId='+userId);
               search.then(function(response) {
                    cb(response.data);
               });
          },
          searchFromto: function(searchObj,cb){
               cb(searchObj);
          },
          report:function(reportObj,cb){
               var rprt = $http.post('/infraction/report',reportObj);
               rprt.then(function(response) {
                    cb(response.data);
               });
          },
          fevorite:function(whicleObj,cb){
               var fevo= $http.post('/infraction/fevorite',whicleObj);
               fevo.then(function(response){
                    cb(response.data);
               });
          },
          paypal:function(payment,cb){
               var pay=$http.post('/payment/rentCar',payment)
               pay.then(function(response){
                    cb(response.data);
               });
          },
          savePaypalTransaction : function(obj, cb){
               var pay = $http.post('/payment/saveTransaction', obj)
               pay.then(function(response){
                    cb(response.data);
               });
          },
          getTransactions : function(userId, cb){
               var pay = $http.get('/payment/getTransactions?userId='+userId)
               pay.then(function(response){

                    cb(response.data);
               });
          },
          sendReferrals : function(referral,cb){
                var reff = $http.post("/account/sendReferrals",referral)
               reff.then(function(response){
                    cb(response.data);
               });
          },
          referralData : function(code,cb){
               var reff = $http.get("/account/referralInfo?code="+code)
               reff.then(function(response){
                    cb(response.data);
               });
          },
          checkAvailability : function(startDate,endDate, vehicleId, cb){
               var check = $http.get("/vehicles/checkAvailabilty?startDate="+startDate + "&endDate=" + endDate + "&vehicleId="+vehicleId)
              check.then(function(response){
                   cb(response.data);
              });
         },
          getCities : function(cb){
               var check = $http.get("/vehicles/cities");
              check.then(function(response){
                   cb(response.data);
              });
         },
         tripView : function (refId, cb) {
              var obj = $http.get('/payment/vehicleBooking?vehicleId='+ refId);
              obj.then(function(response) {
                   cb(response.data);
              });
         },
         bookingView : function (bookingId, cb) {
            var obj = $http.get('/payment/bookingInfo?bookingId='+ bookingId);
            obj.then(function(response) {
                  cb(response.data);
            });
        },
       review : function(obj,cb){
              var rev = $http.post("/vehicles/review",obj);
            rev.then(function(response){
                  cb(response.data);
            });
       },
       getAirport : function (cb) {
         var obj = $http.get('/vehicles/airports');
         obj.then(function(response) {
                cb(response.data);
         });
    },
    addMsg : function(obj, cb){
         var msg = $http.post('/chat/addMessage', obj)
         msg.then(function(response){
              cb(response.data);
         });
    },

     }
}

},{}]},{},[1]);
