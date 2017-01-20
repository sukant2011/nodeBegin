module.exports = function(app, express) {
     let router = express.Router();
     let routeObj = require(APP_PATH + '/api/controllers/VehicleController.js');
     let authorization = require(APP_PATH + "/api/middlewares/user_TokenAuth.js");
     let adminAuthorization = require(APP_PATH + "/api/middlewares/admin_TokenAuth.js");

     /** -----------Front Api's --------------------*/
     router.get('/list', routeObj.getVehicles);
     router.get('/view', routeObj.view);
     router.get('/myVehicles', routeObj.myCars);
     router.get('/removePhoto', authorization, routeObj.removePhoto);
     router.get('/delete', authorization, routeObj.delete);
     router.post('/upload', authorization, routeObj.upload);
     router.post('/add',  authorization, routeObj.add);
     router.post('/update', authorization, routeObj.update);
     router.get('/favourites', authorization, routeObj.favouritesCar);
     router.get('/addToFavourites', authorization, routeObj.addToFavourites);
     router.get('/checkFavourite', authorization, routeObj.checkFavourite);
     router.get('/brands', routeObj.listBrand);
     router.get('/models', routeObj.listModels);
     router.get('/modelYears', routeObj.listModelYears);
     router.get('/airports', authorization, routeObj.listAirports);
     router.get('/listCountry', authorization, routeObj.listCountry);
     router.get('/listStates', authorization, routeObj.listStates);
     router.get('/checkAvailabilty', authorization, routeObj.checkAvailabilty);
     router.get('/cities', authorization, routeObj.getCities);
     router.post('/review', authorization, routeObj.add_review);
     // router.get('/country', authorization, routeObj.listCountry);
     // router.post('/states', authorization, routeObj.listStates);

     /** -----------Admin Api's --------------------*/
     router.get('/admin/count', adminAuthorization, routeObj.admin_vehicleCount);
     router.get('/admin/userCarlist', adminAuthorization, routeObj.admin_userCarlist);
     router.get('/admin/info', adminAuthorization, routeObj.admin_vehicleInfo);
     router.get('/admin/status', adminAuthorization, routeObj.admin_status);

     router.post('/admin/addBrand', adminAuthorization, routeObj.admin_addBrand);
     router.post('/admin/updateBrand', adminAuthorization, routeObj.admin_updateBrand);
     router.get('/admin/listBrand', adminAuthorization, routeObj.admin_listBrand);
     router.get('/admin/viewBrand', adminAuthorization, routeObj.admin_viewBrand);
     router.post('/admin/removeBrand', adminAuthorization, routeObj.admin_removeBrand);
     router.get('/admin/brands', adminAuthorization, routeObj.admin_listBrand);
     router.get('/admin/brandStatus', adminAuthorization, routeObj.admin_brandStatus);

     router.post('/admin/addVariant', adminAuthorization, routeObj.admin_addVariant);
     router.post('/admin/updateVariant', adminAuthorization, routeObj.admin_updateVariant);
     router.get('/admin/listVariant', adminAuthorization, routeObj.admin_listVariant);
     router.get('/admin/viewVariant', adminAuthorization, routeObj.admin_viewVariant);
     router.post('/admin/removeVariant', adminAuthorization, routeObj.admin_removeVariant);


     router.post('/admin/addCountry', adminAuthorization, routeObj.admin_addCountry);
     router.get('/admin/listCountry', adminAuthorization, routeObj.admin_listCountry);
     router.post('/admin/removeCountry', adminAuthorization, routeObj.admin_removeCountry);
     router.get('/admin/viewCountry', adminAuthorization, routeObj.admin_viewCountry);
     router.post('/admin/updateCountry', adminAuthorization, routeObj.admin_updateCountry);

     router.post('/admin/addCountryName', adminAuthorization, routeObj.admin_addCountryName);
     router.post('/admin/updateCountryName', adminAuthorization, routeObj.admin_updateCountryName);
     router.get('/admin/listCountryName', adminAuthorization, routeObj.admin_listCountryName);
     router.get('/admin/viewCountryName', adminAuthorization, routeObj.admin_viewCountryName);
     router.post('/admin/removeCountryName', adminAuthorization, routeObj.admin_removeCountryName);


     router.post('/admin/addAirport', adminAuthorization, routeObj.admin_addAirport);
      router.post('/admin/updateAirport', adminAuthorization, routeObj.admin_updateAirport);
     router.get('/admin/listAirport', adminAuthorization, routeObj.admin_listAirport);
      router.get('/admin/viewAirport', adminAuthorization, routeObj.admin_viewAirport);
      router.post('/admin/removeAirport', adminAuthorization, routeObj.admin_removeAirport);


     app.use('/vehicles', router);
}
