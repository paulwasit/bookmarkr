'use strict';

module.exports = function (ngModule) {
	
	ngModule.directive('pwUserLogin', function() {
		return {
			restrict: 'E',
			template: require('./pw-user-login.html'),
			scope: {}
		};
	});
	
};