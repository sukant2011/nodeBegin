/*
|--------------------------------------------------------------------------
| Name                   : countryNameService
| Built in Dependencies  : $http
| Custom Dependencies    :
| Description            : use to add ,delete ,view  country
| Author                 : vishesh Tanwar
| Created                : 30 sept 2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
angular.module('corsaAdminApp').factory('CountryNameService', function($http, $LocalService, AccessLevels, $localStorage,$SessionService) {
     return {
          add : function (Obj, cb) {
               //console.log(Obj);
               var obj = $http.post('/vehicles/admin/addCountryName', Obj);
               obj.then(function(response) {
                    cb(response.data);
               });
          },

          list : function(cb) {
               var userInfo = $http.get('/vehicles/admin/listCountryName');
               userInfo.success(function(response) {
                    cb(response);
               });
          },

          view : function(Id, cb) {
               var userInfo = $http.get('/vehicles/admin/viewCountryName?reqId='+Id);
               userInfo.success(function(response) {
                    cb(response);
               });
          },

          remove: function(countryId,cb){
               var userInfo =$http.post('vehicles/admin/removeCountryName?reqId='+countryId);
               userInfo.success(function(response) {
                    cb(response);
               });

          },

          update: function(dataObj,cb){
               var userInfo =$http.post('/vehicles/admin/updateCountryName', dataObj);
               userInfo.success(function(response) {
                    cb(response);
               });

          },


     }
});
