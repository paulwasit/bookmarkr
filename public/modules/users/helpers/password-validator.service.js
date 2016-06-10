'use strict';

module.exports = function (ngModule) {
	
	ngModule.factory('PasswordValidator', function ($window) {
		
		var owasp = require('owasp-password-strength-test');
		
		return {
			getResult: function (password) {
				var result = owasp.test(password);
				return result;
			},
			getPopoverMsg: function () {
				var popoverMsg = 'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.';
				return popoverMsg;
			}
		};
	});

};