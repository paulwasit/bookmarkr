'use strict';

module.exports = function (ngModule) {
	
	require('./pw-aside/pw-aside')(ngModule);
	require('./pw-navbar/pw-navbar')(ngModule);
	
	ngModule.directive('pwLayout', function($state) {
		
		return {
			restrict: 'E',
			template: require('./pw-layout.html'),
			scope: {},
			link: function(scope, element, attrs) {
				scope.$state = $state;
				scope.sidebarIsCollapsed = true;				
			}
		};
		
	});
	
};