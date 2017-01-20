module.exports = function(app, express) {
     let router = express.Router();
     let routeObj = require(APP_PATH + '/api/controllers/InfractionController.js');
     let authorization = require(APP_PATH + "/api/middlewares/user_TokenAuth.js");
     let adminAuthorization = require(APP_PATH + "/api/middlewares/admin_TokenAuth.js");

     router.post('/report', authorization, routeObj.add);

     router.get('/admin/list', adminAuthorization, routeObj.admin_list);

     app.use('/infraction', router);
}
