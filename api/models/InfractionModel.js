/*
* Author : Sunny Chauhan
* Module : InfractionModel
* Description : Use for report/abuse
*/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let modelSchema = new Schema({
     userId : {type : ObjectId,  ref: 'User'},
     vehicleId : {type : ObjectId, ref: 'Vehicle'},
     name : {type : String},
     comment : {type : String},
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

let modelObj = mongoose.model('Abuse', modelSchema);
module.exports = modelObj;
