var pg = require('pg');

module.exports = function (app) {
	var express = require('express');
	var router = express.Router();

	router.all('/', function (req, res, next) {
		var resp = {};
		var msg = req.body;
		var files = msg.files;
		if (!files) {
			resp.status = ERROR;
			resp.message = "Files metadata is required.";
			res.status(400).json(resp);
		}
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			if (!file.name || !file.type || file.size) {
				resp.status = ERROR;
				resp.message = "Files metadata missing required attributes.";
				res.status(400).json(resp);
			}
		}
		var insert_temp_table_callback = function () {
			var query = 'insert into tt_file( name, type, size ) values ';
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				query = query + '( ' + file.name + ', ' + file.type + ', ' + file.size + ' ),';
			}
			query = query.replace(/,$/g, '');
			client.query(query, function (err, result) {
				done();
				if (result) {
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
		};
		pg.connect(connectionString, function (err, client, done) {
			var query = 'create temp table tt_file( name, type varchar(64), size integer)';
			client.query(query, function (err, result) {
				done();
				if (result) {
					return insert_temp_table_callback();
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