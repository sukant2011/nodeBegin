/*
|--------------------------------------------------------------------------
| Name                   : countryService
| Built in Dependencies  : $http
| Custom Dependencies    :  $localStorage, LocalService, AccessLevels
| Description            : use to add ,delete ,view  states $ country Brands
| Author                 : vishesh Tanwar
| Created                : 20 sept 2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
angular.module('corsaAdminApp').factory('countryService', function($http, $LocalService, AccessLevels, $localStorage,$SessionService) {
     return {
          add : function (Obj, cb) {
               //console.log(Obj);
               var obj = $http.post('/vehicles/admin/addCountry', Obj);
               obj.then(function(response) {
                    cb(response.data);
               });
          },
          //
          list : function(cb) {
               var userInfo = $http.get('/vehicles/admin/listCountry');
               userInfo.success(function(response) {
                    cb(response);
               });
          },
          //
          view : function(Id, cb) {
               var userInfo = $http.get('/vehicles/admin/viewCountry?reqId='+Id);
               userInfo.success(function(response) {
                    cb(response);
               });
          },
          //
          remove: function(countryId,cb){
               var userInfo =$http.post('vehicles/admin/removeCountry?reqId='+countryId);
               userInfo.success(function(response) {
                    cb(response);
               });

          },

          update: function(dataObj,cb){
               var userInfo =$http.post('/vehicles/admin/updateCountry', dataObj);
               userInfo.success(function(response) {
                    cb(response);
               });

          },
          //
          // brand: function(cb){
          //      var userInfo =$http.get('/vehicles/admin/listBrand');
          //      userInfo.success(function(response) {
          //           cb(response);
          //      });
          //
          // }
     }
});
