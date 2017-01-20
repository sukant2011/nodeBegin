/**--------------------------------------------------------------------------
Name                   : SearchController
Description            :
--------------------------------------------------------------------------*/

module.exports = function( $scope,$stateParams,VehicleService,$state, $timeout, $location) {

     var serverMsg;
     $scope.myCars = $scope.myCars || [];

     function customRange(input) {
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


     angular.element('#datetimepicker4').datepicker({
          beforeShow: customRangeStart,
          minDate: new Date(),
     });

     angular.element('#datetimepicker5').datepicker({
          beforeShow: customRange,
     });

     $scope.openFromDatepicker = function () {
          angular.element("#datetimepicker5").focus();
     }

     $scope.openToDatepicker = function () {
          angular.element("#datetimepicker4").focus();
     }


     /*** search api **/
     var serviceApi = {

          initQueryParameters : function (){
               $scope.SearchParams = {
                    'transmission' : '',
                    'feature' : '',
                    'minPrice' : '',
                    'maxPrice' : '',
                    'maxDistance' : '',
                    'minDistance' : '',
                    'sort' : '',
                    'vehicleType' : '',
                    'make' : '',
                    'model' : '',
                    'year' : '',
                    'color' : '',
                    'fromDate' : '',
                    'toDate' : '',
                    'fromTime' : '',
                    'toTime' : '',
                    'lat' : '',
                    'lon' : '',
                    'city' : '',
                    'state' : '',
                    'country' : '',
                    'location' : '',
               };
          },

          initRangeSliders : function () {
               /** Range slider config */
               $scope.priceRangeSlider = {
                    minValue: 0,
                    maxValue: 1500,
                    options: {
                         floor: 0,
                         ceil: 1500,
                         step: 5
                    }
               };
               $scope.distanceRangeSlider = {
                    minValue: 0,
                    maxValue: 1500,
                    options: {
                         floor: 0,
                         ceil: 1500,
                         step: 5
                    }
               };
               $scope.slider_callbacks = {
                    value: 100,
                    options: {
                         onStart: function () {
                              // function to execute after slider reach near the end
                         },
                         onChange: function () {
                              // function to execute on change of slider
                              $scope.SearchParams.minPrice = $scope.priceRangeSlider.minValue;
                              $scope.SearchParams.maxPrice = $scope.priceRangeSlider.maxValue;
                              $scope.SearchParams.minDistance = $scope.distanceRangeSlider.minValue;
                              $scope.SearchParams.maxDistance = $scope.distanceRangeSlider.maxValue;
                         },
                         onEnd: function () {
                              // function to execute after slider interaction ends
                              $scope.searchList();
                         }
                    }
               };
          },

          serialize : function(obj) {
               var str = [];
               for(var p in obj)
               if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
               }
               return str.join("&");
          },

          updateQuery : function() {
               for (var key in $scope.SearchParams) {
                    if ($scope.SearchParams[key] != '') {
                         $location.search(key, $scope.SearchParams[key]);
                    } else {
                         // remove empty filters
                         $location.search(key, null);
                    }
               }
          },

          getQuery : function (queryStr) {
               var qs = $location.search();
               for (var key in $scope.SearchParams) {
                    if (key in qs) {
                         $scope.SearchParams[key] = qs[key];
                    }
               }
          },

          renderMap : function(cities) {
               //if($state.current.name == 'anon.search.map') {
               var mapOptions = {
                    componentRestrictions: {country: "us"},
                    zoom: 4,
                    center: new google.maps.LatLng(41.850033, -87.6500523),
                    mapTypeId: google.maps.MapTypeId.TERRAIN
               }

               $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

               $scope.markers = [];

               var infoWindow = new google.maps.InfoWindow();

               var createMarker = function (info){
                    //console.log(info);
                    var marker = new google.maps.Marker({
                         map: $scope.map,
                         position: new google.maps.LatLng(info.address.lat, info.address.lon),
                         title: info.specifications.make+ " - " + info.specifications.model  + " "+info.specifications.year,
                         vehicleId : info._id,
                         VehiclePhots:info.gallery.photos[0],
                         VehiclePath:info.gallery.path,
                         ridingCost:info.ridingCost
                    });
                    google.maps.event.addListener(infoWindow, 'domready', function() {


                         var iwOuter = $('.gm-style-iw');
                         var iwBackground = iwOuter.prev();
                         var closeDiv = iwOuter.next();
                         closeDiv.addClass('infoWindowClose');
                         iwBackground.children(':nth-child(2)').css({'display' : 'none'});
                         iwBackground.children(':nth-child(2)').addClass('infoWindowBlock');
                         iwBackground.children(':nth-child(3)').addClass('infoWindowBlockArrow');
                         iwBackground.children(':nth-child(4)').css({'display' : 'none'});
                    });


                    google.maps.event.addListener(marker, 'click', function(){
                         infoWindow.setContent("<div class = 'customMapPop'><a href='#/vehicle/detail?refId="+marker.vehicleId+"'>"+"<img  src='"+marker.VehiclePath+marker.VehiclePhots+"'class='img1'>"+"<br><h6>"+marker.title+'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<b>'+'$'+marker.ridingCost+"/Per-Day</b></h6>"+"</a></div>");
                         infoWindow.open($scope.map, marker);
                    });


                    //<a ui-sref="anon.vehicleDetail({refId :id})">
                    $scope.markers.push(marker);
               }

               for (i = 0; i < cities.length; i++){
                    createMarker(cities[i]);
               }

               $scope.openInfoWindow = function(e, selectedMarker){
                    e.preventDefault();
                    google.maps.event.trigger(selectedMarker, 'click');
               }


          },


          listCars : function(queryStr){
               $scope.lodingData = true;
               VehicleService.listCars(queryStr, function (response) {
                    if(response.resStatus == "error") {
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         if(response.result.length){
                              $scope.lodingData = false;
                              $scope.myCars = $scope.myCars.concat(response.result);
                              //$scope.$apply();
                              $scope.SearchParams.offset =  $scope.SearchParams.offset  + response.result.length;
                         }else{
                              $scope.lodingData = true;
                         }
                         if($state.current.name == 'anon.search.map') {
                              $timeout(function () {
                                   serviceApi.renderMap($scope.myCars);
                              }, 1000);
                         }
                    }
               });
          },

          getCarModelsYear : function (brand, model) {
               if(brand) {
                    VehicleService.getCarModelsYear(brand, model, function (response) {
                         if(response.resStatus == "error") {
                              serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         } else if(response.resStatus == "success") {
                              $scope.yearArr = response.result;
                         }
                    });
               }
          },

          getCarModels : function (brand) {
               if(brand) {
                    VehicleService.getCarModels(brand, function (response) {
                         if(response.resStatus == "error") {
                              serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         } else if(response.resStatus == "success") {
                              if(response.result.length && response.result[0].models.length) {
                                   $scope.modelArr = response.result[0].models;
                                   if($scope.SearchParams.model) {
                                        serviceApi.getCarModelsYear($scope.SearchParams.make, $scope.SearchParams.model);
                                   }
                              }
                         }
                    });
               }
          },

          /** Function to get car brands */
          getCarBrands : function () {
               VehicleService.getCarBrands(function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    } else if(response.resStatus == "success") {
                         $scope.makes = response.result;
                         if($scope.SearchParams.make) {
                              serviceApi.getCarModels($scope.SearchParams.make);
                         }
                    }
               });
          }

     };

     $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
          if($scope.autocomplete && $scope.autocomplete.getPlace()) {
               var location = $scope.autocomplete.getPlace().geometry.location;
               var add = $scope.autocomplete.getPlace();
               $scope.SearchParams.location = add.formatted_address;
               $scope.SearchParams.lat = location.lat();
               $scope.SearchParams.lon = location.lng();
               add.address_components.forEach(function (item) {

                    for(i=0;i<item.types.length;i++) {
                         if(item.types[i] =='locality'){
                              $scope.SearchParams.city = item.long_name;
                         }
                         if(item.types[i] =='country'){
                              $scope.SearchParams.country = item.long_name;
                         }
                         if(item.types[i] =='administrative_area_level_1'){
                              $scope.SearchParams.state = item.long_name;
                         }
                    }
               });
          }
          $scope.$apply();
     });
     // $scope.myFunc = function(vehicleRefId){
     //           VehicleService.view (vehicleRefId, function (response) {
     //                if(response.resStatus == "error") {
     //                     serverMsg = {resStatus : response.resStatus, msg: response.msg};
     //                     $scope.serverMsg = serverMsg;
     //                } else if(response.resStatus == "success") {
     //                     $scope.DataModel = response.result;
     //                     //console.log($scope.DataModel);
     //                     //createMarker(response.result.address);
     //                     //$state.go("user.dashboard", {message: serverMsg});
     //                }
     //           });
     //      };




     serviceApi.initRangeSliders();
     serviceApi.initQueryParameters();

     /** Checking Search Parameters **/
     $scope.searchList = function () {
          if($scope.SearchParams.make) {
               serviceApi.getCarModels($scope.SearchParams.make);
          }
          serviceApi.updateQuery();
          var queryStr = $scope.SearchParams?serviceApi.serialize($scope.SearchParams) : "";
          serviceApi.listCars(queryStr);
     };

     /** Checking Search Parameters **/
     $scope.searchVehicle = function() {
          serviceApi.updateQuery();
          var queryStr = $scope.SearchParams?serviceApi.serialize($scope.SearchParams) : "";
          serviceApi.listCars(queryStr);
     }

     $scope.clearFilters = function() {
          serviceApi.initRangeSliders();
          serviceApi.initQueryParameters();
          serviceApi.updateQuery();
          var queryStr = $scope.SearchParams?serviceApi.serialize($scope.SearchParams) : "";
          serviceApi.listCars(queryStr);
     }

     $scope.lodingScrollData = function(){
          var queryStr = $scope.SearchParams ? serviceApi.serialize( $scope.SearchParams ) : "";
          serviceApi.listCars(queryStr);
     }


     if($stateParams.message) {
          $scope.SearchParams = $stateParams.message;
          serviceApi.updateQuery();
     }

     serviceApi.getQuery();
     if($scope.SearchParams) {
          $scope.SearchParams.limit = 10;
          $scope.SearchParams.offset = 0;
     }

     var queryStr = $scope.SearchParams ? serviceApi.serialize( $scope.SearchParams ) : "";
     serviceApi.listCars(queryStr);
     serviceApi.getCarBrands();
}
