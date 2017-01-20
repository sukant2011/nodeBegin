module.exports =  function ($uibModalInstance, $scope, items ) {

     $scope.videoSrc = items;

     $scope.ok = function (obj) {
          $uibModalInstance.close(true);
     };

     $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
     };

}
