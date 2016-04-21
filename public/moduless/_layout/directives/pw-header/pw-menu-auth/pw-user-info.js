'use strict';

module.exports = function (ngModule) {
		
	ngModule.directive('pwUserInfo', function() {
		return {
			restrict: 'E',
			template: require('./pw-user-info.html'),
			scope: {
				user: '='
			}
		};
	});
	
};