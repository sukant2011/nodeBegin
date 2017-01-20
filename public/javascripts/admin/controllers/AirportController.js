/**--------------------------------------------------------------------------
Name                   : AirportController
Description            : use to add & delete airports
--------------------------------------------------------------------------*/


angular.module('corsaAdminApp').controller('AirportController',['$scope', '$rootScope', '$state','$stateParams','NgTableParams','VechileService', function($scope, $rootScope, $state,$stateParams ,NgTableParams,VechileService) {


var airportId= (  $stateParams.reqId ) ? $stateParams.reqId : "";
//console.log(bId);


$scope.saveAirport = function(obj) {
     //obj.models= $scope.models.split(",");
     VechileService.addAirport (obj, function (response) {
          if(response.resStatus == "error") {
               serverMsg = {resStatus : response.resStatus, msg: response.msg};
               $scope.serverMsg = serverMsg;
          } else if(response.resStatus == "success") {
               serverMsg = {resStatus : response.resStatus, msg: response.msg};
               $state.go('dashboard.airport', {message: serverMsg});
          }
     });
};

$scope.removeAirport = function(id){
     //console.log(id);
    VechileService.removeAirport(id,function(response){
          if(response.resStatus == "error"){
               serverMsg={resStatus:response.resStatus,msg: response.msg};
               $scope.serverMsg = serverMsg;
          }else if(response.resStatus ="success"){
               $scope.DataModel = response.result;
               $state.reload();
          }
    });
};




var serviceApi ={


     listAirport :  function () {
         VechileService.listAirport(function (response) {
               var serverMsg;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.allAirport = response.result;
                    $scope.brandTable = new NgTableParams({}, {dataset: $scope.allAirport});
               }
         });
     },
     viewAirport : function (airportId) {
         VechileService.viewAirport(airportId, function (response) {
               //console.log(airportId);
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.airport = response.result;
                    //console.log($scope.DataModel);

               }
         });
     },

     editAirport : function (obj) {
         VechileService.updateAirport(obj, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {

                    $scope.DataModel = response.result;
                    $state.go('dashboard.airport');
               }
         });
     }
};





if($state.current.name == 'dashboard.airport') {
     serviceApi.listAirport();

}
// if($state.current.name == 'dashboard.editAirport') {
//      serviceApi.viewAirport();
//
// }
if(airportId){
     serviceApi.viewAirport(airportId);
}

$scope.updateAirport = function(obj){
     serviceApi.editAirport(obj);
}





}]);
