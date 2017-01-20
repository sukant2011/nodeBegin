module.exports = function(app, express) {
      let router = express.Router();
      let routeObj = require(APP_PATH + '/api/controllers/AuthController.js');

      router.post('/register', routeObj.register);
      router.post('/confirmAccount', routeObj.confirmOtp);
      router.get('/varifyEmail', routeObj.varifyEmail);
      router.post('/confirmAccountForgot', routeObj.confirmOtpForgot);
      router.post('/reSendOtp', routeObj.reSendOtp);
      router.post('/login', routeObj.login);
      router.get('/logOut', routeObj.logOut);
      router.post('/forgot-password', routeObj.forgot);
      router.post('/resetPassword', routeObj.resetPassword);
      router.get('/checkUniqueEmail', routeObj.checkUniqueEmail);
      router.get('/checkUniqueMobile', routeObj.checkUniqueMobile);

     router.post('/admin/login/', routeObj.admin_login);

      app.use('/auth', router);
}
