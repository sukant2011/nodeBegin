const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require("fs");

global.APP_PATH = path.resolve(__dirname);
// requiring database file
const db = require(APP_PATH + '/config/Db');

//var models = require(APP_PATH + '/config/Bootstrap');

var app = express();

//process.env['NODE_ENV'] = process.env['NODE_ENV'] || 'local';

var io = require('socket.io')();
app.io = io;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', function (path, opt, fn) {
     fs.readFile(path, 'utf-8', function(err, str) {
          if(err) return str;
          return fn (null, str);
     })
});

app.get('/', function(req, res, next) {
     res.render("front_layout.html");
});

app.get('/admin', function(req, res, next) {
     res.render("admin_layout.html");
});

io.sockets.on("connection", function( socket ) {
     global.socketUsers = global.socketUsers || [];

     // Register your client with the server, providing your username
     socket.on('init', function(data) {
          console.log("OHh, I am registered on Sockets");
          socketUsers.push({ id : socket.id, user_name : data.userId});
     });

     socket.on('disconnect', function(){
          console.log('user disconnected');
          for(var i=0;i<socketUsers.length;i++){
               if(socketUsers[i].id == socket.id){
                    socketUsers.splice(i,1); //Removing single user
               }
          }
     });

});

// Requiring Routes into the application
require(APP_PATH + '/routes/index')(app, express);
require(APP_PATH + '/routes/AuthRoute')(app, express);
require(APP_PATH + '/routes/ProfileRoute')(app, express);
require(APP_PATH + '/routes/VehicleRoute')(app, express);
require(APP_PATH + '/routes/SocialRoute')(app, express);
require(APP_PATH + '/routes/TemplateRoute')(app, express);
require(APP_PATH + '/routes/BlogRoute')(app, express);
require(APP_PATH + '/routes/InfractionRoute')(app, express);
require(APP_PATH + '/routes/PaymentRoute')(app, express);
require(APP_PATH + '/routes/ConfigRoute')(app, express);
require(APP_PATH + '/routes/ChatRoute')(app, express, io);
require(APP_PATH + '/routes/NewsLetterRoute')(app, express);
require(APP_PATH + '/routes/CronRoute')(app, express);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
     //res.io = io;
     var err = new Error('Not Found');
     err.status = 404;
     next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
     app.use(function(err, req, res, next) {
          res.status(err.status || 500);
          res.render('error', {
               message: err.message,
               error: err
          });
     });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
     res.status(err.status || 500);
     res.render('error', {
          message: err.message,
          error: {}
     });
});

process.on('uncaughtException', function( err ) {
     console.error(err.stack);
});

//module.exports = app;
module.exports = app;
