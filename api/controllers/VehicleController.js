/*
* Author : Sunny Chauhan
* Module : VehicleController
* Description : Use to add & update vehicle Info
*/
const AppMessages = require(APP_PATH + '/config/Message.js');
const AppConstants = require(APP_PATH + '/config/Constant.js');
const CommonService = require(APP_PATH + '/api/services/CommonService.js');
const VehicleModel = require(APP_PATH + '/api/models/VehicleModel.js');
const BookingModel = require(APP_PATH + '/api/models/BookingModel.js');
const BrandModel = require(APP_PATH + '/api/models/BrandModel.js');
const BrandVariantModel = require(APP_PATH + '/api/models/BrandVariantModel.js');
const ReviewModel = require(APP_PATH + '/api/models/ReviewModel.js')
const UserModel = require(APP_PATH + '/api/models/UserModel.js');
const StateModel = require(APP_PATH + '/api/models/StateModel.js');
const CountryModel = require(APP_PATH + '/api/models/CountryModel.js');
const AirportModel = require(APP_PATH + '/api/models/AirportModel.js');

class VehicleController  {

     /**--------------------------------------------------------------------------
     Function    : getVehicles
     Description : use to list & search the vehicles
     --------------------------------------------------------------------------*/
     getVehicles (req, res) {
          let condArr = {isDeleted: false, status : true, listingStatus : 'LISTED', isPublish : true};
          let sortCondn = {};
          let limitCondn = {};
          let skipCondn = {};
          let geoNearCondn = {};
          let aggregationArr = [];

          if(req.query.limit) {
               limitCondn = { $limit : parseInt(req.query.limit) }
          } else {
               limitCondn = { $limit : 10 }
          }
          if(req.query.offset) {
               skipCondn = { $skip : parseInt(req.query.offset) }
          } else {
               skipCondn = { $skip : 0 }
          }

          /** conditions for sorting **/
          var sortAttr = req.query.sort;
          if(sortAttr == 'low') {
               sortCondn = {"ridingCost" : 1};
          } else if (sortAttr == 'high') {
               sortCondn = {"ridingCost" : -1};
          }else{
               sortCondn = {"ridingCost" : -1};
          }

          if(req.query.transmission && req.query.transmission != 'All') {
               condArr['specifications.transmission'] = new RegExp('^'+req.query.transmission+'$', "i");
          }

          if(req.query.minPrice || req.query.maxPrice) {
               req.query.minPrice = req.query.minPrice || 0;
               req.query.maxPrice = req.query.maxPrice || 1500;
               condArr['ridingCost'] = {$gte : parseInt(req.query.minPrice), $lte : parseInt(req.query.maxPrice)};
          }

          if(req.query.minDistance || req.query.maxDistance) {
               req.query.minDistance = req.query.minDistance || 0;
               req.query.maxDistance = req.query.maxDistance || 1500;
               condArr['distance.day'] = {$gte : parseInt(req.query.minDistance), $lte : parseInt(req.query.maxDistance)};
          }

          if(req.query.feature && req.query.feature != 'All') {
               let featureArr = req.query.feature.split(',');
               let featureLength = featureArr.length;
               condArr['details.features'] = {'$in' : featureArr};
          }

          if(req.query.color) {
               let colorArr = req.query.color.split(',');
               condArr['details.color'] = {'$in' : colorArr};
          }

          if(req.query.make && req.query.make != 'All') {
               condArr['specifications.make'] = new RegExp('^'+req.query.make+'$', "i");
          }

          if(req.query.year && req.query.year != 'All') {
               let year = parseInt(req.query.year);
               condArr['specifications.year'] = year;
          }

          if(req.query.model && req.query.model != 'All') {
               let model = req.query.model;
               condArr['specifications.model'] = new RegExp('^'+model+'$', "i");
          }

          // if(req.query.vehicleType && req.query.vehicleType != 'All') {
          //      condArr['type'] = new RegExp('^'+req.query.vehicleType+'$', "i");
          // }

          if(req.query.city && (!req.query.lat && !req.query.lon)) {
               //let regex = new RegExp(req.query.state, 'i');
               //condArr['address.state'] = new RegExp('^'+req.query.state+'$', "ig");
               condArr['address.state'] = {$regex : req.query.city};
          }
          //
          // if(req.query.state) {
          //      condArr['address.state'] = new RegExp('^'+req.query.state+'$', "i");
          // }



          if(req.query.fromDate && req.query.toDate) {
               if (req.query.fromTime) {
                    req.query.fromDate = req.query.fromDate + " " + req.query.fromTime;
               }
               if (req.query.toTime) {
                    req.query.toDate = req.query.toDate + " " + req.query.toTime;
               }
          }

          if(req.query.lat && req.query.lon) {
               let queryCoordinates = [parseFloat(req.query.lon), parseFloat(req.query.lat)];
               geoNearCondn = {
                    near: { type: "Point", coordinates: queryCoordinates},
                    distanceField: "dist.calculated",
                    maxDistance: 50 * 1609.34,
                    includeLocs: "dist.location",
                    spherical: true
               };

               aggregationArr = [
                    {
                         $geoNear : geoNearCondn
                    },
                    {
                         $match : condArr
                    },
                    {
                         $lookup : {
                                   from: 'users',
                                   localField: 'user',
                                   foreignField: '_id',
                                   as: 'info'
                         }
                    },
                    {
                         $lookup : {
                                   from: 'bookings',
                                   localField: '_id',
                                   foreignField: 'vehicleId',
                                   as: 'bookings'
                         }
                    },
                    {
                         $project : {
                              noOfTrips: { $size: "$bookings" },
                              _id : "$_id",
                              specifications : "$specifications",
                              userId : "$userId",
                              address : "$address",
                              delivery : "$delivery",
                              gallery: "$gallery",
                              ridingCost: "$ridingCost",
                              vehicleProtection: "$vehicleProtection",
                              salvageTitle: "$salvageTitle",
                              details: "$details",
                              distance: "$distance",
                              availability: "$availability",
                              type: "$type",
                              name: "$name",

                         }
                    },
                    {
                         $sort: sortCondn
                    },
                    skipCondn,
                    limitCondn
               ]

          } else {
               aggregationArr = [
                    {
                         $match : condArr
                    },
                    {
                         $lookup : {
                                   from: 'bookings',
                                   localField: '_id',
                                   foreignField: 'vehicleId',
                                   as: 'bookings'
                         }
                    },
                    // {
                    //      $match : {
                    //           "bookings.startDate": {"$lt": new Date(req.query.fromDate) }, "bookings.endDate": {"$gt": new Date(req.query.toDate)}
                    //      }
                    // },
                    {
                         $project : {
                              noOfTrips: { $size: "$bookings" },
                              _id : "$_id",
                              specifications : "$specifications",
                              userId : "$userId",
                              address : "$address",
                              delivery : "$delivery",
                              gallery: "$gallery",
                              ridingCost: "$ridingCost",
                              vehicleProtection: "$vehicleProtection",
                              salvageTitle: "$salvageTitle",
                              details: "$details",
                              distance: "$distance",
                              availability: "$availability",
                              type: "$type",
                              name: "$name",

                         }
                    },
                    {
                         $sort: sortCondn
                    },
                    skipCondn,
                    limitCondn
               ]
          }

          VehicleModel.aggregate(aggregationArr).exec(
               function(err,resData) {
                    if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                    UserModel.populate(resData, {path:'userId', select: 'name profile'},function(err,populatedResData){
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         return res.json({resStatus:'success', msg : 'Car Listing', result : populatedResData});
                    });
               }
          );
     }

