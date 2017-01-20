/**--------------------------------------------------------------------------
Name                   : countryNameController
Description            : use to add country delete update country names
--------------------------------------------------------------------------*/


angular.module('corsaAdminApp').controller('CountryNameController',['$LocalService','$scope', '$rootScope', '$state', '$AuthService', '$SessionService', '$location', '$localStorage','$AccountService','CountService','CarBrandService','$stateParams','CountryNameService','NgTableParams', function($LocalService, $scope, $rootScope, $state, $AuthService, $SessionService, $location, $localStorage,$AccountService,CountService,CarBrandService,$stateParams,CountryNameService,NgTableParams) {


     var CountryNameId = (  $stateParams.reqId ) ? $stateParams.reqId : "";

     $scope.addCountryName = function(obj){
          //obj.states= obj.states.split(",");
          //console.log(obj);

          CountryNameService.add (obj, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    //console.log(response);

                    $state.go('dashboard.CountryName', {message: serverMsg});
               }
          });
     };

     $scope.removeCountryName = function(id){
          CountryNameService.remove(id,function(response){
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
          viewCountryName : function (CountryNameId) {
               CountryNameService.view(CountryNameId, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.DataModel = response.result;

                    }
               });
          },

          listCountryName : function () {
               CountryNameService.list(function (response) {
                    var serverMsg;
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.allCountryName = response.result;
                         $scope.countryTable = new NgTableParams({}, {dataset: $scope.allCountryName});
                    }
               });
          },
     //
          editCountryName: function (obj) {
               // if(obj.states) {
               //      obj.states= obj.states.split(",");
               // }
               CountryNameService.update(obj, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.DataModel = response.result;
                         $state.go('dashboard.CountryName');
                    }
               });
          },

      };

     if($state.current.name == 'dashboard.CountryName') {
          serviceCountryApi.listCountryName();

     }



     $scope.updateCountryName = function(obj){
          serviceCountryApi.editCountryName(obj);
     }


     if(CountryNameId) {
          serviceCountryApi.viewCountryName(CountryNameId);

     }
     



}]);
