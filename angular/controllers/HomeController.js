

//Angular App Module and Controller

module.exports = function ($scope, $state, $uibModal, $sce,$AccountService,$location,$anchorScroll,$window) {

     var momentObj = moment("12:15 AM", ["h:mm A"])




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

     // To set maxdate in startdate
     function customRangeStart(input){
          return {
               maxDate:(input.id == "startDate" ?angular.element("#endDate").datepicker("getDate") : null)
          };
     }

     $scope.searchVehicle=function(obj){
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
                    //console.log("===========");
                    $state.go('anon.search.list', {message : obj});
                    //$state.go("user.dashboard", {message:serverMsg});
               } else {
                    //console.log("===========");
                    $scope.isRequired = true;
               }
          } else {
               $scope.isRequired = true;
          }
     }

     $scope.playVideo = function () {
          var modalInstance = $uibModal.open({
               //animation: $ctrl.animationsEnabled,
               ariaLabelledBy: 'modal-title',
               ariaDescribedBy: 'modal-body',
               templateUrl: '/elements/videoPopup.html',
               controller: 'ModalInstanceController',
               resolve: {
                    items : $sce.trustAsResourceUrl('https://www.youtube.com/embed/67Z6cGQIUTQ')
               }
          });
          modalInstance.result.then(function (selectedItem) {

          }, function () {

          });
     }

     $scope.dispalyDuration = function () {
          $scope.showDuration = true;
     }

     angular.element('#startDate').datepicker({
               //beforeShow: customRangeStart,
               minDate: new Date(),
     });

     // $scope.watch(
     //      function () {
     //           return $scope.ctrl.fromTime;
     //      },
     //      function (old, newVal) {
     //           console.log(old+"======"+newVal);
     //      }
     // );

     angular.element('#endDate').datepicker({
               beforeShow: customRange,
     });

     $scope.fromDate = getDate();
     $scope.toDate = getDate(7);

     // $scope.$watch('fromDate', function (newValue, oldValue, scope) {
     //       console.log(newValue+"======"+oldValue);
     //      //Do anything with $scope.letters
     // });

     $scope.submitNewsletter = function(){
          $AccountService.newsletter($scope.email,function(response){
               var serverMsg;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
                    //console.log($scope.serverMsg )
               }
          });
     }

     //
     $scope.gotoAnchor = function(x) {
          var newHash = 'anchor' + x;
          if ($location.hash() !== newHash) {
               $location.hash('anchor' + x);
          } else {
               $anchorScroll();
          }
     };

     $scope.gotoTop = function(){
          $window.scrollTo(0, 0);
          }

}
