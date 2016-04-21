'use strict';

module.exports = function (ngModule) {
	
	require('./pw-aside-menu-item/pw-aside-menu-item')(ngModule);
	
	ngModule.directive('pwAside', function(Menus) {
		
		return {
			
			restrict: 'E',
			template: require('./pw-aside.html'),
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
		
	})

	.controller('pwAsideCtrl', function($scope, Authentication) {
		
		$scope.auth = Authentication;
		
		this.shouldRender = function(item) {
			return (item.shouldRender($scope.auth.user));
		};
		
	});

};
