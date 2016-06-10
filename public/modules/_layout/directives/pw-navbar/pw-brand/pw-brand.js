'use strict';

module.exports = function (ngModule) {
	ngModule.directive('pwBrand', function() {
		return {
			restrict: 'E',
			template: require('./pw-brand.html'),
			scope: {}	
		};
	});
};