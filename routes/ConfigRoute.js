module.exports = function(app, express) {
     let router = express.Router();
     let routeObj = require(APP_PATH + '/api/controllers/ConfigController.js');
     let adminAuthorization = require(APP_PATH + "/api/middlewares/admin_TokenAuth.js");

     /** -----------Admin Api's --------------------*/
     router.post('/admin/add', adminAuthorization, routeObj.admin_add);
     router.post('/admin/update', adminAuthorization, routeObj.admin_update);
     router.get('/admin/list', adminAuthorization, routeObj.admin_list);

     app.use('/config', router);
}
