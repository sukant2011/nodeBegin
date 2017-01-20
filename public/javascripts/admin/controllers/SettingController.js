/**--------------------------------------------------------------------------
Name                   : SettingController
Description            :
--------------------------------------------------------------------------*/


angular.module('corsaAdminApp').controller('settingController',['$scope', '$state', '$AuthService', '$SessionService','$stateParams', 'settingService' ,function( $scope, $state, $AuthService, $SessionService,$stateParams,settingService) {



     $scope.saveSetting = function(obj) {
          console.log(obj);
          settingService.add (obj, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    //console.log("save");
                    //$state.go('dashboard.', {message: serverMsg});
               }
          });
     };



     var serviceSettingApi =  {




          listLink : function () {
               settingService.list(function (response) {
                    var serverMsg;
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.setting = response.result;
                    }
               });
          },

          editLink : function (obj) {
               if(obj.models) {
                    obj.models= obj.models.split(",");
               }
               settingService.update(obj, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.DataModel = response.result;
                        $state.reload();
                    }
               });
          },

     };

     if($state.current.name == 'dashboard.setting') {
          serviceSettingApi.listLink();

     }


     $scope.updateLink = function(obj){
          serviceSettingApi.editLink(obj);
     }



}]);