     /**--------------------------------------------------------------------------
     Function    : myCars
     Description : use to get all cars of a User
     --------------------------------------------------------------------------*/
     myCars (req, res) {
          let async = require('async');
          let mongoose = require('mongoose');
          let uId = req.query.uId;
          let userId = mongoose.Types.ObjectId(req.query.uId);
          async.parallel({
               reviews : function(callback){
                    VehicleModel.aggregate([
                         {$match : {isDeleted: false, userId : userId}},
                         {$project : {"user" : "$userId", "vehicle" : "$_id"}},
                         {$group : {_id : "$user", "Arr" : {$push : "$vehicle"}}}
                    ], function (err, vehicles) {
                         //console.log(err); return;
                         if(err) {
                              callback(true, null);
                         } else if(vehicles.length && vehicles[0].Arr.length) {
                              ReviewModel
                                        .find({
                                                  vehicleId : {$in : vehicles[0].Arr}
                                             },
                                             {
                                                  createdDate : 0,
                                                  modifiedDate : 0,
                                                  status : 0,
                                                  isDeleted : 0,
                                                  _v : 0,
                                                  id :0
                                             }
                                        )
                                        .populate( {"path" : "userId", 'select' : 'name profile'})
                                        .exec(function(err,reviews){
                                             if(err) {
                                                  callback(true, null);
                                             } else {
                                                  callback(null, reviews);
                                             }
                                        });
                         } else {
                              callback(null, []);
                         }
                    });
               },
               myCars : function(callback){
                    let aggregationArr = [
                         {
                              $match : {
                                   isDeleted : false,
                                   userId : userId,
                                   isPublish : true
                              }
                         },
                         {
                              $lookup : {
                                        from: 'bookings',
                                        localField: '_id',
                                        foreignField: 'vehicleId',
                                        as: 'bookings'
                              }
                         },
                         {
                              $project : {
                                   noOfTrips: { $size: "$bookings" },
                                   _id : "$_id",
                                   specifications : "$specifications",
                                   userId : "$userId",
                                   gallery: "$gallery",
                                   ridingCost: "$ridingCost",
                                   name: "$name",
                              }
                         },
                         {
                              $sort: {createdDate : -1}
                         }
                    ];
                    VehicleModel.aggregate(aggregationArr).exec(
                         function(err,resData) {
                              if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                              UserModel.populate(resData, {path:'userId', select: 'name profile'},function(err,populatedResData){
                                   if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                   //console.log(populatedResData);
                                   if(err) {
                                        callback(true, null);
                                   } else {
                                        callback(null, populatedResData);
                                   }
                              });
                         }
                    );
                    // VehicleModel.find({isDeleted : false, userId : uId, isPublish : true}).exec(function(err,cars){
                    //      if(err) {
                    //           callback(true, null);
                    //      } else {
                    //           callback(null, cars);
                    //      }
                    // });
               },
               user : function(callback){
                    UserModel.findOne(
                         {_id : uId},{name : 1, createdDate : 1, email : 1, profile : 1, favourites : 1})
                         .populate({
                              path: 'favourites',
                              select : 'name specifications gallery ridingCost'
                         })
                         .exec(function(err,profile){
                              if (err) {
                                   callback(true, null);
                              } else {
                                   callback(null, profile);
                              }
                         });
                    }
               }, function(err, combineResult) {
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    res.json({resStatus:'success', msg : "my Cars", result : combineResult});
               });
          }

          /**--------------------------------------------------------------------------
          Function    : favouritesCar
          Description : use to get favourites Car
          --------------------------------------------------------------------------*/
          favouritesCar (req, res) {
               let userId = req.query.userId;
               UserModel
                    .findOne(
                              {_id : userId},
                              {name : 1, createdDate : 1, email : 1, profile : 1, favourites : 1}
                         )
                    .populate({
                         path: 'favourites',
                         select : 'userId name specifications gallery ridingCost',
                         populate : {
                              path : 'userId',
                              select : 'name'
                         }
                    })
                    .exec(function(err, cars){
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         if (cars) {
                              return res.json({resStatus:'success', msg :'favourites Cars', result : cars});
                         } else {
                              return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         }
                    });
          }


