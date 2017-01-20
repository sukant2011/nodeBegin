    module.exports = function(app, express) {
                           var router = express.Router();
                            /* GET home page. */
                            router.get('/', function(req, res, next) {
                                res.render('index', { title: 'Corsa Application' });
                            });

                            app.use('/', router);
                    }
