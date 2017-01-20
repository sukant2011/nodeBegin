const globalConstants = {
     LOCALURl : 'http://localhost:3000',
     DEVURl  : 'http://turo.mobilytedev.com:3000',
     LIVEURL : 'http://rentcorsa.com',
     FCM : {
          LOCALHOST : {
               SERVERKEY : 'AIzaSyB_pm8CawmeOapCNDGoKSVzeM4EdQqGVB4',
          },
          DEV : {
               SERVERKEY : 'AIzaSyB_pm8CawmeOapCNDGoKSVzeM4EdQqGVB4',
          },
          LIVE : {
               SERVERKEY : 'AIzaSyB_pm8CawmeOapCNDGoKSVzeM4EdQqGVB4',
          }
     },
     MONGODB : {
          LOCALHOST : {
               URI : 'mongodb://mobilyte:mobilyte@ds161505.mlab.com:61505/corsa',
          },
          DEV : {
               URI : 'mongodb://mobilyte:mobilyte@ds161505.mlab.com:61505/corsa',
          },
          LIVE : {
               URI : 'mongodb://mobilyte:mobilyte@ds019966.mlab.com:19966/mobilyte',
          }
     },
     TWILIO : {
          LOCALHOST : {
               SENDER : "+15005550006",
               SID : "ACf4a55dbbf9a20fcf55bf8cce47c5b271",
               AUTHTOKEN : "5fb47c3e4cb57019af1e53599e0cfdb5"
          },
          DEV : {
               SENDER : "+15005550006",
               SID : "AC91e5546fff0e852014e3c4f7e28fdd68",
               AUTHTOKEN : "239c5bbe97cdccbb0ce9cc7a9be469c6"
          },
          LIVE : {
               SENDER : "+15005550006",
               SID : "ACa7ce0c4b0923de47fa9bc84fbb111b4d",
               AUTHTOKEN : "5eaf829541635241d319409b411cf1f1"
          }
     },
     GOOGLE : {
          LOCALHOST : {
               CLIENT_ID : " 682489641376-tevritvf7g2npjq2oeb7rb3emn0s71fk.apps.googleusercontent.com ",
               CLIENT_SECRET : "AKHlgwLeYGPhIgdKkEswEQG1",
               REDIRECT_URI : "http://localhost:3000"
          },
          DEV : {
               CLIENT_ID : " 682489641376-tevritvf7g2npjq2oeb7rb3emn0s71fk.apps.googleusercontent.com ",
               CLIENT_SECRET : "AKHlgwLeYGPhIgdKkEswEQG1",
               REDIRECT_URI : "http://turo.mobilytedev.com:3000"
          },
          LIVE : {
               CLIENT_ID : " 682489641376-tevritvf7g2npjq2oeb7rb3emn0s71fk.apps.googleusercontent.com ",
               CLIENT_SECRET : "AKHlgwLeYGPhIgdKkEswEQG1",
               REDIRECT_URI : "http://www.rentcorsa.com"
          }
     },
     FACEBOOK : {
          LOCALHOST : {
               CLIENT_ID : "1756791964596216",
               CLIENT_SECRET : "d4f36db9045c182df3527a7cd953dff3",
               REDIRECT_URI : "http://localhost:3000"
          },
          DEV : {
               CLIENT_ID : "1757686401155551",
               CLIENT_SECRET : "74d0d96c1c692e74b114007c7828fbe4",
               REDIRECT_URI : "http://turo.mobilytedev.com:3000"
          },
          LIVE : {
               CLIENT_ID : "1159368540791472",
               CLIENT_SECRET : "258a3c772a3b6aeaeae1f52ffe7c4740",
               REDIRECT_URI : "http://www.rentcorsa.com"
          }
     },
     PAYPAL : {
          LOCALHOST : {
               USERNAME : "mangalhcl449-facilitator_api1.gmail.com",
               PASSWORD : "5P5L3CQ7S324EKCQ",
               SIGNATURE : "AFcWxV21C7fd0v3bYYYRCpSSRl31A9XUTbqwt5YYc-fS4nEgEUPL-f.n"
          },
          DEV : {
               USERNAME : "mangalhcl449-facilitator_api1.gmail.com",
               PASSWORD : "5P5L3CQ7S324EKCQ",
               SIGNATURE : "AFcWxV21C7fd0v3bYYYRCpSSRl31A9XUTbqwt5YYc-fS4nEgEUPL-f.n"
          },
          LIVE : {
               USERNAME : "mangalhcl449-facilitator_api1.gmail.com",
               PASSWORD : "5P5L3CQ7S324EKCQ",
               SIGNATURE : "AFcWxV21C7fd0v3bYYYRCpSSRl31A9XUTbqwt5YYc-fS4nEgEUPL-f.n"
          }
     },
     PORTRAIT_PATH : '/media/drivers/',
     VEHICLE_PATH : '/media/vehicles/',
     THUMBNAIL_PATH : '/media/vehicles/thumbnail/',
     EMAIL : "corsa@mobilyte.com",
     REGISTERATION_TEMPLATE : "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%\"><tbody><tr><td style=\"background-color:#fff\">&nbsp;<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:600px\"><tbody><tr><td style=\"background-color:#EBF8A4\"><table align=\"center\" border=\"0\" cellpadding=\"15\" cellspacing=\"0\" style=\"width:100%\"><tbody><tr><td>New Account</td></tr></tbody></table></td></tr><tr><td><table border=\"0\" cellpadding=\"10\" cellspacing=\"0\" style=\"width:100%\"><tbody><tr><td style=\"background-color:#fff\"><table border=\"0\" cellpadding=\"10\" cellspacing=\"0\" style=\"width:100%\"><tbody><tr><td><p>Dear&nbsp; {{USERNAME}},</p><p>Please confirm your registration here <a  target=_blank href='http://localhost:3000/#/auth/verifyEmail/token={{TOKEN}}/id={{ID}}'>Confirm your email</a></p></td></tr></tbody></table><table border=\"0\" cellpadding=\"10\" cellspacing=\"0\" style=\"width:100%\"><tbody><tr><td><pre>Thanks and Regards:<br><strong> Corsa Team </strong></pre><p></p></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td style=\"background-color:#EBF8A4\">&nbsp;</td></tr></tbody></table></td></tr></tbody></table>",
     SOCIAL_REGISTRATION_TEMPLATE : "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%\"><tbody><tr><td style=\"background-color:#fff\">&nbsp;<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:600px\"><tbody><tr><td style=\"background-color:#EBF8A4\"><table align=\"center\" border=\"0\" cellpadding=\"15\" cellspacing=\"0\" style=\"width:100%\"><tbody><tr><td>New Account</td></tr></tbody></table></td></tr><tr><td><table border=\"0\" cellpadding=\"10\" cellspacing=\"0\" style=\"width:100%\"><tbody><tr><td style=\"background-color:#fff\"><table border=\"0\" cellpadding=\"10\" cellspacing=\"0\" style=\"width:100%\"><tbody><tr><td><p>Dear&nbsp; {{USERNAME}},</p><p>Please enter {{PASSWORD}} as your first password to login</p></td></tr></tbody></table><table border=\"0\" cellpadding=\"10\" cellspacing=\"0\" style=\"width:100%\"><tbody><tr><td><pre>Thanks and Regards:<br><strong> Corsa Team </strong></pre><p></p></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td style=\"background-color:#EBF8A4\">&nbsp;</td></tr></tbody></table></td></tr></tbody></table>",
     VEHICLES_ARR : [
          {
               id:1,
               city : 'India',
               desc : 'Maruti 800',
               lat : 23.200000,
               long : 79.225487
          },
          {
               id:1,
               city : 'New Delhi',
               desc : 'Maruti 800!',
               lat : 28.500000,
               long : 77.250000
          },
          {
               id:1,
               city : 'Mumbai',
               desc : 'Maruti 800!',
               lat : 19.000000,
               long : 72.90000
          },
          {
               id:1,
               city : 'Kolkata',
               desc : 'Maruti 800',
               lat : 22.500000,
               long : 88.400000
          },
          {
               id:1,
               city : 'Chennai  ',
               desc : 'Maruti 800!',
               lat : 13.000000,
               long : 80.250000
          },
          {
               id:1,
               city : 'Kurukshetra University  ',
               desc : 'Maruti 800',
               lat : 29.9564963,
               long : 76.81731379999997
          },
          {
               id:1,
               city : 'India',
               desc : 'Maruti 800',
               lat : 23.200000,
               long : 79.225487
          },
          {
               id:1,
               city : 'New Delhi',
               desc : 'Maruti 800!',
               lat : 28.500000,
               long : 77.250000
          },
          {
               id:1,
               city : 'Mumbai',
               desc : 'Maruti 800!',
               lat : 19.000000,
               long : 72.90000
          },
          {
               id:1,
               city : 'Kolkata',
               desc : 'Maruti 800',
               lat : 22.500000,
               long : 88.400000
          },
          {
               id:1,
               city : 'Chennai  ',
               desc : 'Maruti 800!',
               lat : 13.000000,
               long : 80.250000
          },
          {
               id:1,
               city : 'Kurukshetra University  ',
               desc : 'Maruti 800',
               lat : 29.9564963,
               long : 76.81731379999997
          },
          {
               id:1,
               city : 'India',
               desc : 'Maruti 800',
               lat : 23.200000,
               long : 79.225487
          },
          {
               id:1,
               city : 'New Delhi',
               desc : 'Maruti 800!',
               lat : 28.500000,
               long : 77.250000
          },
          {
               id:1,
               city : 'Mumbai',
               desc : 'Maruti 800!',
               lat : 19.000000,
               long : 72.90000
          },
          {
               id:1,
               city : 'Kolkata',
               desc : 'Maruti 800',
               lat : 22.500000,
               long : 88.400000
          },
          {
               id:1,
               city : 'Chennai  ',
               desc : 'Maruti 800!',
               lat : 13.000000,
               long : 80.250000
          },
          {
               id:1,
               city : 'Kurukshetra University  ',
               desc : 'Maruti 800',
               lat : 29.9564963,
               long : 76.81731379999997
          },{
               id:1,
               city : 'India',
               desc : 'Maruti 800',
               lat : 23.200000,
               long : 79.225487
          },
          {
               id:1,
               city : 'New Delhi',
               desc : 'Maruti 800!',
               lat : 28.500000,
               long : 77.250000
          },
          {
               id:1,
               city : 'Mumbai',
               desc : 'Maruti 800!',
               lat : 19.000000,
               long : 72.90000
          },
          {
               id:1,
               city : 'Kolkata',
               desc : 'Maruti 800',
               lat : 22.500000,
               long : 88.400000
          },
          {
               id:1,
               city : 'Chennai  ',
               desc : 'Maruti 800!',
               lat : 13.000000,
               long : 80.250000
          },
          {
               id:1,
               city : 'Kurukshetra University  ',
               desc : 'Maruti 800',
               lat : 29.9564963,
               long : 76.81731379999997
          }
     ]
}

module.exports = globalConstants;
