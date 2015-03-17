var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var multer = require('multer');
var pg = require('pg');
var app = express();

app.use(logger('[:date[clf]] :method :url :status :response-time ms - :res[content-length]'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(multer({
  dest: '../www/uploads/',
  rename: function (fieldname, filename) {
    return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
  }
}));

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
var util = require('./util/functions');

//Server settings
app.use(res_headers);
app.all('/api/*', cors(cors_options));
app.set('port', 3000);

require("./auth/index")(app);

var auth_functions = require('./auth/functions');
app.all('/api/*', auth_functions.require_authentication);

//Routes
require("./account/index")(app);
require("./account/reset_password")(app);
require("./user/index")(app);
require("./user/friend_actions")(app);
require("./trip/index")(app);
require("./trip/details")(app);
require("./location/index")(app);
require("./upload/index")(app);
require("./upload/trip")(app);
require("./itinerary/index")(app);

//Create the server
var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + server.address().port);
});

app.use(function (req, res) {
  var resp = {};
  resp.status = ERROR;
  resp.message = "Not Supported.";
  res.status(404).json(resp);
});


//Catch all uncaught exceptions signals.
process.on('uncaughtException', function (err) {
  console.log('Got exceptions.  Sending email.');
  var data = {};
  var date = new Date();
  data.to = 'henry54809@gmail.com';
  data.subject = 'Node.js terminated at ' + date.toString();
  data.html = '<b>' + err + '</b>';
  var callback = function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Mail sent.");
    }
    process.exit(1);
  };
  util.sendmail(data, callback);
});