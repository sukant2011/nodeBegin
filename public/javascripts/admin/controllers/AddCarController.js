/**--------------------------------------------------------------------------
Name                   : AddCarController
Description            : use to Count Number of user and vehicle  and  complaints
--------------------------------------------------------------------------*/


angular.module('corsaAdminApp').controller('AddCarController',['$LocalService','$scope', '$rootScope', '$state', '$AuthService', '$SessionService', '$location', '$localStorage','$AccountService','CountService','CarBrandService','$stateParams','NgTableParams' , function($LocalService, $scope, $rootScope, $state, $AuthService, $SessionService, $location, $localStorage,$AccountService,CountService,CarBrandService,$stateParams,NgTableParams) {


     var bId = (  $stateParams.reqId ) ? $stateParams.reqId : "";
     //console.log(bId);
     //$scope.brands=['Acura','Alfa Romeo','Aston', 'Martin','Buick','Dodge','HUMMER','GMC','Hyundai','Honda','Jeep','BMW','Audi','Ferrari','Land Rover','Mercury','Volvo','Volkswagen'];
     $scope.savecar = function(obj) {
          obj.models= $scope.models.split(",");
          CarBrandService.add (obj, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $state.go('dashboard.carlist', {message: serverMsg});
               }
          });
     };

     $scope.removeCar = function(id){
          CarBrandService.remove(id,function(response){
               if(response.resStatus == "error"){
                    serverMsg={resStatus:response.resStatus,msg: response.msg};
                    $scope.serverMsg = serverMsg;
               }else if(response.resStatus ="success"){
                    $scope.DataModel = response.result;
                    $state.reload();
               }
          });
     };

     var serviceCarApi =  {

          viewCars : function (bId) {
               CarBrandService.view(bId, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.DataModel = response.result;
                         $scope.DataModel.models = response.result.models.toString();
                    }
               });
          },

          listCar : function () {
               CarBrandService.list(function (response) {
                    var serverMsg;
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.allbrand = response.result;
                         $scope.modelTable = new NgTableParams({}, {dataset: $scope.allbrand});
                    }
               });
          },

          editCar : function (obj) {
               if(obj.models) {
                    obj.models= obj.models.split(",");
               }
               CarBrandService.update(obj, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.DataModel = response.result;
                         $state.go('dashboard.carlist');
                    }
               });
          },
          getbrand : function(){
               CarBrandService.brand ( function (response) {
                    if(response.resStatus == "error") {
                         $scope.serverMsg = serverMsg;
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    } else if(response.resStatus == "success") {
                         $scope.brandsArr = response.result;
                    }
               });
          }
     };

     if($state.current.name == 'dashboard.carlist') {
          serviceCarApi.listCar();

     }

     if($state.current.name == 'dashboard.addcar') {
          serviceCarApi.getbrand();

     }
     if($state.current.name == 'dashboard.editcar') {
          serviceCarApi.getbrand();

     }

     $scope.updatecar = function(obj){
          serviceCarApi.editCar(obj);
     }


     if(bId) {
          serviceCarApi.viewCars(bId);

     }



}]);
