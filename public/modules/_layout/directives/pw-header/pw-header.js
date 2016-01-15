'use strict';

angular.module('layout').
directive('pwHeader', ['Authentication', 'Menus',
function(Authentication, Menus) {
	
	return {
		
		replace: true,
    restrict: 'E',
    templateUrl: 'modules/_layout/directives/pw-header/pw-header.html',
		scope: {},
		
		link: function(scope, element, attrs) {
			
			scope.auth = Authentication;
			scope.isCollapsed = true;
			scope.menu = Menus.getMenu('topbar');
			
			scope.toggleCollapsibleMenu = function() {
				scope.isCollapsed = !scope.isCollapsed;
			};
			
			// action on click-outside
			scope.closeThis = function () {
        scope.isCollapsed = true;
			};
			
			/*Collapsing the menu after navigation*/
			scope.$on('$stateChangeSuccess', function() {
				//scope.isCollapsed = false;
			});
			
    }
	
	};
	
}]);