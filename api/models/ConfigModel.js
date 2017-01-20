/*
* Author : Sunny Chauhan
* Module : BokingModel
* Description : Use for report/abuse
*/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let modelSchema = new Schema({
     youtubeLink : {type :String},
     twitterLink : {type :String},
     pinInterestLink : {type :String},
     googleLink : {type :String},
     instagramLink : {type :String},
     facebookLink : {type :String},
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

let modelObj = mongoose.model('Config', modelSchema);
module.exports = modelObj;