          /**--------------------------------------------------------------------------
          Function    : view
          Description : use to add a vehicle
          --------------------------------------------------------------------------*/
          view (req, res) {
               let async = require('async');
               let mongoose = require('mongoose');
               let vehicleId = mongoose.Types.ObjectId(req.query.refId);
               async.parallel({
                    view : function (callback) {
                         VehicleModel.findOne({isDeleted: false, _id : req.query.refId}).populate({path:'userId delivery.airports.id', select: 'name profile location'}).exec(function(err,resData){
                              if(err) {
                                   callback(true, null);
                              } else {
                                   callback(null, resData);
                              }
                         });
                    },
                    rating : function (callback) {
                         ReviewModel.aggregate(
                              [
                                   {$match : {"vehicleId" : vehicleId }},
                                   {$project : {"vehicle" : "$vehicleId", "rating" : "$rating"} },
                                   {$group : {_id : "$vehicle", "average" : {"$avg" : "$rating"}}}
                              ], function (err, review) {
                                   let avgRating = (review && review.length && review[0] && review[0].average ) ? review[0].average : 0;
                                   if(err) {
                                        callback(true, null);
                                   } else {
                                        callback(null, avgRating);
                                   }
                              }
                         );
                    },
                    trips : function (callback) {
                         BookingModel.aggregate(
                              [
                                   {$match : {"vehicleId" : vehicleId }},
                                   { $group: { _id: null, count: { $sum: 1 } } }
                              ], function (err, tripsArr) {
                                   let trips = (tripsArr.length && tripsArr[0] && tripsArr[0].count ) ? tripsArr[0].count : 0;
                                   if(err) {
                                        callback(true, null);
                                   } else {
                                        callback(null, trips);
                                   }
                              }
                         );
                    },
                    reviews : function (callback) {
                         ReviewModel
                              .find(
                                        {
                                             isDeleted: false,
                                             status : true,
                                             vehicleId : req.query.refId
                                        },
                                        {
                                             userId : 1,
                                             comment : 1,
                                             createdDate : 1
                                        }
                                   )
                              .populate(
                                        {
                                             path : 'userId',
                                             select: 'name profile '})
                              .exec(function(err,reviews){
                                   if(err) {
                                        callback(true, null);
                                   } else {
                                        callback(null, reviews);
                                   }
                         });
                    }
               },function(err, combineResult) {
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    return res.json({resStatus:'success', msg : "Vehicle Info", result : combineResult});
               }
          );
     }

     /**--------------------------------------------------------------------------
     Function    : add
     Description : use to add a vehicle
     --------------------------------------------------------------------------*/
     add (req, res) {
          let async = require('async');
          async.waterfall([
               function (callback) {
                    let postBody = {};
                    if(req.body.isMobile == 'true') {
                         let address = {};
                         let specifications = {};
                         if(req.body.salvageTitle) {
                              postBody.salvageTitle = req.body.salvageTitle;
                         }
                         address.location = req.body.location;
                         address.lat = req.body.lat;
                         address.lon = req.body.lon;
                         address.geoLocation = { type: 'Point', coordinates: [parseInt(req.body.lon), parseInt(req.body.lat)] };
                         address.city = req.body.city;
                         address.state = req.body.state;
                         address.country = req.body.country;
                         postBody.address = address;

                         specifications.odometer = req.body.odometer;
                         specifications.year = req.body.year;
                         specifications.model = req.body.model;
                         specifications.make = req.body.make;
                         postBody.userId = req.body.userId;
                         postBody.specifications = specifications;
                    } else {
                         postBody = req.body;
                    }

                    VehicleModel(postBody).save(function(err,resData){
                         if(err) {
                              callback(true, null);
                         } else {
                              callback(null, resData);
                         }
                    });
               },
               function (result, callback) {
                    CommonService.isMobileVerificationDone(result.userId, function(err, status) {
                         if(err) {
                              callback(true, null);
                         } else {
                              callback(null, {info : result, mobileVerification : status });
                         }
                    });
               },
               function (aggregateResult, callback) {
                    CommonService.isLicenseVerificationDone(aggregateResult.info.userId, function(err, status) {
                         if(err) {
                              callback(true, null);
                         } else {
                              aggregateResult.licenseVerification = status;
                              callback(null, aggregateResult);
                         }
                    });
               }
          ], function(err, combineResult) {
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               if(!combineResult) {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               } else {
                    return res.json({resStatus:'success', msg : "Info has successfully added", result : combineResult});
               }

          });

     }

