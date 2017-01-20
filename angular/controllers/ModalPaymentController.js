module.exports =  function ($uibModalInstance, $scope, items, VehicleService,$localStorage, $location) {

     /** initialise paymentObj with informations */
     $scope.paymentObj = items;
     
     /** use for get the fee */
     $scope.setFee= function (fee) {
          $scope.paymentObj.fee = fee;
     }

     /** use for location */
     $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
          if($scope.paymentObj.autocomplete && $scope.paymentObj.autocomplete.getPlace()) {
               var location = $scope.paymentObj.autocomplete.getPlace().geometry.location;
               var add = $scope.paymentObj.autocomplete.getPlace();
               $scope.paymentObj.location = add.formatted_address;
               $scope.paymentObj.lat = location.lat();
               $scope.paymentObj.lon = location.lng();
          }
          $scope.$apply();
     });

     /** Function to initialize the Payment **/
     $scope.paypal = function(){
          var obj = {};
          var urlObj = {};

          if($scope.paymentObj.location){
               obj.location = $scope.paymentObj.location;
               obj.fee = $scope.paymentObj.fee;
               obj.deliveryType = 'CAR_LOCATION';
          }
          if($scope.paymentObj.guestLocation){
               obj.location = $scope.paymentObj.location
               obj.lat = $scope.paymentObj.lat
               obj.lon = $scope.paymentObj.lon
               obj.fee = $scope.paymentObj.fee;
               obj.deliveryType = 'GUEST_LOCATION';
          }
          if($scope.paymentObj.airport){
               obj.location =  $scope.paymentObj.airport;
               obj.fee = $scope.paymentObj.fee;
               obj.deliveryType = 'AIRPORT_LOCATION';
          }
          obj.startDate = $scope.paymentObj.startDate;
          obj.endDate = $scope.paymentObj.endDate;
          obj.price = $scope.paymentObj.price;
          obj.vehicleName = $scope.paymentObj.vehicleName;
          obj.vehicleId = $scope.paymentObj.vehicleId;
          urlObj.price = obj.price;
          urlObj.specifications = $scope.paymentObj.specifications;

          VehicleService.paypal(urlObj, function(response){
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $localStorage.paymentObj = obj;
                    window.location.href = response.result;
               }
          });
     }

     /** Use for Rendering Rating */
     $scope.rating = 1;
     $scope.isReadonly = true;
     $scope.rateFunction = function(rating) {
          $scope.paymentObj.rating = rating;
     };

     /** Use for saving reviews */
     $scope.saveReview  = function(obj){
          if(obj.comment){
               obj.comment = obj.comment;
          }
          obj.userId = $scope.paymentObj.userId;
          obj.rating = $scope.paymentObj.rating ? $scope.paymentObj.rating : 1;
          obj.vehicleId = $scope.paymentObj.vehicleId;
          VehicleService.review(obj,function(response){
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.ok("Hello");
               }
          });
     }

     /** Use for Closing Modal */
     $scope.ok = function (obj) {
          $uibModalInstance.close(true);
     };

     /** Use for Closing Modal */
     $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
     };

}
