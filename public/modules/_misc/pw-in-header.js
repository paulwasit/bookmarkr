'use strict';

module.exports = function (ngModule) {
	
	ngModule.directive('pwInHeader', function () {
		return function (scope, element, attrs) {
			
			var headerElement;
			//headerNotCollapsed, headerCollapsed;
			
			if (attrs.pwInHeader === 'notCollapsed') {
				headerElement = angular.element(headerNotCollapsed); 	// jshint ignore:line
			}
			else if (attrs.pwInHeader === 'notCollapsedRight') {
				headerElement = angular.element(headerNotCollapsedRight); 	// jshint ignore:line
			}
			else {
				headerElement = angular.element(headerCollapsed);			// jshint ignore:line
			}
			
			headerElement.append(element);
			
			scope.$on('$destroy', function() {
				element.remove();
			});
			
			
		};
	});

};