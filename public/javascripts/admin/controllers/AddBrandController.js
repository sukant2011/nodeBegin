/**--------------------------------------------------------------------------
Name                   : AddBrandController
Description            : use to add & delete brand
--------------------------------------------------------------------------*/


angular.module('corsaAdminApp').controller('AddBrandController',['$LocalService','$scope', '$rootScope', '$state', '$AuthService', '$SessionService', '$location', '$localStorage','$AccountService','CountService','CarBrandService','$stateParams','addBrandService','NgTableParams', function($LocalService, $scope, $rootScope, $state, $AuthService, $SessionService, $location, $localStorage,$AccountService,CountService,CarBrandService,$stateParams,addBrandService,NgTableParams) {


var bId= (  $stateParams.reqId ) ? $stateParams.reqId : "";
//console.log(bId);


$scope.savebrand = function(obj) {
     //obj.models= $scope.models.split(",");
     addBrandService.add (obj, function (response) {
          if(response.resStatus == "error") {
               serverMsg = {resStatus : response.resStatus, msg: response.msg};
               $scope.serverMsg = serverMsg;
          } else if(response.resStatus == "success") {
               serverMsg = {resStatus : response.resStatus, msg: response.msg};
               $state.go('dashboard.brandlist', {message: serverMsg});
          }
     });
};

$scope.removebrand = function(id){
     console.log(id);
    addBrandService.remove(id,function(response){
          if(response.resStatus == "error"){
               serverMsg={resStatus:response.resStatus,msg: response.msg};
               $scope.serverMsg = serverMsg;
          }else if(response.resStatus ="success"){
               $scope.DataModel = response.result;
               $state.reload();
          }
    });
};




var servicebrandApi ={


     listbrand :  function () {
         addBrandService.list(function (response) {
               var serverMsg;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.allbrand = response.result;
                    $scope.brandTable = new NgTableParams({}, {dataset: $scope.allbrand});
               }
         });
     },
     viewCars : function (bId) {
         addBrandService.view(bId, function (response) {
               console.log(bId);
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.DataModel = response.result;
                    console.log($scope.DataModel);

               }
         });
     },

     editbrand : function (obj) {
         addBrandService.update(obj, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {

                    $scope.DataModel = response.result;
                    $state.go('dashboard.brandlist');
               }
         });
     }
};


$scope.updatedBrandStatus=function(brandId,status){
     console.log(brandId);

     addBrandService.status(brandId,status,function(response){
          if(response.resStatus == "error"){
               serverMsg={resStatus:response.resStatus,msg: response.msg};
               $scope.serverMsg = serverMsg;
          }else if(response.resStatus ="success"){
               $scope.sts = response.result;
               //console.log($scope.sts);
              $state.reload();
          }
     });

}


if($state.current.name == 'dashboard.brandlist') {
     servicebrandApi.listbrand();

}
if(bId){
     servicebrandApi.viewCars(bId);
}

$scope.updatebrand = function(obj){
     servicebrandApi.editbrand(obj);
}





}]);
