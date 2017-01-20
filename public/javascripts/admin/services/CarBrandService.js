/*
|--------------------------------------------------------------------------
| Name                   : CarBrandService
| Built in Dependencies  : $http
| Custom Dependencies    :  $localStorage, LocalService, AccessLevels
| Description            : use to add ,delete ,view  Car Brands
| Author                 : vishesh Tanwar
| Created                : 1 sept 2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
angular.module('corsaAdminApp').factory('CarBrandService', function($q,$http, $LocalService, AccessLevels, $localStorage,$SessionService) {
     return {
          add : function (Obj, cb) {
               //console.log(Obj);
               var obj = $http.post('/vehicles/admin/addVariant', Obj);
               obj.then(function(response) {
                    cb(response.data);
               });
          },

          list : function(cb) {
               var userInfo = $http.get('/vehicles/admin/listVariant');
               userInfo.success(function(response) {
                    cb(response);
               });
          },

          view : function(Id, cb) {
               var userInfo = $http.get('/vehicles/admin/viewVariant?reqId='+Id);
               userInfo.success(function(response) {
                    cb(response);
               });
          },

          remove: function(brandId,cb){
               var userInfo =$http.post('vehicles/admin/removeVariant?reqId='+brandId);
               userInfo.success(function(response) {
                    cb(response);
               });

          },

          update: function(dataObj,cb){
               var userInfo =$http.post('/vehicles/admin/updateVariant', dataObj);
               userInfo.success(function(response) {
                    cb(response);
               });

          },

          brand: function(cb){
               var userInfo =$http.get('/vehicles/admin/listBrand');
               userInfo.success(function(response) {
                    cb(response);
               });

          }
     }
});
