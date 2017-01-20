/**--------------------------------------------------------------------------
Name                   : AccountController
Description            : use to view  the user item & accoununt functionality
--------------------------------------------------------------------------*/

angular.module('corsaAdminApp').controller('BlogController',['$LocalService','$scope', '$rootScope', '$state', '$AuthService', '$SessionService','$AccountService','$stateParams','EmailService','VechileService','NgTableParams','BlogService',function($LocalService, $scope, $rootScope, $state, $AuthService, $SessionService, $AccountService,$stateParams,EmailService,VechileService,NgTableParams,BlogService) {

     //var serverMsg;


     var blogId = (  $stateParams.blogId ) ? $stateParams.blogId : "";


     var serviceApi = {




          listBlogs : function () {
               BlogService.list(function (response) {
                    var serverMsg;
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.allBlog = response.result;
                         
                    }
               });
          },

          ViewBlog : function (blogId) {
               BlogService.view(blogId, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.htmlcontent = response.result.description;
                         $scope.DataModel = response.result;
                    }
               });
          }


     }



     //======================================================send mail =================
     $scope.SendBlog = function(obj) {
          obj.description = $scope.htmlcontent;
          obj.userId = $SessionService.user()._id;
          //obj.userId =userId;
           // console.log(userId);
          if ($scope.myFile) {
               obj.file = $scope.myFile[0];
          }
          //console.log(obj);
          BlogService.add (obj, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    //console.log(response);
                    $state.go('dashboard.blog', {message: serverMsg});
               }
          });
     };

     //================================delete email=========================================
     $scope.removeBlogData = function(blogId){
          BlogService.remove(blogId,function(response){
               if(response.resStatus == "error"){
                    serverMsg={resStatus:response.resStatus,msg: response.msg};
                    $scope.serverMsg = serverMsg;
               }else if(response.resStatus ="success"){
                    $scope.DataModel = response.result;
                    $state.reload();
               }
          });
     }

     //==========================update email ========================
     $scope.updateBlog = function(obj){
          obj.description= $scope.htmlcontent;
          if ($scope.myFile) {
               obj.file = $scope.myFile[0];
          }
          BlogService.update (obj, function (response) {
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $state.go('dashboard.blog', {message: serverMsg});
               }
          });
     }
//=========================view blog  =====================================
     if(blogId) {
          serviceApi.ViewBlog(blogId);
     }


//=========================view blog  list=====================================
     if($state.current.name == 'dashboard.blog') {
               serviceApi.listBlogs();
          }

     //==========================status blobk ========================



}]);
