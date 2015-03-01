var pg = require('pg');
var aws = require('../util/aws');

module.exports = function (app) {
	var express = require('express');
	var router = express.Router();

	router.post('/trip', function (req, res) {
		var resp = {};
		var msg = req.body;
		var cookies = req.cookies;
		if (!msg || !msg.trip || !msg.files) {
			resp.status = ERROR;
			resp.message = "Missing trip id or files to upload.";
			return res.json(resp);
		}
		var trip_name = msg.name;
		if (!trip_name) {
			trip_name = "Untitled";
		}

		var urls = [];

		var get_url_callback = function (name, url) {
			urls.push({
				name: url
			});
			console.log(urls);
			if (urls.length === msg.files.length) {
				resp.status = OK;
				resp.urls = urls;
				return res.json(resp);
			}
		};

		pg.connect(connectionString, function (err, client, done) {
			var query = "insert into tb_file (									\
													file_type,					\
													path,						\
													name,						\
													creator						\
												  ) 							\
		 					                      (								\
		 					                      	select fn_get_or_create_file_type(tt.type, null),			\
		 					                      		   regexp_replace( random()::text, '^0.', '' ) 	\
		 					                      		   || fn_random_text_md5(20)					\
		 					                      		   || regexp_replace( tt.name, '\S*\.', '.' ), 	\
		 					                      		   tt.name,				\
		 					                      	  	   s.entity				\
		 					                      	  from tb_session s,		\
														   tt_file tt           \
		 					                      	 where session_id_hash = $1 \
		 					                      )\
							 returning path, name";
			client.query(query, [cookies['AuthToken']], function (err, result) {
				done();
				if (result && result.rows[0]) {
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows[i];
						aws.get_upload_url('stp.image', row.name, row.path, get_url_callback);
					}
				} else {
					resp.status = ERROR;
					resp.message = "Error when uploading files.";
					if (err) {
						console.log(err);
					}
					return res.status(500).json(resp);
				}
			});
		});

	});
	app.use('/api/upload', router);
};