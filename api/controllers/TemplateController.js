/*
* Author : Sunny Chauhan
* Module : AuthsController
* Description : Use to login the user with social media
*/
const AppMessages = require(APP_PATH + '/config/Message.js');
const AppConstants = require(APP_PATH + '/config/Constant.js');
const TemplateModel = require(APP_PATH + '/api/models/TemplateModel.js');

class TemplateController  {

     admin_add (req, res) {

          TemplateModel(req.body).save(function(err,resData){
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg :AppMessages.LOGIN, result: resData});
          });

     }

     admin_update (req, res) {
          TemplateModel.findOneAndUpdate({"_id" : req.body._id}, req.body, {upsert:false, new:true},function (err, resData) {
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg :'Update Successfll',result: resData});
          });
     }

     admin_view (req, res) {
          TemplateModel.findOne({_id:req.query.reqId}, function ( err, resData) {
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg :"Template View", result : resData});
          });
     }

     admin_list (req, res) {
          TemplateModel.find({isDeleted : false},function(err, resData){
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               if (resData) {
                    return res.json({resStatus:'success', msg :'Template List', result : resData});
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }
          });
     }

     admin_remove (req, res) {
          TemplateModel.findOneAndUpdate({_id:req.query.reqId},{'isDeleted':true}, {new:true},function(err, resData){
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               if (resData) {
                    return res.json({resStatus:'success', msg :'Template has been removed Successfully'});
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }
          });
     }
}

module.exports = new TemplateController();
