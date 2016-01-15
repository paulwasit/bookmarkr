'use strict';

angular.module('layout')
.directive('pwAside', ['Menus', function(Menus) {
	
	return {
		
		replace: true,
    restrict: 'E',
    templateUrl: 'modules/_layout/directives/pw-aside/pw-aside.html',
		scope: {
			sidebarIsCollapsed: '='
		},
		
		controller: 'pwAsideCtrl',
		controllerAs: 'ctrl',

		link: function(scope, element, attrs, ctrl) {
	
			scope.menu = Menus.getMenu('sidebar');
			
			scope.toggleCollapsibleSidebar = function() {
				scope.sidebarIsCollapsed = !scope.sidebarIsCollapsed;
			};
			
			// action on click-outside - only on small display
			scope.closeThis = function () {
				var el = document.getElementById('navbar-toggle');
				if (el !== null && el.offsetParent !== null) {
					scope.sidebarIsCollapsed = true;
				}
			};

			//Collapsing the menu after navigation
			scope.$on('$stateChangeSuccess', function() {
				scope.closeThis();
			});
			
    }
	
	};
	
}])

.controller('pwAsideCtrl', ['$scope', 'Authentication', function($scope, Authentication) {
	
	$scope.auth = Authentication;
	
	this.shouldRender = function(item) {
		return (item.shouldRender($scope.auth.user));
	};
	
}]);
