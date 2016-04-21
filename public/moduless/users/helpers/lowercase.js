'use strict';

module.exports = function (ngModule) {

	ngModule.directive('lowercase', function () {
		return {
			require: 'ngModel',
			link: function (scope, element, attrs, modelCtrl) {
				modelCtrl.$parsers.push(function (input) {
					return input ? input.toLowerCase() : '';
				});
				element.css('text-transform', 'lowercase');
			}
		};
	});
	
};
