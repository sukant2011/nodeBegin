/*
* Author : Sunny Chauhan
* Module : InfractionController
* Description : Use to report User or listing if
*/
const AppMessages = require(APP_PATH + '/config/Message.js');
const InfractionModel = require(APP_PATH + '/api/models/InfractionModel.js');

class InfractionController  {

     /**--------------------------------------------------------------------------
     Function    : add
     Description : use to report a listing
     --------------------------------------------------------------------------*/
     add (req, res) {

          InfractionModel(req.body).save (function (err, resData) {
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg :AppMessages.INFRACTION_ADD});
          });
     }

     /**--------------------------------------------------------------------------
     Function    : list
     Description : list infractions
     --------------------------------------------------------------------------*/
     admin_list (req, res) {
          InfractionModel.find({}).populate({path:'userId', select: 'name profile email'}).exec(function(err, resData){
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg :'Infractions', result : resData});
          });
     }

}

module.exports = new InfractionController();
