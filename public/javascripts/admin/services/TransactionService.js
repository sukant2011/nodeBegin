/*
|--------------------------------------------------------------------------
| Name                   : CarTransactionService
| Built in Dependencies  : $http
| Custom Dependencies    :  ,$http ,
| Description            : use to   view  Transactions
| Author                 : vishesh Tanwar
| Created                : 13 sept 2016
| ModifyBy               : ---
|--------------------------------------------------------------------------
*/
angular.module('corsaAdminApp').factory('TransactionsService', function($q,$http, $LocalService, AccessLevels, $localStorage,$SessionService) {
     return {


          list : function(cb) {
               var userInfo = $http.get('/payment/admin/getTransactions');
               userInfo.success(function(response) {
                    cb(response);
               });
          },

          view : function(Id, cb) {
               var userInfo = $http.get('/payment/admin/viewTransactions?transactionId='+Id);
               userInfo.success(function(response) {
                    cb(response);
               });
          },
          refund : function(Id, cb) {
               var userInfo = $http.get('/payment/admin/getRefund?transactionId='+Id);
               userInfo.success(function(response) {
                    cb(response);
               });
          },
          payToSeller :function(payment,cb){
               var pay = $http.post('/payment/admin/paySeller',{'amount':payment})
               pay.then(function(response){
                    cb(response.data);
               });
          }

     }
});
