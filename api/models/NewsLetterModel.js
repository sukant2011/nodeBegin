/*
* Author : Sunny Chauhan
* Module : NewsLetterModel
* Description : Use for taking Lead
*/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let modelSchema = new Schema({
     email : {type :String},
     status: {
          type: Boolean,
          enum : [true, false],
          default:true
     },
     isDeleted: {
          type: Boolean,
          enum : [true, false],
          default: false
     },
     createdDate:{type:Date, default: Date.now},
     modifiedDate:{type:Date, default: Date.now},
});

let modelObj = mongoose.model('NewsLetter', modelSchema);
module.exports = modelObj;
