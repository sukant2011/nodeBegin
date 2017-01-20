/*
* Author : Sunny Chauhan
* Module : PaymentController
*/
const AppMessages = require(APP_PATH + '/config/Message.js');
const CommonService = require(APP_PATH + '/api/services/CommonService.js');
const TransactionModel = require(APP_PATH + '/api/models/TransactionModel.js');
const BookingModel = require(APP_PATH + '/api/models/BookingModel.js');
const ENV_OBJ = require(APP_PATH + '/config/Env.js')();

let Paypal = require('paypal-express-checkout');
let paypal = Paypal.init(
     ENV_OBJ.PAYPAL.USERNAME,
     ENV_OBJ.PAYPAL.PASSWORD,
     ENV_OBJ.PAYPAL.SIGNATURE,
     ENV_OBJ.SITEURl + '/#/user/paypalInfo',
     ENV_OBJ.SITEURl + '/#/user/dashboard',
     true
);


class PaymentController  {

     /**--------------------------------------------------------------------------
     Function    : paynow
     Description : Authenticate Paypal & return the url to redirect
     --------------------------------------------------------------------------*/
     paynow(req,res) {
          let invoice = "INV" + new Date().getTime();
          let vehicle = req.body.specifications.model + " " + req.body.specifications.year;
          paypal.pay(invoice, req.body.price, vehicle, 'USD', true, function(err, url) {
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg :AppMessages.PAYMENT_REIDT_URL,result:url});
          });
     }

     /**--------------------------------------------------------------------------
     Function    : saveTransaction
     Description : Use to save the transaction
     --------------------------------------------------------------------------*/
     saveTransaction (req,res) {
          let token = req.body.token;
          let payerID = req.body.PayerID;
          let userId = req.body.userId;
          let vehicleId = req.body.vehicleId;
          try {
               paypal.detail(token, payerID, function(err, data, invoiceNumber, price) {
                    if (err) {
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    }
                    let transactionObj = {};
                    transactionObj.transactionId = data.PAYMENTINFO_0_TRANSACTIONID;
                    transactionObj.token = data.TOKEN;
                    transactionObj.timeStamp = data.TIMESTAMP;
                    transactionObj.paymentStatus = data.PAYMENTSTATUS;
                    transactionObj.amount = data.PAYMENTINFO_0_AMT;
                    transactionObj.paypalFee = data.PAYMENTINFO_0_FEEAMT;
                    transactionObj.payerID = payerID;
                    transactionObj.paymentType = data.PAYMENTINFO_0_TRANSACTIONTYPE;
                    transactionObj.userId = userId;
                    transactionObj.vehicleId = vehicleId;
                    transactionObj.invoice = invoiceNumber;
                    transactionObj.transObj = data;
                    TransactionModel(transactionObj).save(function (err, resData) {

                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         let bookingObj = {};
                         bookingObj.transactionId = resData._id;
                         bookingObj.startDate = req.body.startDate;
                         bookingObj.endDate = req.body.endDate;
                         bookingObj.vehicleId = vehicleId;
                         bookingObj.userId = userId;
                         bookingObj.location = req.body.location;
                         bookingObj.fee = req.body.fee;
                         bookingObj.deliveryType = req.body.deliveryType;
                         BookingModel(bookingObj).save(function (err, resData) {
                              if (err)  console.log("Booking Error");
                              console.log("Booking Success");
                         });
                         return res.json({resStatus:'success', msg : "Transaction Successfull"});
                    });
               });
          } catch (exception) {
               return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
          }
     }

     /**--------------------------------------------------------------------------
     Function    : getBookings
     Description : list all the bookings of a particular User
     --------------------------------------------------------------------------*/
     getBookings (req,res) {
          let userId = req.query.userId;
          BookingModel.find({
                              userId:userId
                         })
                         .populate(
                                   {
                                        path : 'vehicleId userId transactionId',
                                        select : 'name profile specifications gallery ridingCost amount createdDate invoice startDate endDate paymentStatus timeStamp paymentType email userId',
                                        populate :
                                             {
                                                  path : 'userId',
                                                  select : 'name profile'
                                             }
                                   }
                              )
                         .sort({createdDate : -1})
                         .exec(function (err, data) {
                              if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              return res.json({resStatus:'success', msg : "Transaction Informations", result : data});
                         });
     }

     /**--------------------------------------------------------------------------
     Function    : viewBooking
     Description : Get all the detail of a particular booking
     --------------------------------------------------------------------------*/
     viewBooking (req,res) {
          let bookingId = req.query.bookingId;
          BookingModel
                         .findOne(
                                   {
                                        _id:bookingId
                                   }
                         )
                         .populate(
                              {
                                   path : 'vehicleId userId transactionId bookingId',
                                   select : 'name gallery profile specifications ridingCost amount createdDate invoice startDate endDate paymentStatus timeStamp paymentType email userId',
                                   populate : {
                                                  path : 'userId',
                                                  select : 'name profile'
                                   }
                              }
                         ).exec(function (err, data) {
                              if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              return res.json({resStatus:'success', msg : "Booking Information", result : data});
                         });
     }

     /**--------------------------------------------------------------------------
     Function    : getVehicleBookingHistory
     Description : Get the booking History of a particular vehicle
     --------------------------------------------------------------------------*/
     getVehicleBookingHistory (req,res) {
          let vehicleId = req.query.vehicleId;
          BookingModel.find({
                              vehicleId : vehicleId
                         })
                         .populate({
                                   path : 'vehicleId userId transactionId',
                                   select : 'name profile gallery specifications ridingCost amount createdDate invoice startDate endDate paymentStatus timeStamp paymentType email userId',

                              })
                         .exec(
                              function (err, data) {
                                   if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                   return res.json({resStatus:'success', msg : "Vehicle Transaction History", result : data});
                              }
                         );
     }

     /**--------------------------------------------------------------------------
     Function    : admin_getTransactions
     Description : Get the transaction History for overall bookings
     --------------------------------------------------------------------------*/
     admin_getTransactions (req,res) {
          TransactionModel.find({

                              })
                              .populate({
                                             path : 'vehicleId userId',
                                             select : 'name specifications vehicleProtection fullname profile userId',
                                             populate : {
                                                            path : 'userId',
                                                            select : 'name profile'
                                             }
                                        })
                              .exec(function (err, data) {
                                   if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                   return res.json({resStatus:'success', msg : "Transaction Informations", result : data});
                              });
     }

     /**--------------------------------------------------------------------------
     Function    : admin_ViewTransaction
     Description : Get the deatil of a particular transaction
     --------------------------------------------------------------------------*/
     admin_ViewTransaction (req,res) {
          TransactionModel.findOne({
                                        _id : req.query.transactionId
                                   })
                                   .populate({
                                             path : 'vehicleId',
                                             select : 'name specifications vehicleProtection userId',
                                             populate : {
                                                            path : 'userId',
                                                            select : 'name profile'
                                             }
                                        })
                                   .exec(
                                        function (err, data) {
                                             if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                             return res.json({resStatus:'success', msg : "Transaction Infor", result : data});
                                        });
     }

     /**--------------------------------------------------------------------------
     Function    : admin_refundTransaction
     Description : Get the deatil of a particular transaction
     --------------------------------------------------------------------------*/
     admin_refundTransaction (req,res) {
          let transactionId = req.query.transactionId;
          TransactionModel.findOne({
                                        _id : transactionId
                                   })
                                   .populate({
                                             path : 'vehicleId userId',
                                             select : 'name email fullname specifications vehicleProtection userId'
                                        })
                                   .exec(function (err, data) {
                                        if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                        return res.json({resStatus:'success', msg : "Transaction Infor", result : data});
                                   });
     }

     /**--------------------------------------------------------------------------
     Function    : admin_paynow
     Description : Authenticate Paypal express checkout Url
     --------------------------------------------------------------------------*/
     admin_paynow(req,res) {
          let invoice = "INV" + CommonService.generateOtp(6);
          paypal.pay(
                    invoice,
                    req.body.amount,
                    'Seller',
                    'USD',
                    true,
                    function(err, url) {
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         return res.json({resStatus:'success', msg :AppMessages.PAYMENT_REIDT_URL,result:url});
                    }
               );
     }

}
module.exports=new PaymentController();
