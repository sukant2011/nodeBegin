/*
* Author : vishesh Chauhan
* Module : blogmodule
* Description : Use for blogmodule Info
*/
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let
bcrypt=require('bcrypt-nodejs');
SALT_WORK_FACTOR = 10;

let modelSchema = new Schema({
     userId : {type : ObjectId, ref : 'User'},
     title : {
          type: String
     },
     image : {
          photoOriginal : {type:String, default : ""},
          photo :{type:String, default : ""},
          path : {type:String}
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

let modelObj = mongoose.model('Blog', modelSchema);
module.exports = modelObj;
