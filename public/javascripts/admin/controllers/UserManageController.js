/**--------------------------------------------------------------------------
Name                   : AccountController
Description            : use to view  the user item & accoununt functionality
--------------------------------------------------------------------------*/

angular.module('corsaAdminApp').controller('UserManageController',['$LocalService','$scope', '$rootScope', '$state', '$AuthService', '$SessionService','$AccountService','$stateParams','EmailService','VechileService','NgTableParams',function($LocalService, $scope, $rootScope, $state, $AuthService, $SessionService, $AccountService,$stateParams,EmailService,VechileService,NgTableParams) {

     var serverMsg;

     var userId = (  $stateParams.refId ) ? $stateParams.refId : "";
     var tempId = (  $stateParams.templateId ) ? $stateParams.templateId : "";
     var carId= (  $stateParams.vehicleId ) ? $stateParams.vehicleId : ""
     $scope.myInterval = 5000;
     $scope.noWrapSlides = false;
     $scope.active = 0;

     var serviceApi = {

          getAllUser : function(){
               $AccountService.list(function (response) {
                    var serverMsg;
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.AllUser = response.result;
                         $scope.usersTable = new NgTableParams({}, {dataset: $scope.AllUser});

                    }
               })
          },

          getUserInfo : function (userId) {
               $AccountService.view(userId, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.DataModel = response.result;

                    }
               });
          },
          removeUserData: function(userId){
               $AccountService.remove(userId,function(response){
                    if(response.resStatus == "error"){
                         serverMsg={resStatus:response.resStatus,msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    }else if(response.resStatus ="success"){
                         $scope.DataModel = response.result;
                         $state.reload();
                    }
               });
          },

          listTemplates : function () {
               EmailService.list(function (response) {
                    var serverMsg;
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.allmail = response.result;
                    }
               });
          },

          editemail : function (tempId) {
               EmailService.view(tempId, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.htmlcontent = response.result.description;
                         $scope.DataModel = response.result;
                    }
               });
          },
          getCarList:function(userId){
               //console.log(userCarList)
            VechileService.userCarList(userId, function (response) {
                 if(response.resStatus == "error") {
                      serverMsg = {resStatus : response.resStatus, msg: response.msg};
                      $scope.serverMsg = serverMsg;
                 } else if(response.resStatus == "success") {
                      if(response.result != undefined || response.result.length > 0){
                          $scope.carList = response.result;
                      }
                      else{
                            $scope.message ="No Record Found";
                      }


                 }

              });
       },
       getCarInfo : function (carId) {
            VechileService.viewCar(carId, function (response) {
                 if(response.resStatus == "error") {
                      serverMsg = {resStatus : response.resStatus, msg: response.msg};
                      $scope.serverMsg = serverMsg;
                 } else if(response.resStatus == "success") {
                      $scope.vehicleDetail = response.result;

                 }
            });
       }

 }

   $scope.viewApi = {
          /**update user data **/
          account : function () {
               $scope.DataModel = $scope.DataModel || {};
               if ($scope.myFile) {
                    $scope.DataModel.file = $scope.myFile[0];
               }
               $AccountService.account(userId, $scope.DataModel, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    }else if(response.resStatus == "success") {
                         $scope.serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.User = response.result;
                         $state.go('dashboard.user',{message:serverMsg});
                    }
               });
          },

          //get newsletter subscriber
        getSubscribers : function(){
                $AccountService.newsletter(function(response){
                     if(response.resStatus == "error"){
                          $scope.serverMsg = serverMsg;
                     }else if(response.resStatus ="success"){
                          $scope.AllSubscriber = response.result;
                          $scope.subscriberTable = new NgTableParams({}, {dataset: $scope.AllSubscriber});
                     }
                });

         }
     }

     /**  List  All User */
     if($state.current.name == 'dashboard.user') {
          serviceApi.getAllUser();

     }

       /** User Car LIst **/
     $scope.userCarList = function(userId){
           serviceApi.getCarList(userId);
      }

  //get all newsletter subscriber

  if($state.current.name == 'dashboard.newsletter') {
        $scope.viewApi.getSubscribers();

  }
  /** get Vechile info  **/
       if(carId){
            serviceApi.getCarInfo(carId);
      }
     /**  edit user  **/
     $scope.editUser = function(userId){
          serviceApi.getUserInfo(userId);
     }

     /** If stateParams*/

     if(userId) {
          serviceApi.getUserInfo(userId);
          serviceApi.getCarList(userId)
     }


     /** remove user **/
     $scope.removeUser= function(userId){
          serviceApi.removeUserData(userId);
     }


     //=========================view Email  list=====================================
     if($state.current.name == 'dashboard.email') {
          serviceApi.listTemplates();
     }

     //======================================================send mail =================
     $scope.Sendemail = function(obj) {
          obj.description= $scope.htmlcontent
          EmailService.add (obj, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $state.go('dashboard.email', {message: serverMsg});
               }
          });
     };

     //================================delete email=========================================
     $scope.removeEmailData = function(tempId){
          EmailService.remove(tempId,function(response){
               if(response.resStatus == "error"){
                    serverMsg={resStatus:response.resStatus,msg: response.msg};
                    $scope.serverMsg = serverMsg;
               }else if(response.resStatus ="success"){
                    $scope.DataModel = response.result;
                    $state.reload();
               }
          });
     }

     //==========================update email ========================
     $scope.updateEmail = function(obj){
          obj.description= $scope.htmlcontent
          EmailService.update (obj, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $state.go('dashboard.email', {message: serverMsg});
               }
          });
     }
    // if tempid go to editmail page
     if(tempId) {
          serviceApi.editemail(tempId);
     }

//==========================status blobk ========================

       $scope.updatedStatus=function(carId,status){
          //   var modalInstance = $uibModal.open({
          //       //animation: $ctrl.animationsEnabled,
          //       ariaLabelledBy: 'modal-title',
          //       ariaDescribedBy: 'modal-body',
          //       templateUrl: 'deleteListing.html',
          //       controller: 'ModalInstanceController',
          //       controllerAs: '$ctrl',
          //       size: 'sm',
          //  });
          //  modalInstance.result.then(function (selectedItem) {
            VechileService.status(carId,status,function(response){
                 if(response.resStatus == "error"){
                      serverMsg={resStatus:response.resStatus,msg: response.msg};
                      $scope.serverMsg = serverMsg;
                 }else if(response.resStatus ="success"){
                      $scope.sts = response.result;
                      //console.log($scope.sts);
                     $state.reload();
                 }
            });
     //   }, function () {
     //       //$log.info('Modal dismissed at: ' + new Date());
     //  }); return;
     }
/****user  status *****/
$scope.updatedUserStatus=function(userId,status){
          //console.log(userId);

          $AccountService.status(userId,status,function(response){
               if(response.resStatus == "error"){
                    serverMsg={resStatus:response.resStatus,msg: response.msg};
                    $scope.serverMsg = serverMsg;
               }else if(response.resStatus ="success"){
                    $scope.sts = response.result;
                    //console.log($scope.sts);
                   $state.reload();
               }
          });

   }

   /**** license  status *****/
   $scope.updatedLicenseStatus=function(userId,status){
             $AccountService.licenseStatus(userId,status,function(response){
                  if(response.resStatus == "error"){
                       serverMsg={resStatus:response.resStatus,msg: response.msg};
                       $scope.serverMsg = serverMsg;
                  }else if(response.resStatus ="success"){
                       $scope.stus = response.result;
                       //console.log($scope.sts);
                      $state.reload();
                  }
             });

      }

}]);
