var pg = require('pg');

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
					req.entity = result.rows[0];
					req.email_address = email_address;
					req.reset_password = true;
					return next();
				}
			});
		});
	});

	router.put('/', function (req, res, next) {
		if (!req.entity || !req.reset_password || !req.email_address) {
			return next();
		}

		//Insert reset_password_id, original_password.
		var data = {};
		var date = new Date();
		data.to = req.email_address;
		data.subject = 'STP Password Reset Request';
		data.html = '<p> \
						<span style="font-family: arial, helvetica, sans-serif; font-size: small;"> \
							Hello,	\
						</span>				\
						<br /><br />		\
						<span style="font-family: arial, helvetica, sans-serif; font-size: small;">	\
							We received a request to reset your password. Please use this link	\
							<a href="http://m.picwo.com/account/ResetPassword?">http://m.picwo.com/account/ResetPassword?</a> \
							< /span> \
						< br / > \
					< /p>';
		var callback = function (err, info) {
			if (err) {
				console.log(err);
			} else {
				console.log("Mail sent.");
			}
		};
		util.sendmail(data, callback);

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
	app.use('/api/account', router);
};