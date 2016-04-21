'use strict';

module.exports = function (ngModule) {
	
	require('./pw-aside/pw-aside')(ngModule);
	require('./pw-header/pw-header')(ngModule);
	
	ngModule.directive('pwLayout', function($state) {
		
		return {
			replace: true,
			restrict: 'E',
			template: require('./pw-layout.html'),
			scope: {},
			link: function(scope, element, attrs) {
				scope.sidebarIsCollapsed = true;
				scope.$on('$stateChangeSuccess', function() {
					scope.title = $state.current.title || ($state.current.data && $state.current.data.title) ? $state.current.data.title : undefined;
				});
				scope.title = $state.current.title || ($state.current.data && $state.current.data.title) ? $state.current.data.title : undefined;
			}
		};
		
	});
	
};