/*
   Author :- Sunny chauhan
   Purpose :- Service used to send email throughout the application
 */

module.exports = {
    send: function(mailOptions, cb) {
          let nodemailer = require('nodemailer');
          let http = require('http');
          let transporter = nodemailer.createTransport(
                                   //{
                                   //     service: 'Gmail',
                                   //     auth: {
                                   //         user: sails.config.globals.SMTPUSER,
                                   //         pass: sails.config.globals.SMTPPASSWORD
                                   //     }
                                   //}
                              );
          transporter.sendMail(mailOptions, function(err, info){
               if(err){
                  return cb(err, null);
               }
               return cb(null, info);
          });
     },

     sendMultiple : function(toArr, mailOptions) {
          let nodemailer = require('nodemailer');
          let http = require('http');
          let transporter = nodemailer.createTransport(
                                   //{
                                   //     service: 'Gmail',
                                   //     auth: {
                                   //         user: sails.config.globals.SMTPUSER,
                                   //         pass: sails.config.globals.SMTPPASSWORD
                                   //     }
                                   //}
                              );

          for (var index in toArr) {
               mailOptions.to = toArr[index]
               transporter.sendMail(mailOptions, function(err, info){
                    if(err){
                         console.log("Some Err Occured");
                    }
                    console.log("Successfull");
               });
          }
     }
};
