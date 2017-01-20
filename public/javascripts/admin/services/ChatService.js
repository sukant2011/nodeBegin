angular.module('corsaAdminApp').factory('ChatService', ['$http', function ($http) {
     return {
          listMessage : function (userId, fromId, callback) {
               $http.get('/chat/list/'+userId+"/"+fromId).then(function (data) {
                    callback(data);
               });
          },

          getUserList : function (callback) {
               $http.get('/chat/list').then(
                    function (err) {
                         callback(err);
                    },
                    function (data) {
                         callback(data);
                    }
               )
          },
     }
}]);
