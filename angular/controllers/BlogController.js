/**--------------------------------------------------------------------------
Name                   : InfoController
Description            :get blogs
--------------------------------------------------------------------------*/

module.exports =  function($scope,$state,$stateParams,BlogService,$localStorage) {

     var blogId = (  $stateParams.blogId ) ? $stateParams.blogId : "";
     //$scope.allBlog= $localStorage.user3;
     //console.log($scope.allBlog);


     $scope.listBlogs =  function () {
     //console.log($scope.allBlog);
          BlogService.list(function (response) {
               var serverMsg;
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.allBlog = response.result;

                    $scope.currentPage = 1;
                    $scope.totalItems = $scope.allBlog.length;
                    $scope.entryLimit = 200; // items per page
                    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

               }
            });
     }
     var serviceApi = {

          ViewBlog : function (blogId) {
               BlogService.view(blogId, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         //$scope.htmlcontent = response.result.description;
                         $scope.DataModel = response.result;
                    }
               });
          }

};
     //=========================view blog  list=====================================
     if($state.current.name == 'anon.blog') {
          $scope.listBlogs();
     }

     if(blogId) {
          serviceApi.ViewBlog(blogId);
     }
}
