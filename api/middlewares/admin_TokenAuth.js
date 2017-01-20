/*
* Author : Sunny Chauhan
* Module : AdminAuthToken
* Description : Use to authenticate admin User
*/
const jwToken = require(APP_PATH + "/api/services/JwTokenService.js");
const UserModel = require(APP_PATH + '/api/models/UserModel.js');

module.exports = function(req, res, next) {
     let token;
     if (req.headers && req.headers.authorization) {
          var parts = req.headers.authorization.split(' ');
          if (parts.length == 2) {
               var scheme = parts[0],
               credentials = parts[1];

               if (/^Bearer$/i.test(scheme)) {
                    token = credentials;
               }
          } else {
               return res.json(400, {err: '400 Bad Request'});
          }
     } else if (req.param('token')) {
          token = req.param('token');
          //token = req.param('token');
          // We delete the token from param to not mess with blueprints
          delete req.query.token;
     } else {
          return res.json(403, {err:'ACCESS DENIED !! You are not authorize to access this Resource'});
          //return res.json(401, {err: 'ACCESS DENIED !! You are not authorize to access this Resource'});
          //return res.status(401, {err: 'No Authorization header was found'});
     }

     jwToken.verify(token, function(err, token) {
          //if err return res.json(401, {err: 'ACCESS DENIED !! You are not authorize to access this Resource'});
          if (err) return res.json(401, {err: 'The token is not valid'});
          UserModel.findOne({_id : token.auth}, {_id : 1, name : 1}, function (err, resData) {
               if(resData) {
                    req.token = token;
                    next();
               } else {
                    return res.json(403, {err:'Your session has been expired, please login.'});
               }
          });
     });
};
