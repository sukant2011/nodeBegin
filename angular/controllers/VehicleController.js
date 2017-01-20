/**--------------------------------------------------------------------------
Name                   : VehicleController
Description            : Use to add & update vehicle Info
Author :               : Sunny Chauhan
--------------------------------------------------------------------------*/

module.exports = function($timeout, $scope, $rootScope, $stateParams, $state, $localStorage, $location, $http, VehicleService, $SessionService, $AccountService, $uibModal, $log,NgTableParams) {

     angular.element('#datePickerSnoozed').datepicker({
          minDate: new Date(),
     });

     angular.element('#datePickerSnoozedCancel').datepicker({
          minDate: new Date(),
     });

     $scope.airportsArr = $scope.airportsArr || [];

     //$scope.checkFeaturesArr = $scope.checkFeaturesArr || [];

     angular.element('#datetimepicker6').datepicker();

     /** Use for Active & Inactive Link in list car Navigation */
     $scope.linkArr = [];
     if($state.current.name == 'user.listcarIntro') {
          $scope.linkArr = [];
     } else if($state.current.name == 'user.listcarAvailability') {
          $scope.linkArr = ['Available'];
     } else if($state.current.name == 'user.listcarDetails') {
          $scope.linkArr = ['Available', 'Detail'];
     } else if($state.current.name == 'user.listcarPhotos') {
          $scope.linkArr = ['Available','Detail','Photo'];
     }  else if($state.current.name == 'user.listcarPublish') {
          $scope.linkArr = ['Available','Detail','Photo', 'Publish'];
     }

     var BookingId = ($stateParams.bookingId) ? $stateParams.bookingId : "";

     $scope.statusMsg = false;

     /** configuration For slider  */
     $scope.myInterval = 5000;
     $scope.noWrapSlides = false;
     $scope.active = 0;

     /** use to retrieve the session user id */
     var userId = ($SessionService.user()) ? $SessionService.user()._id : "";

     /** Checking if current state is child of some user.liscarLanding*/
     var isParent = ($state.current.parent && $state.current.parent == 'user.liscarLanding') ? true : false;

     /** Declaring flash message variable*/
     var serverMsg = {};

     /** Check if vehicle Id exist */
     $scope.vehicleRefId = (Object.keys($location.search()).length) ? $location.search().refId : "";

     $scope.vehicle1 = {};
     $scope.deliveryObj = [];

     /** Function to get car brands */
     var getCarBrands = function () {
          VehicleService.getCarBrands(function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
               } else if(response.resStatus == "success") {
                    $scope.makeArr = response.result;
                    if($scope.vehicleRefId) {
                         getCarModels($scope.DataModel.specifications.make);
                    }
               }
          });
     }
      //check airport

     var checkedAirports = function (airportsArr) {
          var indexArr = [];
          if (airportsArr) {
               for (var airport in airportsArr) {
                    var obj = {};
                    obj.id = airportsArr[airport].id._id;
                    obj.fee = airportsArr[airport].fee.toString();
                    $scope.airportsArr.push(obj);
                    for(var airportIndex in $scope.airports) {
                         if (airportsArr[airport].id._id  == $scope.airports[airportIndex]._id ) {
                              indexArr.push(airportIndex);
                         }
                    }
               }
          }
          if(indexArr) {
               for(newIndex in indexArr) {
                    var setIndex = indexArr[newIndex];
                    $scope.DataModel.delivery.airports[setIndex] = $scope.DataModel.delivery.airports[setIndex] || {};
                    $scope.DataModel.delivery.airports[setIndex].checked = '1';
                    $scope.DataModel.delivery.airports[setIndex].fee = '0';
               }
          }
     }
      //check feature

