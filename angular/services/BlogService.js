/*
|--------------------------------------------------------------------------
| Name                   : BlogService
| Built in Dependencies  :  --
| Custom Dependencies    :  --
| Description            : use to get blogs
| Author                 : vishesh Tanwar
| Created                : 28 sept 2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
module.exports =  function($http) {
          return {
               list : function(cb) {
                    var obj = $http.get('/blog/list');
                    obj.success(function(response) {
                         cb(response);
                    });
               },

               view : function(blogId, cb) {
                    var obj = $http.get('/blog/view?blogId='+blogId);
                    obj.success(function(response) {
                         cb(response);
                    });
               }
          }
     }