     /**--------------------------------------------------------------------------
     Function    : update
     Description : use to update vehicle info
     --------------------------------------------------------------------------*/
     update (req, res) {
          //console.log(req.body);return;
          let async = require('async');
          let vehicleId = req.body._id;
          let postBody = {};
          let updateObj = {};
          if(req.body.isMobile == 'true') {
               let address = {};
               let specifications = {};
               let distance = {};
               let availability = {};
               let details = {};
               let delivery = {};
               let vehicleProtection = {};
               postBody.userId = req.body.userId;

               if(req.body.isPublish) {
                    updateObj.isPublish = req.body.isPublish;
               }

               if(req.body.listingStatus) {
                    updateObj.listingStatus = req.body.listingStatus;
               }

               if(req.body.salvageTitle) {
                    updateObj.salvageTitle = req.body.salvageTitle;
               }
               if(req.body.ridingCost) {
                    updateObj.ridingCost = req.body.ridingCost;
               }

               /** object for distance */
               if(req.body.day) {
                    updateObj["distance.day"] = req.body.day;
               }
               if(req.body.week) {
                    updateObj["distance.week"] = req.body.week;
               }
               if(req.body.month) {
                    updateObj["distance.month"] = req.body.month;
               }

               /** object for delivery */
               if(req.body.guestLocation) {
                    updateObj["delivery.guestLocation.isAvailable"] = req.body.guestLocation;
               }
               if(req.body.guestLocation_fee) {
                    updateObj["delivery.guestLocation.fee"] = req.body.guestLocation_fee;
               }
               if(req.body.guestLocation_distance) {
                    updateObj["delivery.guestLocation.distance"] = req.body.guestLocation_distance;
               }
               if(req.body.airports) {
                    //let featureArr = eval(req.body.features);
                    updateObj["delivery.airports"] = eval (req.body.airports);
               }

               /** object for address */
               if(req.body.location) {
                    updateObj["address.location"] = req.body.location;
               }
               if(req.body.lat) {
                    updateObj["address.lat"] = req.body.lat;
               }
               if(req.body.lon) {
                    updateObj["address.lon"] = req.body.lon;
               }
               if(req.body.lat && req.body.lon) {
                    updateObj["address.geoLocation"] = { type: 'Point', coordinates: [parseInt(req.body.lon), parseInt(req.body.lat)] };
               }
               if(req.body.city) {
                    updateObj["address.city"] = req.body.city;
               }
               if(req.body.state) {
                    updateObj["address.state"] = req.body.state;
               }
               if(req.body.country) {
                    updateObj["address.country"] = req.body.country;
               }

               /** object for specifications */
               if(req.body.odometer) {
                    updateObj["specifications.odometer"] = req.body.odometer;
               }
               if(req.body.year) {
                    updateObj["specifications.year"] = req.body.year;
               }
               if(req.body.model) {
                    updateObj["specifications.model"] = req.body.model;
               }
               if(req.body.make) {
                    updateObj["specifications.make"] = req.body.make;
               }

               /** object for availability */
               if(req.body.shortestTrip) {
                    //availability.shortestTrip = req.body.shortestTrip;
                    updateObj["availability.shortestTrip"] = req.body.shortestTrip;
               }
               if(req.body.longestTrip) {
                    //availability.longestTrip = req.body.longestTrip;
                    updateObj["availability.longestTrip"] = req.body.longestTrip;
               }
               if(req.body.notice) {
                    //availability.shortestTrip = req.body.shortestTrip;
                    updateObj["availability.notice"] = req.body.notice;
               }
               if(req.body.fromTime) {
                    //availability.fromTime = req.body.fromTime;
                    updateObj["availability.fromTime"] = req.body.fromTime;
               }
               if(req.body.toTime) {
                    //availability.toTime = req.body.toTime;
                    updateObj["availability.toTime"] = req.body.toTime;
               }
               if(req.body.calendar_details) {
                    //availability.details = req.body.calendar_details;
                    updateObj["availability.details"] = req.body.calendar_details;
               }
               if(req.body.isLongTripAvail) {
                    //availability.isLongTripAvail = req.body.isLongTripAvail;
                    updateObj["availability.isLongTripAvail"] = req.body.isLongTripAvail;
               }
               // if(Object.keys(availability).length) {
               //      postBody.availability = availability;
               // }

               /** object for details */
               if(req.body.plateNo) {
                    //details.plateNo = req.body.plateNo;
                    updateObj["details.plateNo"] = req.body.plateNo;
               }
               if(req.body.details_state) {
                    //details.state = req.body.details_state;
                    updateObj["details.state"] = req.body.details_state;
               }
               if(req.body.details_description) {
                    //details.description = req.body.description;
                    updateObj["details.description"] = req.body.details_description;
               }
               if(req.body.features) {
                    let featureArr = eval(req.body.features);
                    updateObj["details.features"] = featureArr;
               }

               /** object for vehicleProtection */
               if(req.body.protectionType) {
                    updateObj["vehicleProtection.type"] = req.body.protectionType;
               }
               if(req.body.protectionPrice) {
                    updateObj["vehicleProtection.price"] = req.body.protectionPrice;
               }

               //console.log("In======", updateObj); return;
               //return;
          } else {
               updateObj = req.body;
          }
           //console.log("OUT======", updateObj);
          //return;
          if(req.body.availability && !req.body.availability.shortestTrip) {

               async.parallel({
                    mobileVerification : function (callback) {
                         CommonService.isMobileVerificationDone(updateObj.userId, function(err, status) {
                              if(err) {
                                   callback(true, null);
                              } else {
                                   callback(null, status);
                              }
                         });
                    },
                    licenseVerification : function(callback){
                         CommonService.isLicenseVerificationDone(updateObj.userId, function(err, status) {
                              if(err) {
                                   callback(true, null);
                              } else {
                                   callback(null, status);
                              }
                         });
                    },
                    update : function(callback){
                         if(req.body.isMobile == 'true') {
                              VehicleModel.findOneAndUpdate({isDeleted: false, _id : vehicleId}, {$set : updateObj }, {new:true, upsert : false}).populate({path:'delivery.airports.id', select: 'name location'}).exec(function(err,resData){

                                   if(err) {

                                        callback(true, null);
                                   } else {
                                        if(!resData) {
                                             callback(true, null);
                                        } else {
                                             callback(null, resData);
                                        }
                                   }
                              });
                         } else {
                              VehicleModel.findOneAndUpdate({isDeleted: false, _id : vehicleId},postBody, {new:true, upsert : false}).populate({path:'delivery.airports.id', select: 'name location'}).exec(function(err,resData){
                                   if(err) {
                                        callback(true, null);
                                   } else {
                                        callback(null, resData);
                                   }
                              });
                         }
                    }
               }, function(err, combineResult) {
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    return res.json({resStatus:'success', msg : "Info has successfully updated", result : combineResult});
               }
          );
     } else {
          if(req.body.isMobile == 'true') {
               VehicleModel.findOneAndUpdate({isDeleted : false, _id : vehicleId}, {$set : updateObj}, {new:true, upsert : false}).populate({path:'delivery.airports.id', select: 'name location'}).exec(function(err,resData){
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    if(!resData) {
                         return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    } else {
                         return res.json({resStatus:'success', msg : 'Info has successfully saved', result : {update: resData }});
                    }
               });
          } else {
               //console.log("=============Herrrrrrrr");
               VehicleModel.findOneAndUpdate({isDeleted : false, _id : vehicleId},{$set : updateObj}, {new:true}).populate({path:'delivery.airports.id', select: 'name location'}).exec(function(err,resData){
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    if(!resData) {
                         return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    } else {
                         return res.json({resStatus:'success', msg : 'Info has successfully saved', result : {update: resData }});
                    }
               });
          }
     }
}

/**--------------------------------------------------------------------------
Function    : removePhoto
Description : use to remove multiple photos of car
--------------------------------------------------------------------------*/
removePhoto (req, res) {
     let vehicleId = req.query.refId;
     let photoId = req.query.img;
     //console.log(`${vehicleId} ${photoId}`); return;
     VehicleModel.findOneAndUpdate({isDeleted : false, _id:vehicleId},{$pull:{'gallery.photos':photoId}}, {new:true},function(err, resData){
          if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
          if(!resData) {
               return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
          }else {
               return res.json({resStatus:'success', msg :'portrait removed Successfully', result : resData});
          }

     });
}

/**--------------------------------------------------------------------------
Function    : uplaod
Description : use to upload multiple photos of car
--------------------------------------------------------------------------*/
upload (req, res) {
     const fs = require('fs');
     const gm = require('gm');
     const imageMagick = gm.subClass({ imageMagick: true });
     const formidable = require('formidable');
     const form = new formidable.IncomingForm();

     let RecordLocator = "";

     //let lwip = require('lwip');
     form.parse(req, function(err, fields, files) {

          let vehicleId = fields.vehicleId;
          let userId = fields.userId;
          if(files.file && files.file.name){
               let uploadDir = 'public' + AppConstants.VEHICLE_PATH;
               fs.access(uploadDir, fs.F_OK, function(err) {
                    if (!err) {
                         let fileName = files.file.name;
                         let fileStrArr = fileName.split('.');
                         let ext = fileStrArr[fileStrArr.length - 1];
                         let newFileName = CommonService.generateRandom(8)+(new Date()).getTime() + CommonService.generateRandom(6) + '.' + ext;
                         fs.rename(files.file.path, uploadDir + "/" + newFileName, function(err) {
                              if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                              let path = AppConstants.VEHICLE_PATH;

                              /** Code for resizing images **/
                              // let thumbDir = 'public' + AppConstants.THUMBNAIL_PATH;
                              // let lwip = require("lwip");
                              // lwip.open(uploadDir + newFileName, function(err, image) {
                              //      if (err) return console.log(err);
                              //      image.batch()
                              //         .resize(400, 400, 'grid')
                              //         .writeFile(thumbDir + newFileName, function(err) {
                              //             if (err) return console.log(err);
                              //             console.log('done');
                              //       });
                              // });
                              /** ----------END------- **/

                              VehicleModel.findOneAndUpdate({_id : vehicleId, userId : userId},{"gallery.path" : path, $push : {"gallery.photos":newFileName}}, {new : true},function(err,resData){
                                   if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                   if(!resData) {
                                        return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                   } else {

                                        return res.json({resStatus:'success', msg :'Photo have been updated successfully',result:{file :newFileName, path : AppConstants.VEHICLE_PATH}});
                                   }

                              });
                         });
                    } else {
                         fs.mkdirSync(uploadDir);
                    }
               });
          } else {
               return res.json({resStatus:'success', msg :'Info have been updated successfully'});
          }

     });
}

/**--------------------------------------------------------------------------
Function    : delete
Description : use to delete the car
--------------------------------------------------------------------------*/
delete (req, res) {
     let vehicleId = req.query.refId;
     let userId = req.query.uId;
     VehicleModel.findOneAndUpdate({isDeleted : false, _id:vehicleId, userId : userId},{'isDeleted':true}, {new:true},function(err, resData){
          if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
          if (resData) {
               return res.json({resStatus:'success', msg :'Vehicle has been removed Successfully'});
          } else {
               return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
          }
     });
}

/**--------------------------------------------------------------------------
Function    : Add to favourites
Description : use to mark a car to favourites
--------------------------------------------------------------------------*/
addToFavourites (req, res) {
     let mongoose = require('mongoose');
     let vehicleId = mongoose.Types.ObjectId(req.query.refId);
     let userId = req.query.uId;
     let query = { $push : { favourites : vehicleId} };
     if(req.query.key == 2) {
          query = { $pull : { favourites : vehicleId} };
     }
     UserModel.findOneAndUpdate({isDeleted: false, _id:userId }, query, {new:true},function(err, resData){
          if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
          if (resData) {
               return res.json({resStatus:'success', msg :'favourite updated'});
          } else {
               return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
          }
     });
}

/**--------------------------------------------------------------------------
Function    : checkFavourite
Description : use to check if the specified vehicle is favourite
--------------------------------------------------------------------------*/
checkFavourite (req, res) {
     let mongoose = require('mongoose');
     let vehicleId =mongoose.Types.ObjectId(req.query.refId);
     let userId = req.query.uId;
     UserModel.findOne({isDeleted : false, _id:userId,  favourites : { $in : [vehicleId] }},function(err, resData){
          if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
          if (resData) {
               return res.json({resStatus:'success', msg :'Favourite Vehicle', result : true});
          } else {
               return res.json({resStatus:'success', msg : 'Favourite Vehicle', result : false});
          }
     });
}

/**--------------------------------------------------------------------------
Function    : Add review
Description : use to add a review
--------------------------------------------------------------------------*/
add_review (req, res) {
     //console.log(req.body); return;
     ReviewModel(req.body).save(function(err,resData){
          if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
          return res.json({resStatus:'success', msg : 'Review is add Successfully', result : resData});
     });
}

/**--------------------------------------------------------------------------
Function    : listBrand
Description : Use to get all car's brand
--------------------------------------------------------------------------*/
listBrand (req, res) {
     BrandVariantModel.aggregate([
          {"$match" : {"status" : true, isDeleted : false}},
          {
               "$project":
               { "name" : "$name"}
          },
          {
               "$group" : { "_id" : "$name"}
          }],function (err, resData) {
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg :'Models list', result : resData});
          });
     }

     /**--------------------------------------------------------------------------
     Function    : listBrand
     Description : Use to get all model's of a car
     --------------------------------------------------------------------------*/
     listModels (req, res) {
          let brand = req.query.brand;
          BrandVariantModel.aggregate([
               { "$unwind": "$models"},
               {"$match" : {"name" : brand}},
               {
                    "$project":
                    { "name" : "$name", "model" : "$models" }
               },
               {
                    "$group" : { "_id" : "$name", "models" : { "$push": "$model" }}
               }],function (err, resData) {
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    return res.json({resStatus:'success', msg :'Models list', result : resData});
               });
          }

          /**--------------------------------------------------------------------------
          Function    : listModelYears
          Description : Use to get all year's of car
          --------------------------------------------------------------------------*/
          listModelYears (req, res) {
               let brand = req.query.brand;
               let model = req.query.model;
               //console.log(brand + "---" + model); return;
               VehicleModel.aggregate([
                    {$match : {"isPublish":true, "status" : true, "specifications.make" : brand,
                    "specifications.model" : model}},
                    {$project : {"year" : "$specifications.year" }},
                    {$group: {"_id" : "$year"}}
               ],function (err, resData) {
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    return res.json({resStatus:'success', msg :'Models list', result : resData});
               });
          }

          /**--------------------------------------------------------------------------
          Function    : checkAvailabilty
          Description : Use to check if a vehicle is available
          --------------------------------------------------------------------------*/
          checkAvailabilty (req, res) {
               let vehicleId = req.query.vehicleId;
               let reqStartDate = req.query.startDate;
               let reqEndDate = req.query.endDate;
               let query = {vehicleId : vehicleId, "startDate": {"$lt": new Date(reqEndDate) }, "endDate": {"$gt": new Date(reqStartDate)}};
               BookingModel.findOne(query, function (err, resData) {
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    if(resData) {
                         return res.json({resStatus:'success', msg :'Already Booked', result : true});
                    } else {
                         return res.json({resStatus:'success', msg :'Booking Available', result : false});
                    }
               });
          }

          /**--------------------------------------------------------------------------
          Function    : getCities
          Description : Use to get all the cities where cars are vaialble
          --------------------------------------------------------------------------*/
          getCities (req, res) {
               VehicleModel.aggregate([
                    {$match : {isPublish:true, status : true}},
                    {$project : {state : "$address.state"}},
                    {$group : {_id : "$state"}}
               ],function (err, resData) {
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    return res.json({resStatus:'success', msg :'Cities List', result : resData});
               }
          );
     }

     /**--------------------------------------------------------------------------
     Function    : listCountry
     Description : Use to get all country
     --------------------------------------------------------------------------*/
     listCountry (req, res) {
          CountryModel.find({},{country : 1}, function (err, resData) {
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg :'Country list', result : resData});
          });
     }

     /**--------------------------------------------------------------------------
     Function    : listStates
     Description : Use to get all states of country
     --------------------------------------------------------------------------*/
     listStates (req, res) {
          let country = req.query.country;
          StateModel.aggregate([
               { "$unwind": "$states"},
               {"$match" : {isDeleted : false, "country" : country}},
               {
                    "$project":
                    { "country" : "$country", "state" : "$states" }
               },
               {
                    "$group" : { "_id" : "$country", "models" : { "$push": "$state" }}
               }],function (err, resData) {
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    return res.json({resStatus:'success', msg :'states list', result : resData});
               });
          }

          /**--------------------------------------------------------------------------
          Function    : listAirports
          Description : Use to list all airports
          --------------------------------------------------------------------------*/
          listAirports (req, res) {
               AirportModel.find({isDeleted : false},{name : 1, location :1, fee :1},function (err, resData) {
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    return res.json({resStatus:'success', msg :'states list', result : resData});
               });
          }

          /****************************************************Admis************
          **************************************************************************/

          /**--------------------------------------------------------------------------
          Function    : admin_vehicleCount
          Description : use to count vehicle
          --------------------------------------------------------------------------*/
          admin_vehicleCount (req, res) {
               VehicleModel.count({isPublish : true, status : true},function(err, count){
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    if (count) {
                         return res.json({resStatus:'success', msg :'User Count', count : count});
                    } else {
                         return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    }
               });
          }

          /**--------------------------------------------------------------------------
          Function    : userCarlist
          Description : use to get all cars of a User
          --------------------------------------------------------------------------*/
          admin_userCarlist (req, res) {
               VehicleModel.find({userId : req.query.userId},function(err,resData){
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    return res.json({resStatus:'success', msg : 'My Cars', result : resData});
               });
          }

          /**--------------------------------------------------------------------------
          Function    : admin_vehicleInfo
          Description : use to get info of vehicle
          --------------------------------------------------------------------------*/
          admin_vehicleInfo (req, res) {
               VehicleModel.findOne({_id : req.query.vehicleId}).populate({path:'userId', select: 'name profile'}).exec(function(err,resData){
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    return res.json({resStatus:'success', msg : 'vehicle Info', result : resData});
               });
          }

          /**--------------------------------------------------------------------------
          Function    : admin_status
          Description : use to update vehicle status
          --------------------------------------------------------------------------*/
          admin_status (req, res) {
               let vehicleId = req.query.vehicleId;
               let updatedStatus = req.query.status;
               VehicleModel.findOneAndUpdate({_id:vehicleId},{'status':updatedStatus}, {new:true},function(err, resData){
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    if (resData) {
                         return res.json({resStatus:'success', msg :'Vehicle has been updated Successfully'});
                    } else {
                         return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    }
               });
          }

          /**--------------------------------------------------------------------------
          Function    : admin_addBrand
          Description : use to add abrand
          --------------------------------------------------------------------------*/
          admin_addBrand (req, res) {
               BrandModel(req.body).save(function(err,resData){
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    return res.json({resStatus:'success', msg :AppMessages.LOGIN, result: resData});
               });
          }

          /**--------------------------------------------------------------------------
          Function    : admin_updateBrand
          Description : use to update abrand
          --------------------------------------------------------------------------*/
          admin_updateBrand (req, res) {
               BrandModel.findOneAndUpdate({"_id" : req.body._id}, req.body, {upsert:false, new:true},function (err, resData) {
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    return res.json({resStatus:'success', msg :'Update Successfll',result: resData});
               });
          }

          /**--------------------------------------------------------------------------
          Function    : admin_viewBrand
          Description : use to view a brand
          --------------------------------------------------------------------------*/
          admin_viewBrand (req, res) {
               BrandModel.findOne({_id:req.query.reqId}, function ( err, resData) {
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    return res.json({resStatus:'success', msg :"Template View", result : resData});
               });
          }

          /**--------------------------------------------------------------------------
          Function    : admin_listBrand
          Description : use to list a brand
          --------------------------------------------------------------------------*/
          admin_listBrand (req, res) {
               BrandModel.find({isDeleted : false},function(err, resData){
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    if (resData) {
                         return res.json({resStatus:'success', msg :'Template List', result : resData});
                    } else {
                         return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    }
               });
          }

          /**--------------------------------------------------------------------------
          Function    : admin_brandStatus
          Description : use to update brand status
          --------------------------------------------------------------------------*/
          admin_brandStatus (req, res) {
               let brandId = req.query.brandId;
               let updatedStatus = req.query.status;
               BrandModel.findOneAndUpdate({_id:brandId},{'status':updatedStatus}, {new:true},function(err, resData){
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    if (resData) {
                         return res.json({resStatus:'success', msg :'Brand has been updated Successfully'});
                    } else {
                         return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    }
               });
          }

          /**--------------------------------------------------------------------------
          Function    : admin_removeBrand
          Description : use to remove brand
          --------------------------------------------------------------------------*/
          admin_removeBrand (req, res) {
               BrandModel.findOneAndUpdate({_id:req.query.reqId},{'isDeleted':true}, {new:true},function(err, resData){
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    if (resData) {
                         return res.json({resStatus:'success', msg :'Template has been removed Successfully'});
                    } else {
                         return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    }
               });
          }

          /**--------------------------------------------------------------------------
          Function    : admin_addVariant
          Description : use to add model to the brand
          --------------------------------------------------------------------------*/
          admin_addVariant (req, res) {
               BrandVariantModel(req.body).save(function(err,resData){
                    if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                    return res.json({resStatus:'success', msg :AppMessages.LOGIN, result: resData});
               });
          }

          /**--------------------------------------------------------------------------
          Function    : admin_updateVariant
          Description : use to update model to the brand
          --------------------------------------------------------------------------*/
          admin_updateVariant (req, res) {
               BrandVariantModel.findOneAndUpdate(
                    {"_id" : req.body._id},
                    req.body,
                    {upsert:false, new:true},
                    function (err, resData) {
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});

                         return res.json({resStatus:'success', msg :'Update Successfll',result: resData});
                    });
               }

               /**--------------------------------------------------------------------------
               Function    : admin_viewVariant
               Description : use to view brand
               --------------------------------------------------------------------------*/
               admin_viewVariant (req, res) {
                    BrandVariantModel.findOne({_id:req.query.reqId}, function ( err, resData) {
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         return res.json({resStatus:'success', msg :"Template View", result : resData});
                    });
               }

               /**--------------------------------------------------------------------------
               Function    : admin_listVariant
               Description : use to list models
               --------------------------------------------------------------------------*/
               admin_listVariant (req, res) {
                    BrandVariantModel.find({isDeleted : false},function(err, resData){
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         if (resData) {
                              return res.json({resStatus:'success', msg :'Template List', result : resData});
                         } else {
                              return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         }
                    });
               }

               /**--------------------------------------------------------------------------
               Function    : admin_removeVariant
               Description : use to remove model
               --------------------------------------------------------------------------*/
               admin_removeVariant (req, res) {
                    BrandVariantModel.findOneAndUpdate({_id:req.query.reqId},{'isDeleted':true}, {new:true},function(err, resData){
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         if (resData) {
                              return res.json({resStatus:'success', msg :'Template has been removed Successfully'});
                         } else {
                              return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         }
                    });
               }


               /**--------------------------------------------------------------------------
               Function    : admin_addCountry
               Description : use to add a country
               --------------------------------------------------------------------------*/
               admin_addCountry (req, res) {
                    StateModel(req.body).save(function(err,resData){
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         return res.json({resStatus:'success', msg :AppMessages.LOGIN, result: resData});
                    });
               }

               /**--------------------------------------------------------------------------
               Function    : admin_listCountry
               Description : use to list countries
               --------------------------------------------------------------------------*/
               admin_listCountry (req, res) {
                    StateModel.find({isDeleted : false},function(err, resData){
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         if (resData) {
                              return res.json({resStatus:'success', msg :'Template List', result : resData});
                         } else {
                              return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         }
                    });
               }

               /**--------------------------------------------------------------------------
               Function    : admin_removeCountry
               Description : use to remove country
               --------------------------------------------------------------------------*/
               admin_removeCountry (req, res) {
                    StateModel.findOneAndUpdate({_id:req.query.reqId},{'isDeleted':true}, {new:true},function(err, resData){
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         if (resData) {
                              return res.json({resStatus:'success', msg :'Template has been removed Successfully'});
                         } else {
                              return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         }
                    });
               }

               /**--------------------------------------------------------------------------
               Function    : admin_viewCountry
               Description : use to view country
               --------------------------------------------------------------------------*/
               admin_viewCountry (req, res) {
                    StateModel.findOne({_id:req.query.reqId}, function ( err, resData) {
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         return res.json({resStatus:'success', msg :"Template View", result : resData});
                    });
               }

               /**--------------------------------------------------------------------------
               Function    : admin_updateCountry
               Description : use to update country
               --------------------------------------------------------------------------*/
               admin_updateCountry (req, res) {
                    //let states = req.body.states;
                    StateModel.findOneAndUpdate(
                         {"_id" : req.body._id},
                         // {
                         //      states :req.body.states
                         // },
                         req.body,
                         {
                              upsert:false, new:true
                         },
                         function (err, resData) {
                              if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              return res.json({resStatus:'success', msg :'Update Successfll',result: resData});
                         });
                    }

                    /**--------------------------------------------------------------------------
                    Function    : admin_addCountryName
                    Description : use to add state
                    --------------------------------------------------------------------------*/
                    admin_addCountryName (req, res) {
                         CountryModel(req.body).save(function(err,resData){
                              if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              return res.json({resStatus:'success', msg :AppMessages.LOGIN, result: resData});
                         });
                    }

                    /**--------------------------------------------------------------------------
                    Function    : admin_updateCountryName
                    Description : use to update state
                    --------------------------------------------------------------------------*/
                    admin_updateCountryName (req, res) {
                         CountryModel.findOneAndUpdate({"_id" : req.body._id}, req.body, {upsert:false, new:true},function (err, resData) {
                              if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              return res.json({resStatus:'success', msg :'Update Successfll',result: resData});
                         });
                    }

                    /**--------------------------------------------------------------------------
                    Function    : admin_viewCountryName
                    Description : use to view state
                    --------------------------------------------------------------------------*/
                    admin_viewCountryName (req, res) {
                         CountryModel.findOne({_id:req.query.reqId}, function ( err, resData) {
                              if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              return res.json({resStatus:'success', msg :"Country View", result : resData});
                         });
                    }

                    /**--------------------------------------------------------------------------
                    Function    : admin_listCountryName
                    Description : use to list states
                    --------------------------------------------------------------------------*/
                    admin_listCountryName(req, res) {
                         CountryModel.find({isDeleted : false, status : true},function(err, resData){
                              if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              if (resData) {
                                   return res.json({resStatus:'success', msg :'Countries List', result : resData});
                              } else {
                                   return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              }
                         });
                    }

                    /**--------------------------------------------------------------------------
                    Function    : admin_removeCountryName
                    Description : use to remove state
                    --------------------------------------------------------------------------*/
                    admin_removeCountryName (req, res) {
                         CountryModel.findOneAndUpdate({_id:req.query.reqId},{'isDeleted':true}, {new:true},function(err, resData){
                              if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              if (resData) {
                                   return res.json({resStatus:'success', msg :'Country has been removed Successfully'});
                              } else {
                                   return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              }
                         });
                    }



                    /**--------------------------------------------------------------------------
                    Function    : admin_addAirport
                    Description : use to add airport
                    --------------------------------------------------------------------------*/

                    admin_addAirport (req, res) {
                         AirportModel(req.body).save(function(err,resData){
                              if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              return res.json({resStatus:'success', msg :AppMessages.LOGIN, result: resData});
                         });
                    }

                    /**--------------------------------------------------------------------------
                    Function    : admin_updateAirport
                    Description : use to update airport
                    --------------------------------------------------------------------------*/
                    admin_updateAirport (req, res) {
                         AirportModel.findOneAndUpdate({"_id" : req.body._id}, req.body, {upsert:false, new:true},function (err, resData) {
                              if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              return res.json({resStatus:'success', msg :'Update Successfll',result: resData});
                         });
                    }

                    /**--------------------------------------------------------------------------
                    Function    : admin_viewAirport
                    Description : use to view airport
                    --------------------------------------------------------------------------*/
                    admin_viewAirport (req, res) {
                         AirportModel.findOne({_id:req.query.reqId}, function ( err, resData) {
                              if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              return res.json({resStatus:'success', msg :"Airport View", result : resData});
                         });
                    }

                    /**--------------------------------------------------------------------------
                    Function    : admin_listAirport
                    Description : use to list airports
                    --------------------------------------------------------------------------*/
                    admin_listAirport(req, res) {
                         AirportModel.find({isDeleted : false },function(err, resData){
                              if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              if (resData) {
                                   return res.json({resStatus:'success', msg :'Airports List', result : resData});
                              } else {
                                   return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              }
                         });
                    }

                    /**--------------------------------------------------------------------------
                    Function    : admin_removeAirport
                    Description : use to remove airport
                    --------------------------------------------------------------------------*/
                    admin_removeAirport (req, res) {
                         AirportModel.findOneAndUpdate({_id:req.query.reqId},{'isDeleted':true}, {new:true},function(err, resData){
                              if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              if (resData) {
                                   return res.json({resStatus:'success', msg :'Airport has been removed Successfully'});
                              } else {
                                   return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                              }
                         });
                    }





               }

               module.exports = new VehicleController();
