/**--------------------------------------------------------------------------
Name                   : InfoController
Description            :get data from autocomplete address fields
--------------------------------------------------------------------------*/

module.exports = function($scope) {

		  $scope.lat = undefined;
		  $scope.lng = undefined;
	       $scope.city = undefined;
            $scope.country = undefined;
		  $scope.vehicle = {};


		  $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
			  var location = $scope.autocomplete.getPlace().geometry.location;
			  var add = $scope.autocomplete.getPlace();

			  $scope.lat = location.lat();
			  $scope.lng = location.lng();
			  $scope.vehicle.lat= $scope.lat;
			  $scope.vehicle.lng= $scope.lng;
				add.address_components.forEach(function (item) {

                       for(i=0;i<item.types.length;i++)
                       {
                       	if(item.types[i] =='locality'){
					  $scope.city=item.long_name;
					  $scope.vehicle.cityname= $scope.city;
					}
						if(item.types[i] =='country'){
					  $scope.country=item.long_name;
					  $scope.vehicle.country= $scope.country;
					}
					if(item.types[i] =='administrative_area_level_1'){
						$scope.state =item.long_name;
					 $scope.vehicle.state= $scope.state;
					}


					}

				});
			  $scope.$apply();
			});

			$scope.saveInfo=function(vehicle){
				console.log(vehicle);
			}

//for car features

   //for driver details





		  }
