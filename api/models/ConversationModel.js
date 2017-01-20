
/*
* Author : Sunny Chauhan
* Module : BokingModel
* Description : Use for report/abuse
*/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let modelSchema = new Schema({
     message : {type : String},
     from : {type : ObjectId, ref : 'User'},
     to : {type : ObjectId, ref : 'User'},
     type : {
          type: String,
          enum : ['Chat', 'Message'],
          default:'Chat'
     },
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

let modelObj = mongoose.model('Conversation', modelSchema);
module.exports = modelObj;
