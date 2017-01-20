module.exports = function(app, express) {
     let router = express.Router();
     let routeObj = require(APP_PATH + '/api/controllers/ProfileController.js');
     let authorization = require(APP_PATH + "/api/middlewares/user_TokenAuth.js");
     let adminAuthorization = require(APP_PATH + "/api/middlewares/admin_TokenAuth.js");

     /** -----------Front Api's --------------------*/
     router.get('/view', authorization, routeObj.view);
     router.get('/referralInfo', authorization, routeObj.referralView);
     router.post('/update', authorization, routeObj.update);
     router.post('/updateAccount', routeObj.updateAccount);
     router.post('/uploadLicense', authorization, routeObj.uploadLicense);
     router.post('/updatePassword', authorization, routeObj.changePassword);
     router.post('/sendVerificationCode', authorization, routeObj.sendVerificationCode);
     router.post('/confirmOtp', authorization, routeObj.confirmOtp);
     router.post('/sendReferrals', authorization, routeObj.sendReferrals);
     router.post('/refreshDeviceToken', authorization, routeObj.refreshMobileDeviceToken);

     /** -----------Admin Api's --------------------*/
     router.get('/admin/list', adminAuthorization, routeObj.admin_list);
     router.get('/admin/view', adminAuthorization, routeObj.admin_view);
     router.get('/admin/updatePassword', adminAuthorization, routeObj.admin_changePassword);
     router.post('/admin/update', adminAuthorization, routeObj.admin_update);
     router.post('/admin/remove', adminAuthorization, routeObj.admin_removeUser);
     router.get('/admin/count', adminAuthorization, routeObj.admin_userCount);
     router.get('/admin/status', adminAuthorization, routeObj.admin_status);
     router.get('/admin/verifyDL', adminAuthorization, routeObj.admin_verifyLicense);

     app.use('/account', router);
}
