var pg = require('pg');

module.exports = function (app) {
	var express = require('express');
	var router = express.Router();

	router.put('/consumed', function (req, res) {
		var resp = {};
		var msg = req.body;
		var name = msg.name;
		if (!name) {
			resp.status = ERROR;
			resp.message = "Files name is required.";
			return res.status(400).json(resp);
		}
		var query = 'update tb_file_upload_request fpr  \
						set uploaded = now()	   		\
					   from tb_file f 					\
					  where f.file_upload_request = fpr.file_upload_request \
					    and f.path  = $1';
		pg.connect(connectionString, function (err, client, done) {
			client.query(query, [name], function (err, result) {
				done();
				if (result) {
					resp.status = OK;
					resp.message = "File consumed.";
					return res.json(resp);
				} else {
					resp.status = ERROR;
					resp.message = "File not found.";
					if (err) {
						console.log(err);
					}
					return res.status(404).json(resp);
				}
			});
		});
	});

	router.all('/*', function (req, res, next) {
		var resp = {};
		var msg = req.body;
		var files = msg.files;
		if (!files || files.length == 0) {
			resp.status = ERROR;
			resp.message = "Files metadata is required.";
			return res.status(400).json(resp);
		}
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			if (!file.name || !file.type || !file.size) {
				resp.status = ERROR;
				resp.message = "Files metadata missing required attributes.";
				return res.status(400).json(resp);
			}
		}

		var query = 'insert into tb_file_upload_request( file_metadata, requester ) values ';
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			query = query + "( '" + JSON.stringify(file) + "'::json, " + req.entity + " ),";
		}

		query = query.replace(/,$/g, '');
		query = query + ' returning file_upload_request';
		pg.connect(connectionString, function (err, client, done) {
			client.query(query, function (err, result) {
				done();
				if (result) {
					req.file_upload_requests = result.rows;
					return next();
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