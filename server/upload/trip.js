var pg = require('pg');
var aws = require('../util/aws');

module.exports = function (app) {
	var express = require('express');
	var router = express.Router();

	router.post('/trip', function (req, res) {
		var resp = {};
		var msg = req.body;
		var cookies = req.cookies;
		var file_upload_requests = req.file_upload_requests;
		if (!msg || !msg.trip || !msg.files) {
			resp.status = ERROR;
			resp.message = "Missing trip id or files to upload.";
			return res.json(resp);
		}
		var trip_name = msg.name;
		if (!trip_name) {
			trip_name = "Untitled";
		}

		var updated_files = [];

		var get_url_callback = function (file) {
			updated_files.push(file);
			if (updated_files.length === msg.files.length) {
				resp.status = OK;
				resp.files = updated_files;
				res.json(resp);
				var upload_functions = require('./functions');
				return upload_functions.update_upload_requests(updated_files);
			}
		};

		pg.connect(connectionString, function (err, client, done) {
			var query = "insert into tb_file (									\
													file_type,					\
													path,						\
													name,						\
													content_type, 				\
													creator,					\
													file_upload_request       	\
												  ) 							\
		 					                      (								\
		 					                      	select fn_get_or_create_file_type(fpr.file_metadata->>'type', null),		\
		 					                      		   regexp_replace( random()::text, '^0\\.', '' ) 	\
		 					                      		   || '/' ||fn_random_text_md5(20)				\
		 					                      		   || regexp_replace( fpr.file_metadata->>'name', '\\S*\\.', '.' ), 	\
		 					                      		   fpr.file_metadata->>'name',	\
		 					                      		   fpr.file_metadata->>'type',	\
		 					                      	  	   $1,							\
		 					                      	  	   fpr.file_upload_request  	\
		 					                      	  from tb_file_upload_request fpr 	\
		 					                      	 where fpr.file_upload_request in ( ";
			for (var i = 0; i < file_upload_requests.length; i++) {
				query = query + file_upload_requests[i].file_upload_request + ", ";
			}
			query = query.replace(/,\s*$/g, "");
			query = query + "						)	\
		 					                      ) 	\
							 returning path, name, file_upload_request, content_type";
			client.query(query, [req.entity], function (err, result) {
				done();
				if (result && result.rows[0]) {
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows[i];
						aws.get_upload_url('stp.image', row, get_url_callback);
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