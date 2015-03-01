var pg = require('pg');
var util = require('../util/functions');
var querystring = require('querystring');

module.exports = function (app) {
	var express = require('express');
	var router = express.Router();

	//Checks the validity of the email address
	router.put('/', function (req, res, next) {
		var resp = {};
		var url_query = req.query;

		if (!url_query.reset_password) {
			return next();
		}
		var email_address = url_query.reset_password;
		var query = "select entity from tb_entity where email_address = $1";
		pg.connect(connectionString, function (err, client, done) {
			client.query(query, [email_address], function (err, result) {
				done();
				if (!result || !result.rows[0]) {
					if (err) {
						console.log(err);
					}
					resp.status = ERROR;
					resp.message = "Email address not found.";
					return res.status(400).json(resp);
				} else {
					req.entity = result.rows[0].entity;
					req.email_address = email_address;
					req.reset_password = true;
					return next();
				}
			});
		});
	});

	//Update password
	router.put('/', function (req, res, next) {
		var resp = {};
		var msg = req.body;
		var cookies = req.cookies;
		if (!msg || !msg.current_password || !msg.new_password) {
			return next();
		}

		var callback = function (session_valid) {
			if (!session_valid) {
				resp.status = ERROR;
				resp.message = "Authentication required.";
				return res.status(401).json(resp);
			}
			var query = "update tb_entity \
			                set password_hash = crypt( $1, gen_salt('bf') )\
			              where password_hash = crypt( $2, password_hash ) \
			                and entity = ( select entity \
			                				 from tb_session \
			                				where session_id_hash = $3 )";
			pg.connect(connectionString, function (err, client, done) {
				client.query(query, [msg.new_password,
					msg.current_password,
					cookies["AuthToken"]
				], function (err, result) {
					done();
					if (result && result.rowCount > 0) {
						resp.status = OK;
						resp.message = "Password updated.";
						return res.json(resp);
					} else {
						if (err) {
							console.log(err);
						}
						resp.status = ERROR;
						resp.message = "Password not updated. Current password is not correct.";
						return res.status(400).json(resp);
					}
				});
			});
		};

		//Check authentication
		var auth_functions = require('../auth/functions');
		auth_functions.is_session_valid(req.cookies, callback);
	});

	//Reset password request
	router.put('/', function (req, res, next) {
		var resp = {};
		if (!req.entity) {
			return next();
		}

		var send_reset_password_mail = function (token) {
			//Insert reset_password_id, original_password.
			var reset_data = {};
			reset_data.token = token;
			reset_data.email_address = req.email_address;
			var data = {};
			var date = new Date();
			data.to = req.email_address;
			data.subject = 'STP Password Reset Request';
			data.html = '<p> 																									\
						<span style="font-family: arial, helvetica, sans-serif; font-size: small;"> 							\
							Hello,																								\
						</span>																									\
						<br /><br />																							\
						<span style="font-family: arial, helvetica, sans-serif; font-size: small;">								\
							We received a request to reset your password. Please use this link									\
							<a href="http://m.picwo.com/account/ResetPassword?' + querystring.stringify(reset_data) +
				'">http://m.picwo.com/account/ResetPassword</a> 																	\
							to enter your new password.																			\
						< /span> 																								\
						< br / > 																								\
					< /p>';

			var mail_callback = function (err, info) {
				if (err) {
					console.log(err);
					resp.status = ERROR;
					resp.message = "Could not reset password.";
					return res.status(500).json(resp);
				} else {
					console.log("Reset E-mail for entity: " + req.entity + "");
					resp.status = OK;
					resp.message = "Reset e-mail sent.";
					return res.json(resp);
				}
			};
			util.sendmail(data, mail_callback);
		};

		//Create token and send mail 
		var callback = function () {
			var query = "insert into tb_reset_password (entity) 	\
			             values ($1) 								\
			          returning token";
			pg.connect(connectionString, function (err, client, done) {
				client.query(query, [req.entity], function (err, result) {
					done();
					if (result && result.rowCount > 0) {
						send_reset_password_mail(result.rows[0].token);
					} else {
						if (err) {
							console.log(err);
						}
						resp.status = ERROR;
						resp.message = "Could not reset password.";
						return res.status(500).json(resp);
					}
				});
			});
		};

		//Check that user does not have any pending reset password token. 
		var query = "select reset_password, token \
				       from tb_reset_password     \
				      where entity = $1    		  \
				        and valid_until > now()   \
				        and consumed is null";

		pg.connect(connectionString, function (err, client, done) {
			client.query(query, [req.entity], function (err, result) {
				done();
				if (result) {
					if (result.rowCount === 0) {
						callback();
					} else {
						var token = result.rows[0].token;
						send_reset_password_mail(token);
					}
				} else {
					if (err) {
						console.log(err);
					}
					resp.status = ERROR;
					resp.message = "Could not reset password.";
					return res.status(500).json(resp);
				}
			});
		});

	});

	//verify validity of reset password token
	router.get('/reset_password', function (req, res, next) {
		var resp = {};
		var url_query = req.query;
		if (!url_query.email_address || !url_query.token) {
			return next();
		}
		var email_address = url_query.email_address;
		var token = url_query.token;

		var query = "select valid_until > now() as valid 	\
		 			   from tb_reset_password as r			\
		 			   join tb_entity as e                  \
		 			     on e.entity = r.entity     		\
		 			  where token = $1  				 	\
		 			    and e.email_address = $2";

		pg.connect(connectionString, function (err, client, done) {
			client.query(query, [token, email_address], function (err, result) {
				done();
				if (result) {
					if (result.rows[0] && result.rows[0].valid) {
						resp.valid = true;
					} else {
						resp.valid = false;
					}
					return res.json(resp);
				}
				if (err) {
					console.log(err);
				}
				resp.status = ERROR;
				resp.message = "Could not check reset password token validity.";
				return res.status(500).json(resp);
			});
		});
	});

	//Reset password
	router.put('/reset_password', function (req, res, next) {
		var resp = {};
		var msg = req.body;
		if (!msg || !msg.email_address || !msg.token || !msg.new_password) {
			return next();
		}
		var email_address = msg.email_address;
		var token = msg.token;
		var new_password = msg.new_password;

		var query = "update tb_entity e										\
		 			    set password_hash = crypt($1, gen_salt('bf'))		\
		 			   from tb_reset_password r                  			\
		 			  where r.token = $2  				 					\
		 			    and e.email_address = $3                            \
                        and r.consumed is null                              \
                        and r.valid_until > now()";

		pg.connect(connectionString, function (err, client, done) {
			client.query(query, [new_password, token, email_address], function (err, result) {
				done();
				if (result) {
					if (result.rowCount > 0) {
						resp.status = OK;
						resp.message = 'Password updated.';
						return res.json(resp);
					} else {
						resp.status = ERROR;
						resp.message = 'Reset password token not valid.';
						return res.json(resp);
					}
				} else {
					if (err) {
						console.log(err);
					}
					resp.status = ERROR;
					resp.message = "Could not reset password.";
					return res.status(500).json(resp);
				}
			});
		});
	});

	app.use('/api/account', router);
};
