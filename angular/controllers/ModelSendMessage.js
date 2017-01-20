
module.exports =  function ($state,$uibModalInstance, $scope,items,VehicleService,$localStorage,$location,$SessionService) {
// save massage
$scope.messageObj = items;

$scope.SendMsg = function(obj) {
     obj.to = $scope.messageObj.toUserId._id;
     console.log(obj.to );
     obj.from = $SessionService.user()._id;
      VehicleService.addMsg (obj, function (response) {
           if(response.resStatus == "error") {
                serverMsg = {resStatus : response.resStatus, msg: response.msg};
                $scope.serverMsg = serverMsg;
           } else if(response.resStatus == "success") {
                serverMsg = {resStatus : response.resStatus, msg: response.msg};
                $scope.ok('hell');
                $state.go('user.message', {message: serverMsg});
                }
      });
};
// save model
$scope.ok = function (obj) {
     $uibModalInstance.close(true);
};
// clear model
$scope.cancel = function () {
     $uibModalInstance.dismiss('cancel');
};

}
