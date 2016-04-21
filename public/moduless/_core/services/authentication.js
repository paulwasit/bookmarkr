'use strict';

// Authentication service for user variables
module.exports = function (ngModule) {
	
	ngModule.factory('Authentication', function ($window) {
		var auth = {
			user: $window.user
		};
		return auth;
	});
	
};
