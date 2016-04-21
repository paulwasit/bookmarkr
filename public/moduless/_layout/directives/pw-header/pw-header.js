'use strict';

module.exports = function (ngModule) {

	require('./pw-brand/pw-brand')(ngModule);
	require('./pw-menu-auth/pw-user-login')(ngModule);
	require('./pw-menu-auth/pw-user-info')(ngModule);
	require('./pw-menu-item/pw-menu-item')(ngModule);
	
	ngModule.directive('pwHeader', function(Authentication, Menus) {
		
		return {
			
			restrict: 'E',
			template: require('./pw-header.html'),
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
		
	});
	
};