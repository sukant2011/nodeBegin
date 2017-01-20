module.exports = function(app, express) {
     let router = express.Router();
     let routeObj = require(APP_PATH + '/api/controllers/SocialController.js');
     let authorization = require(APP_PATH + "/api/middlewares/user_TokenAuth.js");
     router.post('/google', routeObj.google);
     router.post('/facebook', routeObj.facebook);
     router.post('/googleLogin', routeObj.googleMobileLogin);
     router.post('/facebookLogin', routeObj.facebookMobileLogin);
     router.get('/unlink/:userId/:type', authorization, routeObj.unlinkSocialAccount);
     router.post('/linkSocialAccount', authorization, routeObj.linkSocialAccount);
     app.use('/auth', router);
}
