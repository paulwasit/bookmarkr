'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
	nodemailer = require('nodemailer');
	
var config = {};
config.contactMailer = {
	from: "plat.sebastien@hotmail.fr",
	to: "plat.sebastien@hotmail.fr",
	options: {
		service: "hotmail",
		auth: {
			user: "plat.sebastien@hotmail.fr",
			pass: "KoRn5972"
		}
	}
};

var smtpTransport = nodemailer.createTransport(config.contactMailer.options);
	
exports.sendEmail = function (req, res) {
	
	var emailHTML = '<p><strong>From:</strong> {{name}}</p>' +
									'<p><strong>Organization:</strong> {{organization}}</p>' +
									'<p><strong>Email:</strong> {{email}}</p>' +
									'<br/>' +
									'<p>{{message}}</p>'
	
	var sendMail = smtpTransport.templateSender({
		subject: 'Contact Form - {{name}}{{orga}}',
		text: '{{message}}',
		html: emailHTML
	});
	
	sendMail (
		{
			from: config.contactMailer.from,
			to: config.contactMailer.from,
			replyTo: req.body.email
		}, 
		{
			name: req.body.name,
			email: req.body.email,
			organization: req.body.organization || "-",
			orga: req.body.organization ? " - " + req.body.organization : "",
			message: req.body.message
		}, 
		function(err, info) {
			if(err){
				return res.status(400).send({
					message: 'The email has unfortunately not been sent. Please try again later.'
				});
			}
			else {
				res.send({
					message: 'The email has been sent. Thank you for contacting me.'
				});
			}
		}
	);
	
	
	
	/*
	console.log(emailHTML);
	
	var orga = req.body.organization ? " - " + req.body.organization : "",
			subject = 'Contact Form - ' + req.body.name + orga;
		
	var mailOptions = {
		to: config.contactMailer.to,
		from: config.contactMailer.from,
		replyTo: req.body.email,
		subject: subject,
		html: emailHTML
	};
		
	smtpTransport.sendMail(mailOptions, function (err) {
		if (!err) {
			res.send({
				message: 'The email has been sent. Thank you for contacting me.'
			});
		} 
		else {
			return res.status(400).send({
				message: 'The email has unfortunately not been sent. Please try again later.'
			});
		}
	});
	*/
	
};