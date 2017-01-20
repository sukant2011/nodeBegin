angular.module('corsaAdminApp').controller('infractionController',['$LocalService','$scope', '$rootScope', '$state', '$AuthService', '$SessionService', '$location', '$localStorage','$AccountService','CountService','CarBrandService','$stateParams','addBrandService','InfractionService','VechileService', 'NgTableParams',function($LocalService, $scope, $rootScope, $state, $AuthService, $SessionService, $location, $localStorage,$AccountService,CountService,CarBrandService,$stateParams,addBrandService,InfractionService,VechileService,NgTableParams) {


 var bId= (  $stateParams.vehicleId ) ? $stateParams.vehicleId : "";




 var serviceReportApi ={

     listInfraction :  function () {
         InfractionService.list(function (response) {
               var serverMsg;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.allReport = response.result;
                    $scope.usersTable = new NgTableParams({}, {dataset: $scope.allReport});
                    //console.log($scope.allReport);
               }
         });
    },
     getCarInfo : function (carId) {
          VechileService.viewCar(carId, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.vehicleDetail = response.result;

               }
          });
    }




};


if($state.current.name == 'dashboard.infraction') {
     serviceReportApi.listInfraction();

}
if(bId){
     serviceReportApi.getCarInfo(bId);
}






}]);
