/**
Name                   : VehicleService
Built in Dependencies  : $http
Custom Dependencies    :
Description            : use to add & update vehicle Data
Author                 : Sunny Chauhan
Created                : 20 Aug 2016
ModifyBy               : ---
*/
module.exports =  function($http, $q) {
     return {

          getAirports : function (cb) {
               var obj = $http.get('/vehicles/airports');
               obj.then(function(response) {
                    cb(response.data);
               });
          },
          getCarBrands : function (cb) {
               var obj = $http.get('/vehicles/brands');
               obj.then(function(response) {
                    cb(response.data);
               });
          },
          getCarModels : function (brand, cb) {
               var obj = $http.get('/vehicles/models?brand='+brand);
               obj.then(function(response) {
                    cb(response.data);
               });
          },
          getCarModelsYear : function (brand, model, cb) {
               var obj = $http.get('/vehicles/modelYears?brand='+brand+"&model="+model);
               obj.then(function(response) {
                    cb(response.data);
               });
          },
          add : function (dataObj, cb) {
               var obj = $http.post('/vehicles/add', dataObj);
               obj.then(function(response) {
                    cb(response.data);
               });
          },

          update : function (dataObj, cb) {
               var obj = $http.post('/vehicles/update', dataObj);
               obj.then(function(response) {
                    cb(response.data);
               });
          },

          view : function (refId, cb) {
               var obj = $http.get('/vehicles/view?refId='+ refId);
               obj.then(function(response) {
                    cb(response.data);
               });
          },

          delete : function (vehicleId, userId, cb) {
               var obj = $http.get('/vehicles/delete?refId='+ vehicleId + '&uId='+userId);
               obj.then(function(response) {
                    cb(response.data);
               });
          },

          removePhoto : function (vehicleId, img, cb) {
               var obj = $http.get('/vehicles/removePhoto?refId='+ vehicleId + "&img="+img);
               obj.then(function(response) {
                    cb(response.data);
               });
          },

          myVehicles : function (userId, cb) {
               var obj = $http.get('/vehicles/myvehicles?uId='+ userId);
               obj.then(function(response) {
                    cb(response.data);
               });
          },
          listCars : function (queryStr, cb) {
               var search = $http.get('/vehicles/list?'+queryStr);
               search.then(function(response) {
                    cb(response.data);
               });
          },
          favourite : function (key, userId, vehicleId, cb) {
               var search = $http.get('/vehicles/addToFavourites?key='+key+'&refId='+vehicleId+'&uId='+userId);
               search.then(function(response) {
                    cb(response.data);
               });
          },
          checkFavourite : function (userId, vehicleId, cb) {
               var search = $http.get('/vehicles/checkFavourite?refId='+vehicleId+'&uId='+userId);
               search.then(function(response) {
                    cb(response.data);
               });
          },
          searchFromto: function(searchObj,cb){
               cb(searchObj);
          },
          report:function(reportObj,cb){
               var rprt = $http.post('/infraction/report',reportObj);
               rprt.then(function(response) {
                    cb(response.data);
               });
          },
          fevorite:function(whicleObj,cb){
               var fevo= $http.post('/infraction/fevorite',whicleObj);
               fevo.then(function(response){
                    cb(response.data);
               });
          },
          paypal:function(payment,cb){
               var pay=$http.post('/payment/rentCar',payment)
               pay.then(function(response){
                    cb(response.data);
               });
          },
          savePaypalTransaction : function(obj, cb){
               var pay = $http.post('/payment/saveTransaction', obj)
               pay.then(function(response){
                    cb(response.data);
               });
          },
          getTransactions : function(userId, cb){
               var pay = $http.get('/payment/getTransactions?userId='+userId)
               pay.then(function(response){

                    cb(response.data);
               });
          },
          sendReferrals : function(referral,cb){
                var reff = $http.post("/account/sendReferrals",referral)
               reff.then(function(response){
                    cb(response.data);
               });
          },
          referralData : function(code,cb){
               var reff = $http.get("/account/referralInfo?code="+code)
               reff.then(function(response){
                    cb(response.data);
               });
          },
          checkAvailability : function(startDate,endDate, vehicleId, cb){
               var check = $http.get("/vehicles/checkAvailabilty?startDate="+startDate + "&endDate=" + endDate + "&vehicleId="+vehicleId)
              check.then(function(response){
                   cb(response.data);
              });
         },
          getCities : function(cb){
               var check = $http.get("/vehicles/cities");
              check.then(function(response){
                   cb(response.data);
              });
         },
         tripView : function (refId, cb) {
              var obj = $http.get('/payment/vehicleBooking?vehicleId='+ refId);
              obj.then(function(response) {
                   cb(response.data);
              });
         },
         bookingView : function (bookingId, cb) {
            var obj = $http.get('/payment/bookingInfo?bookingId='+ bookingId);
            obj.then(function(response) {
                  cb(response.data);
            });
        },
       review : function(obj,cb){
              var rev = $http.post("/vehicles/review",obj);
            rev.then(function(response){
                  cb(response.data);
            });
       },
       getAirport : function (cb) {
         var obj = $http.get('/vehicles/airports');
         obj.then(function(response) {
                cb(response.data);
         });
    },
    addMsg : function(obj, cb){
         var msg = $http.post('/chat/addMessage', obj)
         msg.then(function(response){
              cb(response.data);
         });
    },

     }
}
