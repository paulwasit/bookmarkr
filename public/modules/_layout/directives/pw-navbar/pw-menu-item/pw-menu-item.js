'use strict';

module.exports = function (ngModule) {
	
	ngModule.directive('pwMenuItems', function($state) {
		return {
			restrict: 'A',
			template: require('./pw-menu-item.html'),
			scope: {
				user: '=',
				menu: '=',
				placement: '@'
			},
			link: function(scope, elem, attrs) {
				scope.$state = $state;
				scope.isDisplayed = function (itemDisplayState, itemPlacement) {
					if (scope.placement !== itemPlacement) {
						return false;
					}
					else if (itemDisplayState instanceof Array && itemDisplayState.length>0) {
						return itemDisplayState.map(function(item) { return scope.$state.includes(item); }).indexOf(true)===-1 ? false : true;						
					}
					else if (typeof itemDisplayState === "undefined" || (typeof itemDisplayState === "string" && scope.$state.includes(itemDisplayState))) {
						return true;
					}
					return false;
				};
			}
		};
	});

};