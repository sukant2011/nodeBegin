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
     role: {
          type: String,
          enum: ['USER', 'ADMIN', 'ANON'],
          default:'USER'
     },
     name : {
          first: { type: String,},
          last: {type: String,}
     },
     mobile:{
          type:String, default : ""
     },
     email: {
          type: String,
     },
     verification : {
          mobile: {
               type: Boolean,
               default : false,
          },
          email: {
               type: Boolean,
               default : false,
          },
          license : {
               type: Boolean,
               default : false
          },

     },
     otp: {
          type: String,
          default : "",
     },
     token: {
          type: String,
          default : "",
     },
     googleId : {type : String, default : ""},
     facebookId : {type : String, default : ""},
     profile :{
            photoOriginal : {type:String, default : ""},
            photo :{type:String, default : ""},
            path : {type:String},
            description :{type:String},
            address : {
                  name: { type: String},
                  location: { type: String},
                  pincode :{type:Number},
            }
     },
     license :{
          name : {
               first: { type: String},
               middle: { type: String},
               last: {type: String}
          },
          dob : {
               type : Date
          },
          issuer : {
               country: { type: String},
               state : { type: String},
          },
          number : {type: String},
          image : {
               path : { type: String},
               name : { type: String},
               original :{ type: String}
          }
     },
     password:{
          type: String
          //required: 'Please enter password',
     },
     favourites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle'}],
     fcm : {
          deviceToken : {
               type : String
          },
          platform : {
               type: String,
               enum : ['ANDROID', 'IOS', 'WEB'],
          }
     },
     isLogin: {
          type: Boolean,
          enum : [true, false],
          default:false
     },
     isOnline: {
          type: String,
          enum : ['Y', 'N'],
          default : 'N'
     },
     isAllowManual : {
          type: Boolean,
          enum : [true, false],
          default:true
     },
     notifications : {
          mobileText : {
               type: Boolean,
               enum : [true, false],
               default:true
          },
          emailReminder : {
               type: Boolean,
               enum : [true, false],
               default:true
          },
          emailPromotions : {
               type: Boolean,
               enum : [true, false],
               default:true
          }
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

modelSchema.pre('save', function(next) {
     var user = this;
     // only hash the password if it has been modified (or is new)
     if (!user.isModified('password')) return next();

     // generate a salt
     bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
          if (err) return next(err);

          // hash the password using our new salt
          bcrypt.hash(user.password, salt, null,function(err, hash) {
               if (err) return next(err);

               // override the cleartext password with the hashed one
               user.password = hash;
               next();
          });
     });
});

modelSchema.pre('beforeUpdate',function(values, next) {
     bcrypt.genSalt(10, function(err, salt) {
          if (err) return next(err);
          if (values.password) {
               //code
               bcrypt.hash(values.password, salt, function(err, hash) {
                    if (err) return next(err);
                    values.password = hash;
                    next();
               });
          }
          else{
               next();

          }

     });
})

modelSchema.methods.comparePassword = function(password, user, cb) {
     //console.log(password);
     //console.log("User======",user);return;
     bcrypt.compare(password, user.password, function(err, match) {
          if (err) cb(err);
          if (match) {
               cb(null, true);
          } else {
               cb(err);
          }
     });
};

modelSchema.virtual('fullname')
.get(function () {
     return this.name.first + ' ' + this.name.last;
});


modelSchema.set('toObject', { virtuals: true });
modelSchema.set('toJSON', { virtuals: true });

// modelSchema.pre('save', function(next) {
//   var JobSeeker = this;
//   if (!JobSeeker.isModified('password')) {
//     return next();
//   }
//   bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash(JobSeeker.password, salt, function(err, hash) {
//       JobSeeker.password = hash;
//       next();
//     });
//   });
// });

let modelObj = mongoose.model('User', modelSchema);
module.exports = modelObj;
