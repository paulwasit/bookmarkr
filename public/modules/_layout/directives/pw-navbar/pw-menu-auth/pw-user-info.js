'use strict';

module.exports = function (ngModule) {
		
	ngModule.directive('pwUserInfo', function() {
		return {
			restrict: 'A',
			template: require('./pw-user-info.html'),
			scope: {
				user: '='
			}
		};
	});
	
};