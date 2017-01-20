/*
* Author : Sunny Chauhan
* Module : ConfigController
* Description : Use to set & get configuration settings
*/
const AppMessages = require(APP_PATH + '/config/Message.js');
const AppConstants = require(APP_PATH + '/config/Constant.js');
const VehicleModel = require(APP_PATH + '/api/models/VehicleModel.js');

class CronController  {

     /**--------------------------------------------------------------------------
     Function    : changeVehicleListedStatus
     Description : Use to change listed status of vehicle
     --------------------------------------------------------------------------*/
     changeVehicleListedStatus () {
          VehicleModel
               .find({
                         listingStatus : 'SNOOZED',
                         snozzedDate : {
                                        $gt : new Date()
                         }
                    },
                    {
                         listingStatus : 'LISTED',
                    }
               )
               .exec(
                    function(err,resData){
                         if (err) console.log("Some Error Occured");
                         return console.log("Successfull");
                    }
               );
     }
}
     module.exports = new CronController();
