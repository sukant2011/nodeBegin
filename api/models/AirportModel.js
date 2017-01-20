/*
* Author : vishesh Chauhan
* Module : Airportmodule
* Description : Use for Airportmodule Info
*/
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let
bcrypt=require('bcrypt-nodejs');
SALT_WORK_FACTOR = 10;

let modelSchema = new Schema({

     name : {
          type: String
     },


     location : {
          type : String
     },
     fee : {
          type : String
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
     modifiedDate:{type:Date, default: Date.now},
     //     toObject: {virtuals: true},
     //     toJSON: {virtuals: true }
});

let modelObj = mongoose.model('Airport', modelSchema);
module.exports = modelObj;
