/*
    Author:       Sunny Chauhn
    Description : The file will take care of the database connectivity
*/
const ENV_OBJ = require(APP_PATH + '/config/Env.js')();
// Requiring Mongoose into the app
var mongoose = require( 'mongoose' );

// Build the connection string

// Connected to localhost server
 //var dbURI = 'mongodb://localhost/corsa';

// Connected to Mongolab sandbox server
var dbURI = ENV_OBJ.MONGODB.URI;
//var dbURI = 'mongodb://mobilyte:mobilyte@ds019966.mlab.com:19966/mobilyte';
//var dbURI = 'mongodb://10.11.11.10/corsa';

//Create the database connection
mongoose.Promise = global.Promise;
mongoose.connect(dbURI);

// CONNECTION EVENTS

// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
