/*
|--------------------------------------------------------------------------
| Name                   : CarBrandService
| Built in Dependencies  : $http
| Custom Dependencies    :  $localStorage, LocalService, AccessLevels
| Description            : use to add ,delete  Brands
| Author                 : vishesh Tanwar
| Created                : 7 sept 2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
angular.module('corsaAdminApp').factory('addBrandService', function($q,$http, $LocalService, AccessLevels, $localStorage,$SessionService) {
     return {
          add : function (Obj, cb) {
               console.log(Obj);
               var obj = $http.post('/vehicles/admin/addBrand', Obj);
               obj.then(function(response) {
                    cb(response.data);
               });
          },

          list : function(cb) {
               var userInfo = $http.get('/vehicles/admin/listBrand');
               userInfo.success(function(response) {
                    cb(response);
               });
          },

          view : function(Id, cb) {
               var userInfo = $http.get('/vehicles/admin/viewBrand?reqId='+Id);
               userInfo.success(function(response) {
                    cb(response);
               });
          },

          remove: function(brandId,cb){
               var userInfo =$http.post('vehicles/admin/removeBrand?reqId='+brandId);
               userInfo.success(function(response) {
                    cb(response);
               });

          },

          update: function(dataObj,cb){
               var userInfo =$http.post('/vehicles/admin/updateBrand', dataObj);
               userInfo.success(function(response) {
                    cb(response);
               });

          },
          status:function(brandId,status,cb){
               console.log(brandId);
               var statusCar=$http.get('/vehicles/admin/brandStatus?brandId='+brandId +'&status=' +status);
               statusCar.success(function(response) {
                    cb(response);
               });
          }
     }
});
