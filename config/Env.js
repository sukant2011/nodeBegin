let constants = require(APP_PATH + "/config/Constant.js");

module.exports = function(){
     switch(process.env.NODE_ENV){

          case 'local':
          return {
               SITEURl : constants.LOCALURl,
               FACEBOOK : constants.FACEBOOK.LOCALHOST,
               GOOGLE : constants.GOOGLE.LOCALHOST,
               MONGODB : constants.MONGODB.LOCALHOST,
               PAYPAL : constants.PAYPAL.LOCALHOST,
               TWILIO : constants.TWILIO.LOCALHOST,
               FCM : constants.FCM.LOCALHOST,
          };

          case 'development':
          return {
               SITEURl : constants.DEVURl,
               FACEBOOK : constants.FACEBOOK.DEV,
               GOOGLE : constants.GOOGLE.DEV,
               MONGODB : constants.MONGODB.DEV,
               PAYPAL : constants.PAYPAL.DEV,
               TWILIO : constants.TWILIO.DEV,
               FCM : constants.FCM.DEV
          };

          case 'production':
          return {
               SITEURl : constants.DEVURl.LIVEURL,
               FACEBOOK : constants.FACEBOOK.LIVE,
               GOOGLE : constants.GOOGLE.LIVE,
               MONGODB : constants.MONGODB.LIVE,
               PAYPAL : constants.PAYPAL.LIVE,
               TWILIO : constants.TWILIO.LIVE,
               FCM : constants.FCM.LIVE
          };

          default:
          return {
               SITEURl : constants.LOCALURl,
               FACEBOOK : constants.FACEBOOK.LOCALHOST,
               GOOGLE : constants.GOOGLE,
               MONGODB : constants.MONGODB.LOCALHOST,
               PAYPAL : constants.PAYPAL.LOCALHOST,
               TWILIO : constants.TWILIO.LOCALHOST,
               FCM : constants.FCM.DEV
          };
     }
};
