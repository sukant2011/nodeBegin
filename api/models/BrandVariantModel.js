/*
* Author : Sunny Chauhan
* Module : BrandModel
* Description : Use for adding Brand
*/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let modelSchema = new Schema({
     name : {type : String},
     type : {type : String},
     models : [],
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

modelSchema.set('toObject', { virtuals: true });
modelSchema.set('toJSON', { virtuals: true });

let modelObj = mongoose.model('BrandVariant', modelSchema);
module.exports = modelObj;
