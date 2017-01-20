/*
* Author : Sunny Chauhan
* Module : UserModel
* Description : Use for User Info
*/
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let
bcrypt=require('bcrypt-nodejs');
SALT_WORK_FACTOR = 10;

let modelSchema = new Schema({
     title : {
          type: String
     },
     subject:{
          type:String,
     },
     variables : {
          type: String,
     },
     description : {
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

let modelObj = mongoose.model('Template', modelSchema);
module.exports = modelObj;
