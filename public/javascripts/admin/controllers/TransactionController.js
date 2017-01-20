/**--------------------------------------------------------------------------
Name                   : AddCarController
Description            : use to Count Number of user and vehicle  and  complaints
--------------------------------------------------------------------------*/


angular.module('corsaAdminApp').controller('TransactionController',['$LocalService','$scope', '$rootScope', '$state', '$AuthService', '$SessionService', '$location', '$localStorage','$AccountService','CountService','CarBrandService','$stateParams','TransactionsService','NgTableParams', function($LocalService, $scope, $rootScope, $state, $AuthService, $SessionService, $location, $localStorage,$AccountService,CountService,CarBrandService,$stateParams,TransactionsService,NgTableParams) {


     var transactionID = (  $stateParams.transactionId ) ? $stateParams.transactionId : "";

     //
     // $scope.removeCar = function(id){
     //      CarBrandService.remove(id,function(response){
     //           if(response.resStatus == "error"){
     //                serverMsg={resStatus:response.resStatus,msg: response.msg};
     //                $scope.serverMsg = serverMsg;
     //           }else if(response.resStatus ="success"){
     //                $scope.DataModel = response.result;
     //                $state.reload();
     //           }
     //      });
     // };

     var serviceTransrApi =  {

          viewtransaction : function (transactionID) {
               TransactionsService.view(transactionID, function (response) {
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.DataModel = response.result;

                    }
               });
          },

          listTransaction : function () {
               TransactionsService.list(function (response) {
                    var serverMsg;
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {

                         $scope.allpayment = response.result;
                         //console.log($scope.allpayment)
                         $scope.paymentTable = new NgTableParams({}, {dataset: $scope.allpayment});
                         // $scope.params.settings().$scope = $scope;
                         //console.log($scope.allpayment)
                    }
               });
          },
          refundTransaction : function (id) {
               //alert("hello");
               TransactionsService.refund(id,function (response) {
                    var serverMsg;
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.refundData = response.result;
                         console.log($scope.refundData)
                    }
               });
          },
          payNow : function (obj) {
               //alert("hello");
               TransactionsService.payToSeller(obj,function (response) {
                    var serverMsg;
                    if(response.resStatus == "error") {
                         serverMsg = {resStatus : response.resStatus, msg: response.msg};
                         $scope.serverMsg = serverMsg;
                    } else if(response.resStatus == "success") {
                         $scope.payData = response.result;
                         console.log($scope.payData)
                    }
               });
          }



     };

     if($state.current.name == 'dashboard.transaction') {
          serviceTransrApi.listTransaction();

     }


     if(transactionID) {
          serviceTransrApi.viewtransaction(transactionID);

     }
    $scope.refundAmount = function(id){
         serviceTransrApi.refundTransaction(id)
    }
    $scope.amountPaySeller = function(obj){
         //console.log(obj);return;
         serviceTransrApi.payNow(obj);
    }



}]);
