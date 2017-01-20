/*
* Author : Sunny Chauhan
* Module : UserAuthToken
* Description : Use to authenticate User
*/
const UserModel = require(APP_PATH + '/api/models/UserModel.js');
let jwToken = require(APP_PATH + "/api/services/JwTokenService.js");
module.exports = function(req, res, next) {
     let token;
     if (req.headers && req.headers.authorization) {
          let parts = req.headers.authorization.split(' ');

          if (parts.length == 2) {
               var scheme = parts[0],
               credentials = parts[1];
               if (/^BearerS$/i.test(scheme)) {
                    token = credentials;
               }
          } else {
               return res.status(401).json({resStatus : "error", msg: '400 Bad Request",'});
               //res.status(403).send({err: 'ACCESS DENIED !! You are not authorize to access this Resource'});
          }
     } else if (req.param('token')) {
          token = req.param('token');
          //token = req.param('token');
          // We delete the token from param to not mess with blueprints
          delete req.query.token;
     } else {
          //return res.json('ACCESS DENIED !! You are not authorize to access this Resource');
          return res.status(401).json({resStatus : "error", msg: 'ACCESS DENIED !! You are not authorize to access this Resource'});
          //res.status(401).send({err: 'ACCESS DENIED !! You are not authorize to access this Resource'});
          //return res.json(401, {err: 'No Authorization header was found'});
     }

     jwToken.verify(token, function(err, token) {
          //if (err) return res.status(401).json({resStatus : "error", msg: 'The token is not valid'});
          if(token && token.auth) {
               UserModel.findOne({_id : token.auth}, {_id : 1, name : 1}, function (err, resData) {
                    if(resData) {
                         req.token = token;
                         next();
                    } else {
                         return res.status(403).json({resStatus : "error", msg:'Your session has been expired, please login.'});
                    }
               });
          } else {
               return res.status(401).json({resStatus : "error", msg: '400 Bad Request",'});
          }

     });
};
