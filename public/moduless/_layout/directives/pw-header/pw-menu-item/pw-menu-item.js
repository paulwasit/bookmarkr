'use strict';

module.exports = function (ngModule) {
	
	ngModule.directive('pwMenuItems', function($state) {
		return {
			restrict: 'E',
			template: require('./pw-menu-item.html'),
			scope: {
				user: '=',
				menu: '='
			},
			link: function(scope, elem, attrs) {
				scope.$state = $state;
			}
		};
	});

};