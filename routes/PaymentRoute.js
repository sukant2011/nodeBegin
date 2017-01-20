module.exports = function(app, express) {
     let router = express.Router();
     let routeObj = require(APP_PATH + '/api/controllers/PaymentController.js');
     let authorization = require(APP_PATH + "/api/middlewares/user_TokenAuth.js");
     let adminAuthorization = require(APP_PATH + "/api/middlewares/admin_TokenAuth.js");

     router.post('/rentCar', authorization, routeObj.paynow);
     router.post ('/saveTransaction', authorization, routeObj.saveTransaction);
     router.get ('/getTransactions', authorization, routeObj.getBookings);
     router.get ('/vehicleBooking', authorization, routeObj.getVehicleBookingHistory);
     router.get ('/bookingInfo', authorization, routeObj.viewBooking);

     router.get ('/admin/getTransactions', adminAuthorization, routeObj.admin_getTransactions);
     router.get ('/admin/viewTransactions', adminAuthorization, routeObj.admin_ViewTransaction);
     router.get ('/admin/getRefund', adminAuthorization, routeObj.admin_refundTransaction);
     router.post('/admin/paySeller', adminAuthorization, routeObj.admin_paynow);
     app.use('/payment', router);
}
