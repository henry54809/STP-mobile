String.prototype.splice = function (idx, rem, s) {
	return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
};

//Send mail functions
var nodemailer = require('nodemailer');
var sendmailTransport = require('nodemailer-sendmail-transport');

var transporter = nodemailer.createTransport(sendmailTransport({
	path: '/usr/sbin/sendmail'
}));

var sendmail = function (data, callback) {
	transporter.sendMail(data, callback);
};

module.exports.sendmail = sendmail;