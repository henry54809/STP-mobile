var pg = require('pg');

module.exports = function ( app ) {
	var express = require('express');
	var router = express.Router();
	 
	router.post('/auth', function(req, res, next) {
	  var resp = {};
	  var msg = req.body;
	 
	  if ( !msg || !msg.username || !msg.password ) {
	    resp.status = ERROR;
	    resp.message = "Missing username or password.";
	    res.json(resp);
	    return;
	  }
	  var pk_entity;
  		pg.connect(connectionString, function(err, client, done) {
	    	client.query('select entity from tb_entity where ( username = $1 or email_address = $1 ) and password_hash = crypt( $2, password_hash ) ', [msg.username, msg.password], function(err, result) {
	      		done();
	      		if ( result.rows[0] ){
	      			if ( result.rows[0].entity ){
	      				pk_entity = result.rows[0].entity;
	      			}
	      		}

  			    if ( !pk_entity ){
			   	    resp.status = ERROR;
			   		resp.message = "Login credentials invalid."; 
			   		res.json(resp);
			   		return;
			    }

		pg.connect(connectionString, function(err, client, done) {
	  			var query = 'insert into tb_session (                   							\
	  				                                   entity,          							\
	  				                                   session_id_hash  							\
	  				                                )(                  							\
	  				                                  select  entity,    							\
	  				                                          md5(random()::text || entity::text)	\
	  				                                    from  tb_entity								\
	  				                                   where  entity = $1 							\
	  				                                 )                  							\
	  			          returning session_id_hash as session_id';
		    	client.query( query, [pk_entity], function(err, result) {
		      		done();
		      		var session_id = result.rows[0].session_id;
		      		if ( session_id ){
		      			res.cookie('AuthToken', session_id, {maxAge: 60*24*60});
		      			resp.status = OK;
		      			resp.message = "User authenticated.";
		      			res.json(resp);
		      		} else {
		      			resp.status = ERROR;
		      			resp.message = "Error when establishing a session.";
		      			return res.status(500).json(resp);
		      		}
		    	});
		    });
	    	});
	    });
	});
	
	app.use('/api', router );
}
