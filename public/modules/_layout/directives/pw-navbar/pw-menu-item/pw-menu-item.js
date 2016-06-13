'use strict';

module.exports = function (ngModule) {
	
	ngModule.directive('pwMenuItems', function($state) {
		return {
			restrict: 'A',
			template: require('./pw-menu-item.html'),
			scope: {
				user: '=',
				menu: '='
			},
			link: function(scope, elem, attrs) {
				scope.$state = $state;
				scope.isDisplayed = function (itemDisplayState) {
					if (typeof itemDisplayState === "undefined" || $state.includes(itemDisplayState)) {
						return true;
					}
					return false;
				};
			}
		};
	});

};