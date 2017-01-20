/**--------------------------------------------------------------------------
Name                   : CountController
Description            : use to Count Number of user and vehicle  and  complaints
--------------------------------------------------------------------------*/


angular.module('corsaAdminApp').controller('CountController',['$LocalService','$scope', '$rootScope', '$state', '$AuthService', '$SessionService', '$location', '$localStorage','$AccountService','CountService', function($LocalService, $scope, $rootScope, $state, $AuthService, $SessionService, $location, $localStorage,$AccountService,CountService) {

     var serviceCountApi = {

          CountUser : function(){
               CountService.user(function(response){
                    if(response.resStatus == "error"){
                         serverMsg={resStatus:response.resStatus,msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    }else if(response.resStatus ="success"){
                         $scope.use = response.data;

                    }

               });
          },

          countVehicle : function(){
               CountService.vehicle(function(response){
                    if(response.resStatus == "error"){
                         serverMsg={resStatus:response.resStatus,msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    }else if(response.resStatus ="success"){
                         $scope.DataModel = response;

                    }
               });
          }
     };
     if($state.current.name == 'dashboard.home') {
          serviceCountApi.CountUser();
          serviceCountApi.countVehicle();

     }

     // $scope.countReports = function() {
     //      CountService.reports(function (response) {
     //           var serverMsg;
     //           if(response.resStatus == "error") {
     //                serverMsg = {resStatus : response.resStatus, msg: response.msg};
     //                $scope.serverMsg = serverMsg;
     //           } else if(response.resStatus == "success") {
     //                $scope.reports = response.result;
     //           }
     //      });
     // }

}]);