//      var checkedFeature =  function (featureArr) {
//           var indexArr = [];
//           if (featureArr) {
//                console.log(featureArr)
//                for(var feature=0; feature <= featureArr.length; feature++ ){
//                      $scope.checkFeaturesArr.push(featureArr[feature]);
//                      console.log($scope.checkFeaturesArr);
//                }
//                // for (var feature in featureArr) {
//                //      $scope.checkFeaturesArr.push(feature);
//                //      for(var featureIndex in $scope.checkFeaturesArr) {
//                //           console.log(featureIndex);
//                //           // if (featureArr[feature]  == $scope.checkFeaturesArr[featureIndex] ) {
//                //           //      indexArr.push(featureIndex);
//                //           //      console.log(indexArr);
//                //           // }
//                //      }
//                // }
//           }
//           if(indexArr) {
//                for(newIndex in indexArr) {
//                     var setIndex = indexArr[newIndex];
//                     $scope.DataModel.details.features[setIndex] = $scope.DataModel.details.features[setIndex] || [];
//                     $scope.DataModel.details.features[setIndex].checked = '1';
//                }
//      }
// }
     /** Function to get car brands */
     var getAirports = function () {
          VehicleService.getAirports(function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
               } else if(response.resStatus == "success") {
                    $scope.airports = response.result;
                    //$scope.DataModel.delivery.airports[0].id = '1';
                    var airportsArr = $scope.DataModel.delivery.airports || [];
                    checkedAirports(airportsArr);
                    // var indexArr = [];
                    // if (airportsArr) {
                    //      for (var airport in airportsArr) {
                    //           var obj = {};
                    //           obj.id = airportsArr[airport].id._id;
                    //           obj.fee = airportsArr[airport].fee.toString();
                    //           $scope.airportsArr.push(obj);
                    //           for(var airportIndex in $scope.airports) {
                    //                if (airportsArr[airport].id._id  == $scope.airports[airportIndex]._id ) {
                    //                     indexArr.push(airportIndex);
                    //                }
                    //           }
                    //      }
                    // }
                    // if(indexArr) {
                    //      for(newIndex in indexArr) {
                    //           var setIndex = indexArr[newIndex];
                    //           $scope.DataModel.delivery.airports[setIndex] = $scope.DataModel.delivery.airports[setIndex] || {};
                    //           $scope.DataModel.delivery.airports[setIndex].checked = '1';
                    //      }
                    // }
               }
          });
     }

     /** Function to get car models */
     var getCarModels = function (brand) {
          if(brand) {
               VehicleService.getCarModels(brand, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    } else if(response.resStatus == "success") {
                         if(response.result.length && response.result[0].models.length) {
                              $scope.modelArr = response.result[0].models;
                         } else {
                              $scope.modelArr = [];
                         }
                    }
               });
          } else {
               $scope.modelArr = [];
          }
     }

     /** function to show preview of selected iimages */
     var checkFileSize = function(file, callback){
          var status;
          var img = new Image();
          img.src = window.URL.createObjectURL( file );
          img.onload = function() {
               var width = img.naturalWidth,
               height = img.naturalHeight;
               window.URL.revokeObjectURL( img.src );
               if( (width ==  640 || width >  640) && (height ==  320 || height >  320) ) {
                    callback(true, file);
               }
               else {
                    $scope.myFile = [];
                    alert("Please upload file image of size 640px by 320px or higher");
                    callback(false);
               }
          };
     }

     /** function to show preview of selected iimages */
     var previewImages = function(fileList){
          var anyWindow = window.URL || window.webkitURL;
          for(var i = 0; i < fileList.length; i++){
               if (fileList[i].type.match('image.*')) {
                    checkFileSize(fileList[i], function (status, file) {
                         if(status) {
                              var objectUrl = anyWindow.createObjectURL(file);
                              var clone = "<div class='col-sm-3 previewFiles'><div class='car-img'><img src="+objectUrl+" class='img-responsive' alt='preview'/></div></div>";
                              angular.element(clone).insertBefore(angular.element("#selectIMg"));
                              window.URL.revokeObjectURL(file);
                         }
                    });
               } else {
                    alert("Only Image files are supprted");
                    return false;
               }
          }
     }

     /** function for hude flash message after 5 second **/
     var hideFlash = function(){
          $timeout(function(){
               $scope.statusMsg = false;
          }, 5000);
     }

     /** Function to get attributes of address */
     var getLocationsObj = function () {
          $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
               var location = $scope.autocomplete.getPlace().geometry.location;
               var add = $scope.autocomplete.getPlace();
               $scope.lat = location.lat();
               $scope.lng = location.lng();
               $scope.vehicle.lat= $scope.lat;
               $scope.vehicle.lng= $scope.lng;
               add.address_components.forEach(function (item) {
                    for(i=0;i<item.types.length;i++) {
                         if(item.types[i] =='locality'){
                              $scope.city=item.long_name;
                              $scope.vehicle1.cityname= $scope.city;
                         }
                         if(item.types[i] =='country'){
                              $scope.country=item.long_name;
                              $scope.vehicle1.country= $scope.country;
                         }
                         if(item.types[i] =='administrative_area_level_1'){
                              $scope.state =item.long_name;
                              $scope.vehicle1.state= $scope.state;
                         }
                    }
               });
               $scope.$apply();
          });
     }

     /** function to call when vehicle photos uploaded */
     var uploadComplete = function (imgArr) {
          if (isParent) {
               $state.reload();
          } else {
               $state.go('user.listcarPublish', {refId : $scope.vehicleRefId ,message: {resStatus : "success", msg: "Photo have been updated successfully"}});
          }

     }

     var getvehicleData = function() {
          VehicleService.view ($scope.vehicleRefId, function (response) {

               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {

                    $scope.DataModel = response.result.view;
                    $scope.trips = response.result.trips;

                    if($scope.DataModel.specifications) {
                         if (!$scope.DataModel.name) {
                              $scope.DataModel.name = $SessionService.user().name.first + '\'s ' + $scope.DataModel.specifications.make;
                         }
                         $scope.DataModel.specifications.year = $scope.DataModel.specifications.year.toString();
                         //addres=$scope.DataModel;
                    }

                    if($state.current.name == 'user.liscarLanding.delivery') {
                         getAirports();
                    }

                    if(response.result.view.details){
                         $scope.checkFeaturesArr = (response.result.view.details.features.length) ? response.result.view.details.features : [];
                    }

                    if($scope.DataModel.distance) {
                         $scope.DataModel.distance.day = $scope.DataModel.distance.day.toString();
                         $scope.DataModel.distance.week = $scope.DataModel.distance.week.toString();
                         $scope.DataModel.distance.month = $scope.DataModel.distance.month.toString();
                    }

                    if($scope.DataModel.delivery) {
                         $scope.DataModel.delivery.guestLocation.fee = $scope.DataModel.delivery.guestLocation.fee.toString();
                         $scope.DataModel.delivery.guestLocation.distance = $scope.DataModel.delivery.guestLocation.distance.toString();
                    }

                    /** check if photo uploaded */
                    $scope.isPhotoUploaded = ($scope.DataModel.gallery && $scope.DataModel.gallery.photos.length) ?
                    $scope.DataModel.gallery.photos.length : 0;

                    if($scope.vehicleRefId && $state.current.name == 'user.listcarIntro') {
                         getCarBrands();
                    }
               }
          });
     }

     var tripDeatil = function(id){
          VehicleService.tripView(id, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.trip = response.result;
                    $scope.tripsTable = new NgTableParams({ count: 10 }, {data: $scope.trip});
               }
          });
     };


     var bookingDetail = function(id){
          VehicleService.bookingView(id, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.Details = response.result;
               }
          });
     };

     var getCountry = function () {
          $AccountService.getCountry(function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
               } else if(response.resStatus == "success") {
                    $scope.makeArr = response.result;
               }
          });
     }

     /** Function to get car models */
     var getStates = function (country) {
          if(country) {
               $AccountService.getStates(country, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    } else if(response.resStatus == "success") {
                         if(response.result.length && response.result[0].models.length) {
                              $scope.modelArr = response.result[0].models;
                         } else {
                              $scope.modelArr = [];
                         }
                    }
               });
          } else {
               $scope.modelArr = [];
          }
     }

     var removeByAttr = function(arr, attr, value){
          var i = arr.length;
          while(i--){
               if( arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value ) ){
                         arr.splice(i,1);
                    }
               }
               return arr;
     }

     /** Use to save vehicle Info */
     $scope.saveInfo = function (obj, activeLInk) {
          obj.userId = userId;
          obj.address = obj.address || {};
          if($scope.autocomplete && $scope.autocomplete.getPlace()) {
               obj.address.location = $scope.autocomplete.getPlace().formatted_address;
               var location = $scope.autocomplete.getPlace().geometry.location;
               var placeObj = $scope.autocomplete.getPlace();
               obj.address.lat = location.lat();
               obj.address.lon = location.lng();
               obj.address.geoLocation = {
                    type : 'Point',
                    coordinates : [obj.address.lon, obj.address.lat]
               };
               placeObj.address_components.forEach(function (item) {
                    for(i=0; i<item.types.length; i++) {
                         if(item.types[i] =='locality'){
                              obj.address.city = item.long_name ? item.long_name : "";
                         }
                         if(item.types[i] =='country'){
                              obj.address.country = item.long_name ? item.long_name : "";
                         }
                         if(item.types[i] =='administrative_area_level_1'){
                              obj.address.state = item.long_name ? item.long_name : "";
                         }
                    }
               });
          } else {
               $scope.isRequired = true;
          }
          VehicleService.add (obj, function (response) {
               $scope.statusMsg = true;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
                    hideFlash();
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
                    hideFlash();
                    if(response.result.mobileVerification == false) {
                         $state.go('user.mobileVerification', {refId : response.result.info._id ,message: serverMsg});
                    } else if (response.result.licenseVerification == false){
                         $state.go('user.driverlicense', {refId : response.result.info._id ,message: serverMsg});
                    }else {
                         $state.go('user.listcarAvailability', {refId : response.result.info._id ,message: serverMsg});
                    }
               }
          });
          $scope.autocomplete = " ";
     }

     /** Use to update vehicle Info */
     $scope.updateInfo = function (obj, activeLInk) {

           //obj.details.features = $scope.selection;
          //console.log(obj.details.features+'hello');

          if($scope.color) {
               obj.details.color = $scope.color;
          }
          if($scope.airportsArr){
               obj.delivery.airports = $scope.airportsArr;
          }
          // if($scope.checkFeaturesArr){
          //      obj.details.features =  $scope.checkFeaturesArr;
          // }

          if($scope.autocomplete && $scope.autocomplete.getPlace()) {
               obj.address.location = ($scope.autocomplete.getPlace()) ? $scope.autocomplete.getPlace().formatted_address : "";
               var location = ($scope.autocomplete.getPlace()) ? $scope.autocomplete.getPlace().geometry.location : "";
               var placeObj = ($scope.autocomplete.getPlace())?$scope.autocomplete.getPlace() : "";
               if(location) {
                    obj.address.lat = location.lat();
                    obj.address.lon = location.lng();
                    obj.address.geoLocation = {
                         type : 'Point',
                         coordinates : [obj.address.lon, obj.address.lat]
                    };
                    placeObj.address_components.forEach(function (item) {
                         for(i=0; i<item.types.length; i++) {
                              if(item.types[i] =='locality'){
                                   obj.address.city = item.long_name ? item.long_name : "";
                              }
                              if(item.types[i] =='country'){
                                   obj.address.country = item.long_name ? item.long_name : "";
                              }
                              if(item.types[i] =='administrative_area_level_1'){
                                   obj.address.state = item.long_name ? item.long_name : "";
                              }
                         }
                    });
               }
          } else {
               $scope.isRequired = true;
          }
          obj._id = $scope.vehicleRefId;
          obj.userId = userId;
          if ($scope.autocomplete && $scope.autocomplete.getPlace() && $scope.autocomplete.getPlace().formatted_address) {
               obj.address = obj.address || {};
               obj.address.location = $scope.autocomplete.getPlace().formatted_address;
          }
          VehicleService.update (obj, function (response) {
               $scope.statusMsg = true;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
                    hideFlash();
               } else if(response.resStatus == "success") {
                    //console.log(result);
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    var airportsArr = response.result.update.delivery.airports || [];
                    var featureArr = response.result.update.details.features || [];
                    $localStorage.featArr=featureArr;



                    checkedAirports(airportsArr);


                    if (isParent) {
                         $scope.serverMsg = serverMsg;
                         hideFlash();
                    } else {
                         if(response.result.mobileVerification == false) {
                              $state.go('user.mobileVerification', {refId : response.result.update._id ,message: serverMsg});
                         }else if (response.result.licenseVerification == false){
                              $state.go('user.driverlicense', {refId : response.result.update._id ,message: serverMsg});
                         }else if ($state.current.name == 'user.listcarIntro') {
                              $state.go('user.listcarAvailability', {refId : response.result.update._id ,message: serverMsg});
                         }else if ($state.current.name == 'user.listcarAvailability') {
                              $state.go('user.listcarDetails', {refId : response.result.update._id ,message: serverMsg});
                         } else if ($state.current.name == 'user.listcarDetails') {
                              $state.go('user.listcarPhotos', {refId : response.result.update._id ,message: serverMsg});
                         } else if ($state.current.name == 'user.listcarPhotos') {
                              $state.go('user.listcarPublish', {refId : response.result.update._id ,message: serverMsg});
                         }
                    }
               }
          });
     }

     /** Use to Send Verification Code */
     $scope.sendVerificationCode  = function(User) {
          User.userId = $SessionService.user()._id;
          $AccountService.sendVerificationCode(User, function (response) {
               var serverMsg;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
                    hideFlash();
               }else if(response.resStatus == "success") {
                    $state.go('user.mobileOTP', {refId : $scope.vehicleRefId ,message: serverMsg});
                    hideFlash();
               }
          });
     }

     /** Authenticate the account by matching the OTP*/
     $scope.confirmOtp = function(User) {
          User.userId = $SessionService.user()._id;
          $AccountService.confirmOtp(User, function(response) {
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    if(response.licenseVerification == false) {
                         $state.go('user.driverlicense', {refId : $scope.vehicleRefId ,message: serverMsg});
                    } else {
                         $state.go('user.listcarAvailability', {refId : response.result._id ,message: serverMsg});
                    }
               }
          })
     }

     /** Resend the OTP if user doesn't receive the OTP*/
     $scope.reSendOtp = function() {
          $scope.DataModel = $scope.DataModel || {};
          $scope.DataModel._id = $localStorage.verifyId;
          $AccountService.reSendOtp($scope.DataModel, function(response) {
               var serverMsg = {resStatus : response.resStatus, msg: response.msg};
               if(response.resStatus == "error") {
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.serverMsg = serverMsg;
               }
          })
     }

     /** Use to upload License */
     $scope.uploadLicense = function (obj) {
          var userId = $SessionService.user()._id;
          if ($scope.myFile) {
               obj.file = $scope.myFile[0];
          }
          $AccountService.uploadLicense(userId, obj, function (response) {
               var serverMsg;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               }else if(response.resStatus == "success") {
                    $state.go('user.listcarAvailability', {refId : $scope.vehicleRefId ,message: serverMsg});
               }
          });
     }

     /** Use to upload vehicle photos */
     $scope.addPhotos =function(activeLInk){
          var totalFiles = angular.element("div.col-sm-12 > div").length;
          var fileArr = $scope.myFile;
          if(fileArr && fileArr.length) {
               if(totalFiles > 20) {
                    return false;
               }
               var length = fileArr.length;
               var uploadImgUrl = '/vehicles/upload';
               var imgArr = [];
               var finalCounter = 0;
               var obj = {};
               var formData = new FormData();
               var length = fileArr.length;
               for(var i = 0; i < length; i++) {
                    var obj = {};
                    var formData = new FormData();
                    formData.append('file',fileArr[i]);
                    formData.append('vehicleId',$scope.vehicleRefId);
                    formData.append('userId',userId);
                    $http.post(uploadImgUrl,formData, {
                         transformRequest: angular.identity,
                         headers: {'Content-Type': undefined}
                    }).then(function (response) {
                         if (response.data.resStatus == "success") {
                              imgArr.push(response.data.result);
                              finalCounter++;
                              if(finalCounter == length) {
                                   return uploadComplete(imgArr);
                              }
                         }
                    });
               }
          } else if ($scope.isPhotoUploaded){
               if (!isParent) {
                    $state.go('user.listcarPublish', {refId : $scope.vehicleRefId ,message: {resStatus : "success", msg: "Info has successfully added"}});
               }
          }
     }

     /** Use to remove vehicle photo */
     $scope.removePhoto = function (vehicleId, img) {
          var modalInstance = $uibModal.open({
               //animation: $ctrl.animationsEnabled,
               ariaLabelledBy: 'modal-title',
               ariaDescribedBy: 'modal-body',
               templateUrl: 'myModalContent.html',
               controller: 'ModalInstanceController',
               controllerAs: '$ctrl',
               size: 'sm',
               resolve: {
                    items: function () {
                         return 1;
                    }
               }
          });
          modalInstance.result.then(function (selectedItem) {
               VehicleService.removePhoto (vehicleId, img, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $state.reload();
                    }
               });
          }, function () {
               //$log.info('Modal dismissed at: ' + new Date());
          });
     }

     /** Use to publish Car */
     $scope.publish = function () {
          $scope.DataModel.isPublish = true;
          $scope.DataModel.status = true;
          VehicleService.update ($scope.DataModel, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $state.go('user.liscarLanding.delivery', {refId : $scope.vehicleRefId ,message: serverMsg});
               }
          });
     }

     /** Use to Set protection */
     $scope.setProtection = function (plan, price) {
          $scope.DataModel.vehicleProtection.type = plan;
          $scope.DataModel.vehicleProtection.price = price;
          $scope.updateInfo($scope.DataModel);
     }

     /** Use to Set Color */
     $scope.setColor = function (color) {
          $scope.color = color;
          $scope.DataModel.details.color = color;
     }

     /** Use to Set Listing Status */

     $scope.setListingStatus = function (listingStatus,vehicleId) {
          $scope.DataModel = $scope.DataModel || {};
          if($scope.DataModel.listingStatus == 'SNOOZED'){
               var modalInstance = $uibModal.open({
                    //animation: $ctrl.animationsEnabled,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'snoozed.html',
                    controller: 'ModelListStatusController',
                    controllerAs: '$ctrl',
                    resolve: {
                         items: function () {
                              return {listingStatus:listingStatus,vehicleId:vehicleId,snozzedDate:$scope.DataModel.snozzedDate ? $scope.DataModel.snozzedDate : ''}
                         }
                    }
               });
               modalInstance.result.then(function (selectedItem) {
               }, function () {

               }); return;
          }else if($scope.DataModel.listingStatus == 'UNLISTED'){
               var modalInstance = $uibModal.open({
                    //animation: $ctrl.animationsEnabled,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'unlisted.html',
                    controller: 'ModelListStatusController',
                    controllerAs: '$ctrl',
                    resolve: {
                         items: function () {
                              return {listingStatus:listingStatus,vehicleId:vehicleId,snozzedDate:$scope.DataModel.snozzedDate ? $scope.DataModel.snozzedDate : ''}
                         }
                    }
               });
               modalInstance.result.then(function (selectedItem) {
               }, function () {

               }); return;
          }else{
               $scope.DataModel.listingStatus = listingStatus;
               $scope.updateInfo($scope.DataModel);
          }
     }


     /** function push the featurs **/
     // $scope.setFeatures = function(index,isChecked,value) {
     //      if(isChecked == 1) {
     //           $scope.checkFeaturesArr.push(value);
     //      }else {
     //           let indexOfArr = $scope.checkFeaturesArr.indexOf(value);
     //           $scope.checkFeaturesArr.splice(indexOfArr,1);
     //      }
     // }

     /** function for set the airport for delevary **/
     $scope.setAirports = function(index, isChecked, value, fee) {
          if(fee == undefined) {
               fee = 0;
          }
          if(isChecked == 1) {
               var obj = {};
               obj.id = value;
               obj.fee = fee;
               $scope.airportsArr.splice(index, 0, obj);
          } else {
               removeByAttr($scope.airportsArr, 'id', value );
          }
     }

     $scope.setFee = function(index, isChecked, value, fee) {
          $scope.airportsArr = $scope.airportsArr || [];
          if(fee) {
               $scope.airportsArr[index].fee = fee;
          }
     }


     /** Use to remove car listing */
     $scope.delete = function (vehicleId) {
          var modalInstance = $uibModal.open({
               //animation: $ctrl.animationsEnabled,
               ariaLabelledBy: 'modal-title',
               ariaDescribedBy: 'modal-body',
               templateUrl: 'deleteListing.html',
               controller: 'ModalInstanceController',
               controllerAs: '$ctrl',
               resolve: {
                    items: function () {
                         return 1;
                    }
               },
               size: 'sm'
          });
          modalInstance.result.then(function (selectedItem) {
               VehicleService.delete (vehicleId, userId, function (response) {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    if(response.resStatus == "error") {
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $state.go('user.dashboard', {message: serverMsg});
                    }
               });
          }, function () {
               //$log.info('Modal dismissed at: ' + new Date());
          });
     }

     /** Use to retrive car models */
     $scope.getCarModels  = function (brand) {
          getCarModels(brand);
     }

     /** Use to retrive car brands & models */
     if($state.current.name == 'user.listcarIntro' && !$scope.vehicleRefId) {
          getCarBrands();
          $scope.getCarModels  = function (brand) {
               getCarModels(brand);
          }
     }
     /** Use to retrive car models */
     $scope.getStates  = function (country) {
          getStates(country);
     }

     /* get countries*/
     if($state.current.name == 'user.driverlicense') {
          getCountry();
          $scope.getStates  = function (country) {
               getStates(country);
          }
     }

     /** Use to trigger browse button */
     angular.element("#uploadTrigger").click(function(){
          angular.element("#uploadFile").click();
     });

     /** Use to show preview of selected iimages */
     angular.element("#uploadFile").change(function () {
          var uploadedFiles = $scope.isPhotoUploaded;
          var newSelect = this.files.length;
          var totalFiles = uploadedFiles + newSelect;
          previewImages(this.files);
     });

     /** get vehicle Info */
     if($scope.vehicleRefId) {
          getvehicleData();
          if($state.current.name == 'user.liscarLanding.trip_history') {
               tripDeatil($scope.vehicleRefId);
          }
     }

     if(BookingId ) {
          bookingDetail(BookingId);
     }

     /** Displaying flash message  */
     if($stateParams.message != null) {
          $scope.statusMsg = true;
          $scope.serverMsg = $stateParams.message;
          hideFlash();
     }




}
