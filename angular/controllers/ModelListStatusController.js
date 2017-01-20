module.exports =  function ($uibModalInstance,items,$scope, VehicleService,$rootScope,$timeout,$state,$uibModal,$filter) {

     angular.element('#datePickerSnoozed').datepicker({
        //beforeShow: customRangeStart,
               minDate: new Date(),
     });
     /** function for get date **/

       var getDate = function (days) {
                      var today = new Date();
                      if(days) {
                           today.setDate(today.getDate() + days);
                      }
                      var dd = today.getDate();
                      var mm = today.getMonth()+1; //January is 0!
                      var yyyy = today.getFullYear();

                      if(dd<10) {
                           dd='0'+dd
                      }

                      if(mm<10) {
                           mm='0'+mm
                      }

                      return mm+'/'+dd+'/'+yyyy;
       }

       function customRange(input){
            return {
                 minDate: (input.id == "endDate" ? angular.element("#startDate").datepicker("getDate") : new Date())
            };
       }

       $scope.snoozedDate = getDate();
       angular.element('#datePickerSnoozedCancel').datepicker({
            minDate: new Date(),
       });

 //*********************snoozed date end ********************//

     $scope.statusObj = items;
//console.log($scope.statusObj);return;

     /** function for hude flash message after 5 second **/
     var hideFlash = function(){
          $timeout(function(){
               $scope.statusMsg = false;
               console.log("changed");
          }, 5000);
     }

/**----------- function for Update snnozed Status -----------------------**/
/**---------------------------------------------------------------------**/
     $scope.updateSnooze = function(endDate) {
              var obj = obj ||  {} ;
              obj.snozzedDate = endDate;
              obj._id = $scope.statusObj.vehicleId;
              obj.listingStatus = $scope.statusObj.listingStatus;
            VehicleService.update (obj, function (response) {
               $scope.statusMsg = true;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
                    hideFlash();
               } else  {
                serverMsg = {resStatus : response.resStatus, msg: response.msg}
                 $scope.serverMsg = serverMsg;

              }
             hideFlash();
         });
      }
      $scope.updateCancelSnooze = function(status,enddate) {
              var obj = obj ||  {} ;
              obj.snozzedDate =  enddate ? enddate : " ";
              obj._id = $scope.statusObj.vehicleId;
              obj.listingStatus = status;

            VehicleService.update (obj, function (response) {
               $scope.statusMsg = true;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
                    hideFlash();
               } else  {
                serverMsg = {resStatus : response.resStatus, msg: response.msg}
                 $scope.serverMsg = serverMsg;
                 $scope.cancel();
              }
             hideFlash();
         });
      }

     /**----------- function for Unlisted  Status -----------------------**/
     $scope.unlistShow=false;
     $scope.snoozedate = $scope.statusObj.snozzedDate ? $filter('date')($scope.statusObj.snozzedDate, 'MM/dd/yyyy') : '';
       $scope.nextModel = function(modeChecked){
              $scope.cancel();
            if(modeChecked == 'TEMPORARY'){

                 var modalInstance = $uibModal.open({
                      //animation: $ctrl.animationsEnabled,
                      ariaLabelledBy: 'modal-title',
                      ariaDescribedBy: 'modal-body',
                      templateUrl: 'TEMPORARY.html',
                      controller: 'ModelListStatusController',
                      controllerAs: '$ctrl',
                      resolve: {
                           items: function () {
                                return $scope.statusObj;
                           }
                      }
                 });
                 modalInstance.result.then(function (selectedItem) {
                 }, function () {
                 }); return;
            }else if(modeChecked == 'CAR_UNAVAILABLE'){
                 var modalInstance = $uibModal.open({
                      //animation: $ctrl.animationsEnabled,
                      ariaLabelledBy: 'modal-title',
                      ariaDescribedBy: 'modal-body',
                      templateUrl: 'CAR_UNAVAILABLE.html',
                      controller: 'ModelListStatusController',
                      controllerAs: '$ctrl',
                      resolve: {
                           items: function () {
                                return $scope.statusObj;
                           }
                      }
                });
                modalInstance.result.then(function (selectedItem) {
                }, function () {
                }); return;
            }else if(modeChecked == 'INSURANCE_CONCERNS'){
                 var modalInstance = $uibModal.open({
                     //animation: $ctrl.animationsEnabled,
                     ariaLabelledBy: 'modal-title',
                     ariaDescribedBy: 'modal-body',
                     templateUrl: 'INSURANCE_CONCERNS.html',
                     controller: 'ModelListStatusController',
                     controllerAs: '$ctrl',
                     resolve: {
                          items: function () {
                                return $scope.statusObj;
                          }
                     }
               });
               modalInstance.result.then(function (selectedItem) {
               }, function () {
               }); return;
            }
            else if(modeChecked == 'INSUFFICIENT_EARNINGS'){
                 var modalInstance = $uibModal.open({
                     //animation: $ctrl.animationsEnabled,
                     ariaLabelledBy: 'modal-title',
                     ariaDescribedBy: 'modal-body',
                     templateUrl: 'INSUFFICIENT_EARNINGS.html',
                     controller: 'ModelListStatusController',
                     controllerAs: '$ctrl',
                     resolve: {
                          items: function () {
                                return $scope.statusObj;
                          }
                     }
               });
               modalInstance.result.then(function (selectedItem) {
               }, function () {
               }); return;
            }
            else if(modeChecked == 'TIME_CONSUMING'){
                 var modalInstance = $uibModal.open({
                     //animation: $ctrl.animationsEnabled,
                     ariaLabelledBy: 'modal-title',
                     ariaDescribedBy: 'modal-body',
                     templateUrl: 'TIME_CONSUMING.html',
                     controller: 'ModelListStatusController',
                     controllerAs: '$ctrl',
                     resolve: {
                          items: function () {
                                return $scope.statusObj;
                          }
                     }
               });
               modalInstance.result.then(function (selectedItem) {
               }, function () {
               }); return;
            }else if(modeChecked == 'NEGATIVE_EXPERIENCE'){
                 var modalInstance = $uibModal.open({
                     //animation: $ctrl.animationsEnabled,
                     ariaLabelledBy: 'modal-title',
                     ariaDescribedBy: 'modal-body',
                     templateUrl: 'NEGATIVE_EXPERIENCE.html',
                     controller: 'ModelListStatusController',
                     controllerAs: '$ctrl',
                     resolve: {
                          items: function () {
                                return $scope.statusObj;
                          }
                     }
               });
               modalInstance.result.then(function (selectedItem) {
               }, function () {
               }); return;
            }else{
                 var modalInstance = $uibModal.open({
                     //animation: $ctrl.animationsEnabled,
                     ariaLabelledBy: 'modal-title',
                     ariaDescribedBy: 'modal-body',
                     templateUrl: 'OTHER.html',
                     controller: 'ModelListStatusController',
                     controllerAs: '$ctrl',
                     resolve: {
                          items: function () {
                                return $scope.statusObj;
                          }
                     }
               });
               modalInstance.result.then(function (selectedItem) {
               }, function () {
               }); return;
            }
       }

//******************update unliststatus***********************//

       $scope.updateUnlistSts = function(unliststatus,feedback) {
               var obj = obj ||  {} ;
               obj.listingStatus = unliststatus;
               obj._id = $scope.statusObj.vehicleId;
               obj.unlistedStatus = feedback ? feedback : '';
             VehicleService.update (obj, function (response) {
                $scope.statusMsg = true;
                if(response.resStatus == "error") {
                     serverMsg = {resStatus : response.resStatus, msg: response.msg};
                     $scope.serverMsg = serverMsg;
                     hideFlash();
                } else  {
                 serverMsg = {resStatus : response.resStatus, msg: response.msg}
                  $scope.serverMsg = serverMsg;
                  $scope.cancel();

               }
              hideFlash();
          });
       }


 /**---------------------------------------------------------------------**/


     $scope.ok = function (obj) {
          $uibModalInstance.close(true);
     };

     $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
          $state.reload();
     };

}
