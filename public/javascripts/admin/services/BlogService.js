/*
|--------------------------------------------------------------------------
| Name                   : BlogService
| Built in Dependencies  : $http
| Description            : use to view and edit blogs
| Author                 : vishesh Tanwar
| Created                :  27 sept 2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
angular.module('corsaAdminApp').factory('BlogService', function($q,$http, $LocalService, AccessLevels, $localStorage,$SessionService) {
     return {
          add : function (userObj, cb) {
               // var obj = $http.post('/blog/admin/add', userObj);
               // obj.then(function(response) {
               //      cb(response.data);
               // });
               //console.log(userObj); return;
               var uploadImgUrl = "/blog/admin/add";
               var deferred = $q.defer();
               var formData = new FormData();
               formData.append('userId',userObj.userId);
               formData.append('file',userObj.file);
               formData.append('title',userObj.title);
               formData.append('description',userObj.description);
               if (userObj.image && userObj.image.photo) {
                    formData.append('photoOriginal',userObj.image.photoOriginal);
                    formData.append('photo',userObj.image.photo);
                    formData.append('path',userObj.image.path);
               }
               $http.post(uploadImgUrl,formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
               }) .success(function(response){
                    cb(response);
                    deferred.resolve(response);
               })
               .error(function(error){
                    cb(response);
                    deferred.reject(error);
               });
               return deferred.promise;
          },

          list : function(cb) {
               var obj = $http.get('/blog/admin/list');
               obj.success(function(response) {
                    cb(response);
               });
          },

          view : function(blogId, cb) {
               var obj = $http.get('/blog/admin/view?blogId='+blogId);
               obj.success(function(response) {
                    cb(response);
               });
          },

          remove: function(blogId,cb){
               var obj =$http.post('/blog/admin/remove?blogId='+blogId);
               obj.success(function(response) {
                    cb(response);
               });

          },

          update: function(dataObj,cb){

               // var obj =$http.post('/blog/admin/update', dataObj);
               // obj.success(function(response) {
               //      cb(response);
               // });
               var uploadImgUrl = "/blog/admin/update";
               var deferred = $q.defer();
               var formData = new FormData();
               formData.append('blogId',dataObj._id);
               formData.append('file',dataObj.file);
               formData.append('title',dataObj.title);
               formData.append('description',dataObj.description);
               formData.append('userId',dataObj.userId);
               if (dataObj.image && dataObj.image.photo) {
                    formData.append('photoOriginal',dataObj.image.photoOriginal);
                    formData.append('photo',dataObj.image.photo);
                    formData.append('path',dataObj.image.path);
               }
               $http.post(uploadImgUrl,formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
               }) .success(function(response){
                    cb(response);
                    deferred.resolve(response);
               })
               .error(function(error){
                    cb(response);
                    deferred.reject(error);
               });
               return deferred.promise;

          }
     }
});
