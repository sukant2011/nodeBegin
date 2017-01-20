/**--------------------------------------------------------------------------
Name                   : DashboardController
Description            : use to authenticate the navigation item & logout functionality
--------------------------------------------------------------------------*/

module.exports =  function($scope, $rootScope, $state, $stateParams) {

     /**   Displaying flash message
     -----------------------------------------------*/
     if($stateParams.message != null) {
          console.log($stateParams.message);
          $scope.serverMsg = $stateParams.message;
     }

     $scope.saveCarInfo = function (carInfo) {
          console.log(carInfo);
     }

     $scope.reportSave = function(){
           console.log($scope.report);

     }

}
