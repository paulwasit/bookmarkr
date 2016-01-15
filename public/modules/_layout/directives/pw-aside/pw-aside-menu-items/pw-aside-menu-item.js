'use strict';

angular.module('layout')
.directive('pwAsideMenuItem', ['$state', function($state) {
  return {
		replace: true,
    restrict: 'E',
		templateUrl: 'modules/_layout/directives/pw-aside/pw-aside-menu-items/pw-aside-menu-item.html',
		scope: {
			user: '=',
			item: '=',
			sidebarIsCollapsed: '='
		},		
		link: function(scope, element, attrs) { 
      
			scope.$state = $state;
			
			scope.$watch('sidebarIsCollapsed', function (newVal, oldVal) {
				if (newVal === oldVal) { return; } //fired during link init
				scope.menuIsCollapsed = true;
			}, true);
			
			scope.menuIsCollapsed = true;
			
			scope.toggleCollapsibleMenu = function() {
				scope.menuIsCollapsed = !scope.menuIsCollapsed;
			};
			
			// we collapse all menus that are not the active one
			scope.$on('$stateChangeSuccess', function() {
				if (!$state.includes(scope.item.state) && scope.sidebarIsCollapsed) {
					scope.menuIsCollapsed = true;
				}
			});
			
    }
		
  };
}]);