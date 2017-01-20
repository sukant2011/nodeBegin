
angular.module('corsaAdminApp').controller('ModalInstanceController', function ($uibModalInstance, $scope) {
     $scope.ok = function () {
          $uibModalInstance.close(true);
     };

     $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
     };

});
