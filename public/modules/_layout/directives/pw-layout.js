'use strict';

angular.module('layout').
directive('pwLayout', ['$state', function($state) {
	
	return {
		
		replace: true,
    restrict: 'E',
    templateUrl: 'modules/_layout/directives/pw-layout.html',
		scope: {},
		link: function(scope, element, attrs) {
			scope.sidebarIsCollapsed = true;
			scope.$on('$stateChangeSuccess', function() {
				scope.title = $state.current.title || ($state.current.data && $state.current.data.title) ? $state.current.data.title : undefined;
			});
			scope.title = $state.current.title || ($state.current.data && $state.current.data.title) ? $state.current.data.title : undefined;
		}
	
	};
	
}]);