/**--------------------------------------------------------------------------
Name                   : VehicleDetailController
Description            : Use to add & update vehicle Info
Author :               : Sunny Chauhan
--------------------------------------------------------------------------*/

module.exports = function($timeout, $scope, $rootScope, $stateParams, $state, $localStorage, $location, $http, VehicleService, $SessionService,$uibModal) {

     /** Variablels defined **/
     $scope.sessionUserId = $SessionService.user()._id ? $SessionService.user()._id : "";
     var vehicleRefId = (Object.keys($location.search()).length) ? $location.search().refId : "";
     var userId = ($stateParams.userId) ? $stateParams.userId : "";
     $scope.isAuthenticated = ($SessionService.user() && $SessionService.user()._id) ? true : false;
     $scope.isFavourite = false;
     $scope.myInterval = 5000;
     $scope.noWrapSlides = false;
     $scope.active = 0;
     var slides = $scope.slides = [];
     var currIndex = 0;
     $scope.trip = {};
     $scope.check=true;

     /** Function to create cmarker on google Map */
     var createMarker = function (info){
          var mapOptions = {
               zoom: 4,
               center: new google.maps.LatLng(info.lat, info.lon),
               mapTypeId: google.maps.MapTypeId.TERRAIN
          }

          $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

          $scope.markers = [];

          var infoWindow = new google.maps.InfoWindow();

          $scope.openInfoWindow = function(e, marker){
               e.preventDefault();
               google.maps.event.trigger(marker, 'load');
          }

          var marker = new google.maps.Marker({
               map: $scope.map,
               position: new google.maps.LatLng(info.lat, info.lon),
               title: info.country ? info.country : 'N/A'
          })
          marker.content = '<div class="infoWindowContent">' + info.location + '</div>';

          google.maps.event.addDomListener(marker, 'load', function(){
               infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
               infoWindow.open($scope.map, marker);
          });
           infoWindow.setContent('<h2 style="color:black;">' + marker.title + '</h2><small style="color:black;">' + marker.content+'</small>');
          infoWindow.open($scope.map, marker);

          $scope.markers.push(marker);

     }

     /** Function to get Data for vehicle */
     var getvehicleData = function() {
          VehicleService.view (vehicleRefId, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;

               } else if(response.resStatus == "success") {
                    $scope.DataModel = response.result.view;
                    $scope.rating = response.result.rating;
                    $scope.trips = response.result.trips;
                    $scope.reviews = response.result.reviews;
                    //console.log($scope.reviews);
                    createMarker(response.result.view.address);
               }
          });
     }

     /** Function to check favorite car */
     var checkFavourite = function () {
          VehicleService.checkFavourite($SessionService.user()._id, vehicleRefId, function(response){
               serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    if(response.result == true) {
                         $scope.isFavourite = true;
                    } else {
                         $scope.isFavourite = false;
                    }
               }
          });
     }

     /** Function to create cmarker on google Map */
     var getProfile = function () {
          VehicleService.myVehicles(userId, function (response){
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.cbResponse = response.result;
               }
          });
     }

     /** Function to concatenate date & time */
     var combine = function(dt, timeString) {
          var startDateTime;
          var parts = /^(\d+):(\d+) (AM|PM)$/.exec(timeString);
          if (parts) {
               hours = parseInt(parts[1], 10);
               minutes = parseInt(parts[2], 10);
               if (parts[3] === "PM" && hours !== 12) {
                    hours += 12;
               }
               else if (parts[3] === "AM" && hours === 12) {
                    hours = 0;
               }
               if (!isNaN(hours) && !isNaN(minutes)) {
                    startDateTime = new Date(dt.getTime());
                    startDateTime.setHours(hours);
                    startDateTime.setMinutes(minutes);
               }
          }
          return startDateTime;
     }


     /** Function to report car **/
     $scope.reports= function(){
          $scope.reportObj.vehicleId = $scope.DataModel._id;
          $scope.reportObj.userId = $SessionService.user()._id;
          VehicleService.report($scope.reportObj,function(response){
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.report = response.result;
                    if(serverMsg.resStatus == "success"){
                         angular.element('#myModal').modal('toggle');
                         alert(serverMsg.msg);
                    }
               }
          });
     }


     /** Function to assign  a car favourite **/
     $scope.favorite = function(key) {
          VehicleService.favourite(key, $SessionService.user()._id, vehicleRefId, function(response){
               serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    if(key == 1) {
                         $scope.isFavourite = true;
                    } else {
                         $scope.isFavourite = false;
                    }
               }
          });
     }

     /** Function to check availability of car */
     $scope.checkAvailability = function() {
          if($scope.payment.startDate &&  $scope.payment.endDate) {
               // if($scope.payment.startTime == '' || $scope.payment.startTime == undefined) {
               //      $scope.payment.startTime = "12:00 AM";
               // }
               // if($scope.payment.endTime == '' || $scope.payment.endTime == undefined) {
               //      $scope.payment.endTime = "12:00 AM";
               // }
               var startDate = ($scope.payment.startTime)?combine(new Date($scope.payment.startDate), $scope.payment.startTime) : new Date($scope.payment.startDate);
               var endDate = ($scope.payment.endTime)?combine(new Date($scope.payment.endDate), $scope.payment.endTime) : new Date($scope.payment.endDate);

               if (endDate > startDate) {
                    $scope.isRequired = false;
                    var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    $scope.trip.price  = diffDays * $scope.DataModel.ridingCost;
                    VehicleService.checkAvailability(startDate, endDate, vehicleRefId,function(response){
                         serverMsg = {resStatus : response.resStatus, msg: response.msg,result :response.result };
                         if(response.resStatus == "success") {
                              $scope.payment.modifiedStartDate = startDate;
                              $scope.payment.modifiedEndDate = endDate;
                              if(response.result == false) {
                                   $scope.check = false;
                              } else {
                                   $scope.check = true;
                              }
                         }
                         $scope.serverMsg = serverMsg;
                    });
               } else {
                    $scope.check = true;
                    $scope.isRequired = true;
               }
          }
     }


     /** Function to open a popup for choosing car location*/
     $scope.rentForCar = function(){
          var dataToSent = {
                              address : $scope.DataModel.address,
                              delivery : $scope.DataModel.delivery,
                              price: $scope.trip.price ? $scope.trip.price : $scope.DataModel.ridingCost,
                              startDate: $scope.payment.modifiedStartDate,
                              endDate: $scope.payment.modifiedEndDate,
                              vehicleId : vehicleRefId,
                              specifications :$scope.DataModel.specifications
                         };
          var modalInstance = $uibModal.open({
               //animation: $ctrl.animationsEnabled,
               ariaLabelledBy: 'modal-title',
               ariaDescribedBy: 'modal-body',
               templateUrl: 'checkAvailability.html',
               controller: 'ModalPaymentController',
               controllerAs: '$ctrl',
               resolve: {
                    items: function () {
                         return dataToSent;
                    }
               }
          });
          modalInstance.result.then(function (selectedItem) {
          }, function () {
               //$log.info('Modal dismissed at: ' + new Date());
          }); return;
     }

     /** For Paypal express checkout**/
     if($stateParams.token && $stateParams.PayerID || $state.current.name == "user.order") {
          var obj = {};
          obj.token = $stateParams.token;
          obj.PayerID = $stateParams.PayerID;
          obj.vehicleId = $localStorage.paymentObj.vehicleId;
          obj.startDate = $localStorage.paymentObj.startDate;
          obj.endDate = $localStorage.paymentObj.endDate;
          obj.userId = $SessionService.user()._id;
          obj.location = $localStorage.paymentObj.location;
          obj.fee = $localStorage.paymentObj.fee;
          obj.deliveryType = $localStorage.paymentObj.deliveryType;
          VehicleService.savePaypalTransaction(obj, function(response){
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    delete $localStorage.paymentObj;
                    $state.go('user.order');
               }
          });
     }

     if(userId) {
          getProfile();
     }

     if($state.current.name == 'anon.vehicleDetail') {
          getvehicleData();
     }

     if($SessionService.user()._id && vehicleRefId) {
          checkFavourite();
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

     angular.element('#startDate').datepicker({
          beforeShow: customRangeStart,
          minDate: new Date(),
     });

     angular.element('#endDate').datepicker({beforeShow: customRange});

}
