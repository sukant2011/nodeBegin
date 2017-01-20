/*
|--------------------------------------------------------------------------
| Name                   : vehicleService
| Built in Dependencies  : $http
| Custom Dependencies    :  $localStorage, LocalService, AccessLevels
| Description            : use to view and edit profile
| Author                 : Mangal Singh
| Created                : 1 sep 2016
| ModifyBy               : vishesh 30 sept 2016
|--------------------------------------------------------------------------
*/
angular.module('corsaAdminApp').factory('VechileService', function($q,$http, $LocalService, AccessLevels, $localStorage,$SessionService) {
     return {
          userCarList:function(userId,cb){
               var car=$http.get('/vehicles/admin/userCarlist?userId='+userId);
               car.success(function(response) {
                    cb(response);
               });
          },
          viewCar:function(vehicleId,cb){
               var viewUsCar=$http.get('/vehicles/admin/info?vehicleId='+vehicleId);
               viewUsCar.success(function(response) {
                    cb(response);
               });
          },
          status:function(vehicleId,status,cb){
               var statusCar=$http.get('/vehicles/admin/status?vehicleId='+vehicleId +'&status=' +status);
               statusCar.success(function(response) {
                    cb(response);
               });
          },

          addAirport : function (Obj, cb) {
               console.log(Obj);
               var obj = $http.post('/vehicles/admin/addAirport', Obj);
               obj.then(function(response) {
                    cb(response.data);
               });
          },

          listAirport : function(cb) {
               var userInfo = $http.get('/vehicles/admin/listAirport');
               userInfo.success(function(response) {
                    cb(response);
               });
          },

          viewAirport : function(Id, cb) {
               var userInfo = $http.get('/vehicles/admin/viewAirport?reqId='+Id);
               userInfo.success(function(response) {
                    cb(response);
               });
          },

          removeAirport: function(countryId,cb){
               var userInfo =$http.post('vehicles/admin/removeAirport?reqId='+countryId);
               userInfo.success(function(response) {
                    cb(response);
               });

          },

          updateAirport: function(dataObj,cb){
               var userInfo =$http.post('/vehicles/admin/updateAirport', dataObj);
               userInfo.success(function(response) {
                    cb(response);
               });

          }
     }
});
