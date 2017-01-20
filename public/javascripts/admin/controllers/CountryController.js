/**--------------------------------------------------------------------------
Name                   : countryController
Description            : use to Count Number of user and vehicle  and  complaints
--------------------------------------------------------------------------*/


angular.module('corsaAdminApp').controller('countryController',['$LocalService','$scope', '$rootScope', '$state', '$AuthService', '$SessionService', '$location', '$localStorage','$AccountService','CountService','CarBrandService','$stateParams','countryService','NgTableParams','CountryNameService', function($LocalService, $scope, $rootScope, $state, $AuthService, $SessionService, $location, $localStorage,$AccountService,CountService,CarBrandService,$stateParams,countryService,NgTableParams,CountryNameService) {


     var CountryId = (  $stateParams.reqId ) ? $stateParams.reqId : "";
     //console.log(bId);
     //$scope.brands=['Acura','Alfa Romeo','Aston', 'Martin','Buick','Dodge','HUMMER','GMC','Hyundai','Honda','Jeep','BMW','Audi','Ferrari','Land Rover','Mercury','Volvo','Volkswagen'];
     $scope.saveCountry = function(obj) {

          obj.states= obj.states.split(",");
          //console.log(obj);

          countryService.add (obj, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};

                    $state.go('dashboard.country', {message: serverMsg});
               }
          });
     };

     $scope.removeCountry = function(id){
          countryService.remove(id,function(response){
               if(response.resStatus == "error"){
                    serverMsg={resStatus:response.resStatus,msg: response.msg};
                    $scope.serverMsg = serverMsg;
               }else if(response.resStatus ="success"){
                    $scope.DataModel = response.result;
                    $state.reload();
               }
          });
     };

      var serviceCountryApi =  {
          //
          viewCountry : function (countryId) {
               countryService.view(countryId, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.obj = response.result;

                    }
               });
          },

          listCountry : function () {

               countryService.list(function (response) {
                    var serverMsg;
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.allCountry = response.result;
                         $scope.countryTable = new NgTableParams({}, {dataset: $scope.allCountry});
                    }
               });
          },
     //
          editCountry: function (obj) {
               //console.log(obj);
               if(obj.models) {
                    obj.models= obj.models.split(",");
               }
               countryService.update(obj, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.DataModel = response.result;
                         $state.go('dashboard.country');
                    }
               });
          },

          getCountryName : function(){
               CountryNameService.list ( function (response) {
                    if(response.resStatus == "error") {
                         $scope.serverMsg = serverMsg;
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    } else if(response.resStatus == "success") {
                         $scope.CountrysArr = response.result;
                    }
               });
          }

      };

     if($state.current.name == 'dashboard.country') {

          serviceCountryApi.listCountry();

     }



     $scope.updateCountry = function(obj){
          serviceCountryApi.editCountry(obj);
     }


     if(CountryId) {
          serviceCountryApi.viewCountry(CountryId);

     }
     if($state.current.name == 'dashboard.addState') {
          serviceCountryApi.getCountryName();

     }
     if($state.current.name == 'dashboard.editCountry') {
          serviceCountryApi.getCountryName();

     }

     // if($state.current.name == 'dashboard.editCountryName') {
     //      serviceCountryApi.getCountryName();
     //
     // }





}]);
