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
