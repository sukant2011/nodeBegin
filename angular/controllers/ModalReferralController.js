module.exports =  function ($uibModalInstance,items,$scope, VehicleService) {

     $scope.referObj = items;

     $scope.sendEmailReferral = function(){
          if($scope.referObj && $scope.referObj.email && Object.keys($scope.referObj.email).length) {
               VehicleService.sendReferrals($scope.referObj, function (response) {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    if(response.resStatus == "error") {
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.serverMsg = serverMsg;
                    }
               });
          }
     }

     $scope.ok = function (obj) {
          $uibModalInstance.close(true);
     };

     $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
     };
}
