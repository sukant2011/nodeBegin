

corsa_admin.config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider','AccessLevels', function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider, AccessLevels) {

     $ocLazyLoadProvider.config({
          debug:false,
          events:true,
     });

     $urlRouterProvider.otherwise('/login');

     $stateProvider
     .state('login',{
          templateUrl:'/templates/admin/pages/login.html',
          controller : 'AuthController',
          url:'/login',
          data: {
               access: AccessLevels.anon
          }
     })
     .state('dashboard', {
          url:'/dashboard',
          templateUrl: '/templates/admin/dashboard/main.html',
          controller: 'AccountController',
          data: {
               access: AccessLevels.user
          },
          resolve: {
               loadMyDirectives:function($ocLazyLoad){
                    return $ocLazyLoad.load(
                         {
                              name:'corsaAdminApp',
                              files:[
                                   '/javascripts/admin/directives/header/header.js',
                                   '/javascripts/admin/directives/header/header-notification/header-notification.js',
                                   '/javascripts/admin/directives/sidebar/sidebar.js',
                                   '/javascripts/admin/directives/sidebar/sidebar-search/sidebar-search.js'
                              ]
                         }),
                         $ocLazyLoad.load(
                              {
                                   name:'toggle-switch',
                                   files:["/javascripts/admin/bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                                   "/javascripts/admin/bower_components/angular-toggle-switch/angular-toggle-switch.css"
                              ]
                         }),
                         $ocLazyLoad.load(
                              {
                                   name:'ngAnimate',
                                   files:['/javascripts/admin/bower_components/angular-animate/angular-animate.js']
                              })
                              $ocLazyLoad.load(
                                   {
                                        name:'ngCookies',
                                        files:['/javascripts/admin/bower_components/angular-cookies/angular-cookies.js']
                                   })
                                   $ocLazyLoad.load(
                                        {
                                             name:'ngResource',
                                             files:['/javascripts/admin/bower_components/angular-resource/angular-resource.js']
                                        })
                                        $ocLazyLoad.load(
                                             {
                                                  name:'ngSanitize',
                                                  files:['/javascripts/admin/bower_components/angular-sanitize/angular-sanitize.js']
                                             })
                                             $ocLazyLoad.load(
                                                  {
                                                       name:'ngTouch',
                                                       files:['/javascripts/admin/bower_components/angular-touch/angular-touch.js']
                                                  })
                                             }
                                        }
                                   })
                                   .state('dashboard.home',{
                                        url:'/home',
                                        templateUrl:'/templates/admin/dashboard/home.html',
                                        controller:'CountController',
                                        resolve: {
                                             loadMyFiles:function($ocLazyLoad) {
                                                  return $ocLazyLoad.load({
                                                       name:'corsaAdminApp',
                                                       files:[
                                                            '/javascripts/admin/controllers/main.js',
                                                            '/javascripts/admin/directives/timeline/timeline.js',
                                                            '/javascripts/admin/directives/notifications/notifications.js',
                                                            '/javascripts/admin/directives/chat/chat.js',
                                                            '/javascripts/admin/directives/dashboard/stats/stats.js'
                                                       ]
                                                  })
                                             }
                                        }
                                   })

                                   .state('dashboard.form',{
                                        templateUrl:'/templates/admin/form.html',
                                        url:'/form'
                                   })
                                   .state('dashboard.blank',{
                                        templateUrl:'/templates/admin/pages/blank.html',
                                        url:'/blank'
                                   })
                                   .state('dashboard.chart',{
                                        templateUrl:'/templates/admin/chart.html',
                                        url:'/chart',
                                        controller:'ChartCtrl',
                                        resolve: {
                                             loadMyFile:function($ocLazyLoad) {
                                                  return $ocLazyLoad.load({
                                                       name:'chart.js',
                                                       files:[
                                                            '/javascripts/admin/bower_components/angular-chart.js/dist/angular-chart.min.js',
                                                            '/javascripts/admin/bower_components/angular-chart.js/dist/angular-chart.css'
                                                       ]
                                                  }),
                                                  $ocLazyLoad.load({
                                                       name:'corsaAdminApp',
                                                       files:['/javascripts/admin/controllers/chartContoller.js']
                                                  })
                                             }
                                        }
                                   })
                                   .state('dashboard.user',{
                                        templateUrl:'/templates/admin/user.html',
                                        url:'/user',
                                        controller: 'UserManageController',
                                        params :{
                                             message :null
                                        }
                                   })
                                   .state('dashboard.edit',{
                                        templateUrl:'/templates/admin/editUser.html',
                                        url:'/editUser?refId',
                                        controller:'UserManageController'
                                   })
                                   .state('dashboard.profile',{
                                        templateUrl:'/templates/admin/dashboard/profile.html',
                                        url:'/profile?refId',
                                        controller:'UserManageController'
                                   })
                                   .state('dashboard.newsletter',{
                                        templateUrl:'/templates/admin/newsletter.html',
                                        url:'/newsletter',
                                        controller: 'UserManageController',
                                        params :{
                                             message :null
                                        }
                                   })
                                   .state('dashboard.carList',{
                                        templateUrl:'/templates/admin/dashboard/carList.html',
                                        url:'/carList?refId',
                                        controller:'UserManageController'
                                   })
                                   .state('dashboard.carInfo',{
                                        templateUrl:'/templates/admin/dashboard/carInfo.html',
                                        url:'/carInfo?vehicleId',
                                        controller:'UserManageController'
                                   })
                                   .state('dashboard.table',{
                                        templateUrl:'/templates/admin/table.html',
                                        url:'/table'
                                   })
                                   .state('dashboard.panels-wells',{
                                        templateUrl:'/templates/admin/ui-elements/panels-wells.html',
                                        url:'/panels-wells'
                                   })
                                   .state('dashboard.buttons',{
                                        templateUrl:'/templates/admin/ui-elements/buttons.html',
                                        url:'/buttons'
                                   })
                                   .state('dashboard.notifications',{
                                        templateUrl:'/templates/admin/ui-elements/notifications.html',
                                        url:'/notifications'
                                   })
                                   .state('dashboard.typography',{
                                        templateUrl:'/templates/admin/ui-elements/typography.html',
                                        url:'/typography'
                                   })
                                   .state('dashboard.icons',{
                                        templateUrl:'/templates/admin/ui-elements/icons.html',
                                        url:'/icons'
                                   })
                                   .state('dashboard.grid',{
                                        templateUrl:'/templates/admin/ui-elements/grid.html',
                                        url:'/grid'
                                   })
                                   .state('dashboard.email',{
                                        templateUrl:'/templates/admin/email.html',
                                        url:'/email',
                                        controller: 'UserManageController'
                                   })
                                   .state('dashboard.sendemail',{
                                        templateUrl:'/templates/admin/sendemail.html',
                                        url:'/sendemail',
                                        controller: 'UserManageController'
                                   })
                                   .state('dashboard.editemail',{
                                        templateUrl:'/templates/admin/editemail.html',
                                        url:'/editemail?templateId',
                                        controller: 'UserManageController'
                                   })
                                   .state('dashboard.viewemail',{
                                        templateUrl:'/templates/admin/dashboard/viewemail.html',
                                        url:'/viewemail?templateId',
                                        controller: 'UserManageController'
                                   })
                                   .state('dashboard.carlist',{
                                        templateUrl:'/templates/admin/carlist.html',
                                        url:'/carlist',
                                        controller: 'AddCarController'
                                   })
                                   .state('dashboard.addcar',{
                                        templateUrl:'/templates/admin/addcar.html',
                                        url:'/addcar',
                                        controller: 'AddCarController'
                                   })
                                   .state('dashboard.editcar',{
                                        templateUrl:'/templates/admin/editcar.html',
                                        url:'/editcar?reqId',
                                        controller: 'AddCarController'
                                   })
                                   .state('dashboard.viewcar',{
                                        templateUrl:'/templates/admin/viewcar.html',
                                        url:'/viewcar?reqId',
                                        controller: 'AddCarController'
                                   })
                                   .state('dashboard.brandlist',{
                                        templateUrl:'/templates/admin/brandlist.html',
                                        url:'/brandlist',
                                        controller: 'AddBrandController'
                                   })
                                   .state('dashboard.addbrand',{
                                        templateUrl:'/templates/admin/addbrand.html',
                                        url:'/addbrand',
                                        controller: 'AddBrandController'
                                   })
                                   .state('dashboard.editbrand',{
                                        templateUrl:'/templates/admin/editbrand.html',
                                        url:'/editbrand?reqId',
                                        controller: 'AddBrandController'
                                   })
                                   .state('dashboard.infraction',{
                                        templateUrl:'/templates/admin/infraction.html',
                                        url:'/infraction',
                                        controller: 'infractionController'
                                   })
                                   .state('dashboard.carInfo1',{
                                        templateUrl:'/templates/admin/dashboard/carInfo.html',
                                        url:'/carInfo1?vehicleId',
                                        controller:'infractionController'
                                   })
                                   .state('dashboard.transaction',{
                                        templateUrl:'/templates/admin/dashboard/transaction.html',
                                        url:'/transaction',
                                        controller:'TransactionController'
                                   })
                                   .state('dashboard.viewTransaction',{
                                        templateUrl:'/templates/admin/dashboard/ViewTransaction.html',
                                        url:'/viewTransaction?transactionId',
                                        controller:'TransactionController'
                                   })
                                   .state('dashboard.setting',{
                                        templateUrl:'/templates/admin/setting.html',
                                        url:'/setting',
                                        controller: 'settingController'
                                   })
                                   .state('dashboard.country',{
                                        templateUrl:'/templates/admin/countryList.html',
                                        url:'/country',
                                        controller:'countryController'
                                   })
                                   .state('dashboard.addState',{
                                        templateUrl:'/templates/admin/addState.html',
                                        url:'/addState',
                                        controller:'countryController'
                                   })
                                   .state('dashboard.editCountry',{
                                        templateUrl:'/templates/admin/stateEdit.html',
                                        url:'/editCountry?reqId',
                                        controller: 'countryController'
                                   })
                                   .state('dashboard.blog',{
                                        templateUrl:'/templates/admin/blogList.html',
                                            url:'/blog',
                                        controller: 'BlogController'
                                   })
                                   .state('dashboard.addBlog',{
                                        templateUrl:'/templates/admin/addBlog.html',
                                            url:'/addBlog',
                                        controller: 'BlogController'
                                   })
                                   .state('dashboard.editBlog',{
                                        templateUrl:'/templates/admin/editBlog.html',
                                            url:'/editBlog?blogId',
                                        controller: 'BlogController'
                                   })
                                   .state('dashboard.CountryName',{
                                        templateUrl:'/templates/admin/CountryNameList.html',
                                        url:'/CountryName',
                                        controller:'CountryNameController'
                                   })
                                   .state('dashboard.addCountryName',{
                                        templateUrl:'/templates/admin/addCountry.html',
                                        url:'/addCountryName',
                                        controller:'CountryNameController'
                                   })
                                   .state('dashboard.editCountryName',{
                                        templateUrl:'/templates/admin/editCountryName.html',
                                        url:'/editCountryName?reqId',
                                        controller: 'CountryNameController'
                                   })
                                   .state('dashboard.airport',{
                                        templateUrl:'/templates/admin/airport.html',
                                        url:'/airport',
                                        controller: 'AirportController'
                                   })
                                   .state('dashboard.addAirport',{
                                        templateUrl:'/templates/admin/addAirport.html',
                                        url:'/addAirport',
                                        controller: 'AirportController'
                                   })
                                   .state('dashboard.editAirport',{
                                        templateUrl:'/templates/admin/editAirport.html',
                                        url:'/editAirport?reqId',
                                        controller: 'AirportController'
                                   })
                                   .state('dashboard.chat',{
                                        templateUrl:'/templates/admin/dashboard/chat.html',
                                        url:'/chat',
                                        resolve: {
                                             loadMyFiles:function($ocLazyLoad) {
                                                  return $ocLazyLoad.load({
                                                       name:'corsaAdminApp',
                                                       files:[
                                                            '/javascripts/admin/directives/chat/chat.js'
                                                       ]
                                                  })
                                             }
                                        }
                                   })


                              }]);
