/**--------------------------------------------------------------------------
Name                   : ReferraController
Description            :
--------------------------------------------------------------------------*/

module.exports = function($scope, $state, $stateParams, $SessionService, VehicleService,$uibModal,$location) {

     if($state.current.name == "user.referrals"){
          var getReferralCode= function(){
               $scope.referCode = $SessionService.user()._id;
               $scope.referCodeUrl = $location.protocol() + '://'+ $location.host() +':'+  $location.port()   + '/#/user/referral/Invitation?referCode=' + $scope.referCode;
                 //console.log($scope.referCodeUrl);
          }();
     }

     if($state.current.name == "user.referralInvitation"){
          var getReferralData = function(){
               /** Function to get Referral Info */
               VehicleService.referralData($stateParams.referCode, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    } else if(response.resStatus == "success") {
                         $scope.DataModel = response.result;
                         $scope.DataModel.code = $stateParams.referCode;
                         if (response.result.profile.path == undefined) {
                              $scope.DataModel.profilePhoto = response.result.profile.photo;
                         } else {
                              $scope.DataModel.profilePhoto = response.result.profile.path + response.result.profile.photo;
                         }
                         //$scope.DataModel.profilePhoto = "/media/u_default.png";
                    }
               });
          }();
     }

     $scope.emailFormPopup=function(){
          var modalInstance = $uibModal.open({
               ariaLabelledBy: 'modal-title',
               ariaDescribedBy: 'modal-body',
               templateUrl: 'emailpopup.html',
               controller: 'ModalReferralController',
               controllerAs: '$ctrl',
               resolve: {
                    items: function () {
                         return { referCode : $scope.referCode, referCodeUrl : $scope.referCodeUrl};
                    }
               }
          });
          modalInstance.result.then(function (obj) {

          }, function () {
               //$log.info('Modal dismissed at: ' + new Date());
          });
     }

}
