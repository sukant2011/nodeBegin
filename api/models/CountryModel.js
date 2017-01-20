/*
* Author : vishesh Chauhan
* Module : CountryNames
* Description : Use for adding country
*/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let modelSchema = new Schema({
     country : {type : String},


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

let modelObj = mongoose.model('Country', modelSchema);
module.exports = modelObj;
