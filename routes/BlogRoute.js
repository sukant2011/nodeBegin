module.exports = function(app, express) {
     let router = express.Router();
     let routeObj = require(APP_PATH + '/api/controllers/BlogController.js');
     let adminAuthorization = require(APP_PATH + "/api/middlewares/admin_TokenAuth.js");





      router.get('/list', routeObj.getBlogs);
      router.get('/view', routeObj.view);

     /** -----------Admin Api's --------------------*/
     router.post('/admin/add', adminAuthorization, routeObj.admin_add);
     router.post('/admin/update', adminAuthorization, routeObj.admin_update);
     router.get('/admin/list', adminAuthorization, routeObj.admin_list);
     router.get('/admin/view', adminAuthorization, routeObj.admin_view);
     router.post('/admin/remove', adminAuthorization, routeObj.admin_remove);

     app.use('/blog', router);
}
