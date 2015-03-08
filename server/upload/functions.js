var pg = require('pg');

//Update the upload_url in file upload requests
var update_upload_requests = function (updated_files) {

	var client = new pg.Client(connectionString);
	var query = "update tb_file_upload_request set upload_url = $1 where file_upload_request = $2";
    console.log(updated_files);
	for (var i = 0; i < updated_files.length; i++) {
		var file = updated_files[i];
		var result = client.query(query, [file.upload_url, file.file_upload_request]);
		result.on('error', function (err) {
			console.log(err);
		});
	}
	client.connect();
	client.on('drain', function () {
		console.log("Drained.");
	});
};

module.exports.update_upload_requests = update_upload_requests;
