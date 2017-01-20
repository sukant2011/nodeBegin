module.exports = function(app, express) {
     let router = express.Router();
     let routeObj = require(APP_PATH + '/api/controllers/CronController.js');
     let authorization = require(APP_PATH + "/api/middlewares/user_TokenAuth.js");
     let adminAuthorization = require(APP_PATH + "/api/middlewares/admin_TokenAuth.js");
     // const cron = require('node-cron');
     // cron.schedule('* * * * *', function(){
     //      console.log("===================");
     //      routeObj.changeVehicleListedStatus;
     // });
}
