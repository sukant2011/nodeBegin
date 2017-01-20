/*
* Author : Sunny Chauhan
* Module : ConfigController
* Description : Use to set & get configuration settings
*/
const AppMessages = require(APP_PATH + '/config/Message.js');
const AppConstants = require(APP_PATH + '/config/Constant.js');
const ConfigModel = require(APP_PATH + '/api/models/ConfigModel.js');

class ConfigController  {

     /**--------------------------------------------------------------------------
     Function    : admin_add
     Description : Add configuration Settings
     --------------------------------------------------------------------------*/
     admin_add (req, res) {

          ConfigModel(req.body).save(function(err,resData){
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg : "Successfull Saved", result: resData});
          });

     }

     /**--------------------------------------------------------------------------
     Function    : admin_update
     Description : Update configuration Settings
     --------------------------------------------------------------------------*/
     admin_update (req, res) {
          ConfigModel.findOneAndUpdate({"_id" : req.body._id}, req.body, {upsert:false, new:true},function (err, resData) {
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg :'Update Successfull',result: resData});
          });
     }

     /**--------------------------------------------------------------------------
     Function    : admin_list
     Description : list configuration Settings
     --------------------------------------------------------------------------*/
     admin_list (req, res) {
          ConfigModel.findOne({isDeleted : false},function(err, resData){
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               if (resData) {
                    return res.json({resStatus:'success', msg :'Config List', result : resData});
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }
          });
     }
}

module.exports = new ConfigController();
