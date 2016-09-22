'use strict';

/**
 * Module dependencies.
 */
var policy = require('../policies/contact.server.policy'),
    controller = require('../controllers/contact.server.controller');

module.exports = function (app) {
	// images loader
	app.route('/api/contact/sendEmail').all(policy.isAllowed)
		.post(controller.sendEmail);
};
