var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
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

var res_headers = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
 
  next();
};

app.use( res_headers );
app.set('port', 3000);

var is_session_valid = function(cookies, callback){
	if ( "AuthToken" in cookies ) {
		pg.connect(connectionString, function(err, client, done) {
	    	client.query('select ( expires < now() ) as expired from tb_session where session_id_hash = $1', [cookies["AuthToken"]], function(err, result) {
	      		done();
	      			      			console.log( result.rows[0]);

	      		if ( result.rows[0] ){
	      			if( result.rows[0].expired ){
	      				return callback( false );
	      			} else {
	      				return callback( true );
	      			}
	      		}
	      		return callback( false );
		    });
		});
	} else {
		return callback( false );
	}
};

/**
*	Checks the authentication of all api calls.
**/
var require_authentication = function(req, res, next){
	var cookies = req.cookies;
	var requesting_url = req.url;

	var callback = function ( session_valid ){
		console.log("Session valid: " + session_valid);
		if ( ( requesting_url  == '/api/auth' || requesting_url == '/api/account/create' ) && session_valid ){
			return res.json({"message":"User authenticated!"});
		} else if ( requesting_url  != '/api/auth' && requesting_url != '/api/account/create' && !session_valid ){
			return res.status(401).json({"message":"authentication required"});
		} else {
			return next();
		}
	}

	return is_session_valid( cookies, callback );
};

app.all('/api/*', require_authentication );

//Routes
require("./auth/index")(app);
require("./account/index")(app);

//Create the server
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

app.use(function(req, res ){
     res.status(404).json({"message":"Not supported."});
});
