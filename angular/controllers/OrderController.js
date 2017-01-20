/**--------------------------------------------------------------------------
Name                   : DashboardController
Description            : use to authenticate the navigation item & logout functionality
--------------------------------------------------------------------------*/

module.exports = function($timeout,$scope, $state, $stateParams, $SessionService, VehicleService,$uibModal,NgTableParams,$templateCache, $filter) {
     if($SessionService.user()._id) {
          VehicleService.getTransactions($SessionService.user()._id, function(response){
               if(response.resStatus == "error") {
                    serverMsg = {resStatus : response.resStatus, msg: response.msg};
                    $scope.serverMsg = serverMsg;
               } else if(response.resStatus == "success") {
                    $scope.orders = response.result;
                    console.log($scope.orders);
                    $scope.ordersTable = new NgTableParams({}, {dataset: $scope.orders});
                    //console.log($scope.ordersTable);
               }
          });
     }

     //for checkAvailability popup
     $scope.review = function(userId,vehicleId){
          var modalInstance = $uibModal.open({
               //animation: $ctrl.animationsEnabled,
               ariaLabelledBy: 'modal-title',
               ariaDescribedBy: 'modal-body',
               templateUrl: 'review.html',
               controller: 'ModalPaymentController',
               controllerAs: '$ctrl',
               resolve: {
                    items: function () {
                         return {userId:userId,vehicleId:vehicleId};
                    }
               }
          });
          modalInstance.result.then(function (msg) {
               $scope.statusMsg = true;
               $scope.serverMsg = {resStatus : "success", "msg" : "Review has been added"};
               hideFlash();
          }, function () {
               //$log.info('Modal dismissed at: ' + new Date());
          }); return;
     }

     /** function for hude flash message after 5 second **/
     var hideFlash = function(){
          $timeout(function(){
               $scope.statusMsg = false;
               console.log("changed");
          }, 5000);
     }


     $scope.massage = function(userId,toUserId,name){
          //console.log(toUserId._id);
          var modalInstance = $uibModal.open({
               //animation: $ctrl.animationsEnabled,
               ariaLabelledBy: 'modal-title',
               ariaDescribedBy: 'modal-body',
               templateUrl: 'msg.html',
               controller: 'ModalSendMessage',
               controllerAs: '$ctrl',
               resolve: {
                    items: function () {
                         return {userId:userId,toUserId:toUserId,name:name};
                    }
               }
          });
          modalInstance.result.then(function (msg) {
               $scope.statusMsg = true;
               $scope.serverMsg = {resStatus : "success", "msg" : "Massage has been send"};
               hideFlash();

          }, function () {
               //$log.info('Modal dismissed at: ' + new Date());
          }); return;
     }

     var dynamicTemp = function (order) {
          var date = order.transactionId.timeStamp;
          var orderDate = $filter('date')(new Date(), 'M/d/yy h:mm');
          console.log(order);
          var data = [
               order.vehicleId.specifications.make + " " + order.vehicleId.specifications.model + " " + order.vehicleId.specifications.year, order.transactionId.amount.toString(), order.transactionId.amount.toString()

          ]
          var dd = {
               content: [
                    //    {
                    //   text: 'Invoice',
                    //   alignment: 'left',
                    //   style: 'h5'
                    // },
                    {
                         text: 'Order # '+ order.transactionId.invoice,
                         alignment: 'center',
                         style: 'h5'
                    },
                    '\n\n',
                    {
                         alignment: 'justify',
                         columns: [
                              {
                                   text: 'Billed To:\nMobilyte INDIA.Tech.Pvt.Ltd  \nE-40 \n Phase-8 \n Mohali, Punjab 160035'
                              },
                              {
                                   text: 'Shipped To:\n ' + order.userId.fullname + '\n 1234 Main \n Apt. 4B \n Springfield, ST 54321'
                              }
                         ]
                    },
                    '\n\n',
                    {
                         alignment: 'justify',
                         columns: [
                              {
                                   text: 'Payment Method: \n ' + order.transactionId.paymentType + '\n' + order.userId.email
                              },
                              {

                                   text: 'Order Date: \n' +  orderDate
                              }
                         ]
                    },
                    '\n\n',
                    {
                         style: 'demoTable',
                         table: {
                              widths: ['*', '*', '*'],
                              body: [
                                   [{text: 'Item', style: 'tableheader'}, {text: 'Price($)', style: 'tableheader'},
                                   {text: 'Total($)', style: 'tableheader'}
                              ],
                              data
                         ]
                    }
               }
          ],
          styles: {
               tableheader: {
                    fontSize: 18,
                    bold: true,
               },
               h5: {
                    fontSize: 30,
                    bold: true,
               },
               bigger: {
                    fontSize: 20,
                    italics: true,
               }
          },
          defaultStyle: {
               columnGap: 20,
          }
     };
     pdfMake.createPdf(dd).download();
}

$scope.downloadPdf = function(order) {
     dynamicTemp(order);
};

}
