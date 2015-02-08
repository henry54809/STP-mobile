var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var multer = require('multer');
var pg = require('pg');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

//Connection string for postgres
global.connectionString = "pg://webuser:8rucShn3t3pew4db@10.0.1.126/stp?ssl=true";

//Constants
global.OK = "OK";
global.ERROR = "Error";

//COR settings
var res_headers = function (req, res, next) {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};

var whitelist = ['http://localhost:8100', 'http://m.picwo.com'];
var cors_options = {
  origin: function (origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }
};

//Util functions
require('./util/functions');

//Server settings
app.use(res_headers);
app.all('/api/*', cors(cors_options));
app.set('port', 3000);

require("./auth/index")(app);

var auth_functions = require('./auth/functions');
app.all('/api/*', auth_functions.require_authentication);

//Routes
require("./account/index")(app);
require("./user/index")(app);
require("./user/friend_actions")(app);
require("./trip/index")(app);
require("./location/index")(app);

//Create the server
var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + server.address().port);
});

app.use(function (req, res) {
  var resp = {};
  resp.status = ERROR;
  resp.message = "Not Supported.";
  res.status(404).json({
    "message": "Not supported."
  });
});
