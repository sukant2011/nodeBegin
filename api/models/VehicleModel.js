/*
* Author : Sunny Chauhan
* Module : VehicleModel
* Description : Use for Vehicle Info
*/

let
     mongoose = require('mongoose'),
     Schema = mongoose.Schema,
     ObjectId = Schema.ObjectId;

let specificationSchema = new Schema({
     year : { type: Number},
     make : { type: String},
     model : { type: String},
     odometer : { type: String},
     transmission : { type: String, default : "Manual"},
     seatBelts : {
          isAvailable : {
               type: Boolean,
               enum : [true, false],
               default:false
          },
          type : {
               type: String,
               enum : ['SHOULDER', 'LAP', 'MIXED']
          }
     }
});

let addressSchema = new Schema({
     geoLocation : {type: { type: String, default : 'Point'},coordinates : []},
     location : { type: String},
     lat :{ type: String},
     lon :{ type: String},
     city : { type: String},
     state : { type: String},
     country : { type: String},
     region : { type: String},
     streetAddress : { type: String}
});

var modelSchema = new Schema({
     userId : { type: ObjectId, ref : 'User'},
     name :  { type: String},
     type : {
          type : String,
          enum : ['Cars'],
          default : 'Cars'
     },
     address : addressSchema,
     specifications : specificationSchema,
     availability : {
          details : { type: String},
          fromTime : { type: String},
          toTime : { type: String},
          shortestTrip :{ type: String},
          longestTrip :{ type: String},
          notice : {type :String},
          isLongTripAvail : {
               type: Boolean,
               enum : [true, false],
               default:true
          },
          Unavailability : []
     },
     distance : {
          day : {type : Number, default : 200},
          week:{type : Number, default : 1000},
          month :{type : Number, default : 1500}
     },
     details : {
          plateNo :{ type: String},
          state :{ type: String},
          description : {type : String},
          color : {type : String},
          features : []
     },
     salvageTitle : {
          type: Boolean,
          enum : [true, false],
          default:false
     },
     vehicleProtection : {
          type : {
               type: String,
               enum : ['BASIC','STANDARD','PREMIUM'],
               default : 'PREMIUM'
          },
          price : {
               type : Number,
               default : 65
          }
     },
     marketValue : { type: Number},
     ridingCost : { type: Number, default : 50},
     mechanicalCond : {
          type: String,
          enum : ['EXCELLENT','GOOD','FAIR', 'NOT_WORKING'],
          default:'FAIR'
     },
     gallery : {
          path : {type : String, default : ""},
          photos : []
     },
     description : {
          type : String
     },
     delivery : {
          airports : [
               {
                    id : {type : ObjectId, ref : 'Airport'},
                    fee : {type : Number, default : 0},
               }
          ],
          guestLocation : {
               isAvailable : {
                    type: Boolean,
                    enum : [true, false],
                    default:false
               },
               fee : {
                    type : Number, default : 0
               },
               distance : {type : Number, default : 0}
          }
     },
     instructions : {
          type : String
     },
     isPublish: {
          type: Boolean,
          enum : [true, false],
          default:false
     },
     listingStatus : {
          type: String,
          enum : ['SNOOZED','LISTED','UNLISTED'],
          default:'LISTED'
     },

     unlistedStatus : {
               type : String
     },

     snozzedDate : {
               type : Date,
               default: null
     },


     status: {
          type: Boolean,
          enum : [true, false],
          default:false
     },
     isDeleted: {
          type: Boolean,
          enum : [true, false],
          default: false
     },
     createdDate:{type:Date, default: Date.now},
     modifiedDate:{type:Date, default: Date.now}
});

// modelSchema.virtual('coordinates')
// .get(function () {
//      return [this.address.lat + ',' + this.address.lon];
// });

modelSchema.set('toObject', { virtuals: true });
//modelSchema.set('toJSON', { virtuals: true });

let modelObj = mongoose.model('Vehicle', modelSchema);
module.exports = modelObj;
