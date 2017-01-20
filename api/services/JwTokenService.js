/*
   Author :- Sunny chauhan
   Purpose :- Service used to generate & verify user token
 */


const jwt = require('jsonwebtoken');
const tokenSecret = "KGKGKJG&*575765VGJHGJ";
const UserModel = require(APP_PATH + '/api/models/UserModel.js');
module.exports = {

     // Generates a token from supplied payload
     issueToken : function(payload, platform, deviceToken) {
          //   return jwt.sign(
          //       payload,
          //       tokenSecret,// Token Secret that we sign it with
          //       '2 days'
          //   //     {
          //   //       expiresIn : '1d' // Token Expire time
          //   //     }
          //   );
          let token = jwt.sign(
                              {
                                   auth:  payload,
                                   exp:  Math.floor(new Date().getTime()/1000) + 7*24*60*60 // Note: in seconds!
                              },
                              tokenSecret);  // secret is defined in the environment variable JWT_SECRET

          if(platform == 'WEB') {
               deviceToken = payload;
          }

          UserModel
               .update(
                    { _id : payload },
                    { isOnline : 'Y', 'fcm.platform' : platform, 'fcm.deviceToken' : deviceToken },
                    { upsert : false }
               )
               .exec (
                         function(err, updateStatus) {
                              console.log("User logged into the application");
                         }
               );

          return token;
     },

     // Verifies token on a request
     verify : function(token, callback) {
          return jwt.verify(
               token, // The token to be verified
               tokenSecret, // Same token we used to sign
               {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
               callback //Pass errors or decoded token to callback
          );
     }
}
