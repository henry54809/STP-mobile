//webuser PulXn6|gqn}%
//https://440616737692.signin.aws.amazon.com/console

//SNS ARN: arn:aws:sns:us-east-1:440616737692:File_Uploaded
var AWS = require('aws-sdk');

var s3 = new AWS.S3();

var get_url = function (bucket, path, callback) {
	var params = {
		Bucket: bucket,
		Key: path,
		Expires: 3600
	};
	s3.getSignedUrl('getObject', params, function (err, url) {
		callback(url);
	});
};

var get_upload_url = function (bucket, name, path, callback) {
	var params = {
		Bucket: bucket,
		Key: path,
		ACL: 'authenticated-read'
	};

	s3.getSignedUrl('putObject', params, function (err, url) {
		if (err) {
			console.log(err);
		}
		callback(name, url);
	});
};

module.exports.get_url = get_url;
module.exports.get_upload_url = get_upload_url;