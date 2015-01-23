var pg = require('pg');

module.exports = function ( app ) {
	var express = require('express');
	var router = express.Router();
	
	router.get('/', function(req, res){
		var cookies = req.cookies;
		var query = 'select e.username, \
							e.email_address,\
							ee.address_line_one,\
							ee.address_line_two,\
							ee.profession, \
							ee.age, \
							ee.description, \
							ee.first_name, \
							ee.last_name, \
							ee.city, \
							avatar_url \
				       from tb_entity e \
				       join tb_session s \
				         on s.entity = e.entity \
				  left join tb_entity_extra_info ee \
				         on ee.entity_extra_info = e.entity_extra_info \
				      where s.session_id_hash = $1';
		pg.connect(connectionString, function(err, client, done) {
	    	client.query( query, [cookies["AuthToken"]], function(err, result) {
	      		done();
	      		if ( result.rows[0] ){
	      			return res.json(result.rows[0]);
	      		} else {
					return res.status(401).json({"message":"authentication required"});
	      		}
	      	});
		});
	});

	router.post('/create', function(req, res, next) {
	  var resp = {};
	  var msg = req.body;
	 
	  if ( !msg || !msg.username || !msg.password || !msg.email_address ) {
	    resp.status = "Error";
	    resp.message = "Missing username or password.";
	    return res.json(resp);
	  }
	  var username = msg.username;
	  var password = msg.password;
	  var email_address = msg.email_address;
	  var entity_type = msg.entity_type;
	  var address_line_one = msg.address_line_one;
	  var address_line_two = msg.address_line_two;
	  var profession = msg.profession;
	  var age = msg.age;
	  var description = msg.description;
	  var first_name = msg.first_name;
	  var last_name = msg.last_name;
	  var city = msg.city;
	  var avatar_url = msg.avatar_url;

		var query = 'select fn_new_entity(\
											$1,
											$2,
											crypt( $3, gen_salt(\'bf\') ) \
											null, \
											$3,   \
											$4,   \
											fn_new_entity_extra_info(      \
																		$5,
																		$6,
																		$7,
																		$8,
																			
																	)  \
											'
		pg.connect(connectionString, function(err, client, done) {
		    	client.query( query, [cookies["AuthToken"]], function(err, result) {
		      		done();
		      		if ( result.rows[0] ){
		      			return res.json(result.rows[0]);
		      		} else {
						return res.status(401).json({"message":"authentication required"});
		      		}
		      	});
			});
		});
	
	app.use('/api/account', router );
}