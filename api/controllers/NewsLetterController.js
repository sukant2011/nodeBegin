/*
* Author : Sunny Chauhan
* Module : NewsLetterController
* Description : Use to login the user with social media
*/
const AppMessages = require(APP_PATH + '/config/Message.js');
const AppConstants = require(APP_PATH + '/config/Constant.js');
const NewsLetterModel = require(APP_PATH + '/api/models/NewsLetterModel.js');

class NewsLetterController  {

     subscribe (req, res) {

          NewsLetterModel(req.body).save(function(err,resData){
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg : "Request has been submitted"});
          });

     }

     admin_list (req, res) {
          NewsLetterModel.find({status : true, isDeleted : false},function(err, resData){
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               if (resData) {
                    return res.json({resStatus:'success', msg :'NewsLetter List', result : resData});
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }
          });
     }
}

module.exports = new NewsLetterController();
