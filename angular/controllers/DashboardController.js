/**--------------------------------------------------------------------------
Name                   : DashboardController
Description            : use to authenticate the navigation item & logout functionality
--------------------------------------------------------------------------*/

module.exports = function($timeout,$scope, $rootScope, $state, $stateParams, $SessionService, VehicleService) {

     /**   Displaying flash message */
     if($stateParams.message != null) {
          $scope.statusMsg = true;
          $scope.serverMsg = $stateParams.message;


     }
     $timeout(function(){
          $scope.statusMsg = false;
          console.log("changed");
     }, 5000);




     var getCities = function () {
          VehicleService.getCities(function (response){
               serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.citiesArr = response.result;
               }
          });
     }();

     /** Get All cars to aparticualr User*/
     if($state.current.name == 'user.myCars') {
          VehicleService.myVehicles($SessionService.user()._id, function (response){
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.dataArr = response.result;
               }
          });
     }

     $scope.search=function(obj){
          var obj = obj || {};
          if($scope.autocomplete) {
               if($scope.autocomplete.getPlace()) {
                    obj.location = $scope.autocomplete.getPlace().formatted_address;
                    var location = $scope.autocomplete.getPlace().geometry.location;
                    var placeObj = $scope.autocomplete.getPlace();
                    obj.lat = location.lat();
                    obj.lon = location.lng();
                    placeObj.address_components.forEach(function (item) {
                         for(i=0; i<item.types.length; i++) {
                              if(item.types[i] =='locality'){
                                   obj.city = item.long_name ? item.long_name : "";
                              }
                              if(item.types[i] =='country'){
                                   obj.country = item.long_name ? item.long_name : "";
                              }
                              if(item.types[i] =='administrative_area_level_1'){
                                   obj.state = item.long_name ? item.long_name : "";
                              }
                         }
                    });
                    $state.go('anon.search.list', {message : obj});
               }
          }
     }


}
