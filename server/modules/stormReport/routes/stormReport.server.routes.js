'use strict';

/**
 * Module dependencies.
 */
var policy = require('../policies/stormReport.server.policy'),
		controller = require('../controllers/stormReport.server.controller');

module.exports = function (app) {

  // Collection routes
  app.route('/api/stormReport').all(policy.isAllowed)
    .get(controller.list);
	
	// Harm Type routes
	/*
  app.route('/api/stormReport/:harmTypeSwitch').all(policy.isAllowed)
    .get(controller.harmTypeSwitch);
	*/
};
