var pg = require('pg');

module.exports = function (app) {
	var express = require('express');
	var router = express.Router();
	var multer = require('multer');

	router.post('/', [multer({
		dest: '../../www/uploads/'
	}), function (req, res) {
		console.log(req.body); // form fields
		console.log(req.files); // form files
		res.status(204).end();
	}]);
	app.use('/api/uploads', router);
};