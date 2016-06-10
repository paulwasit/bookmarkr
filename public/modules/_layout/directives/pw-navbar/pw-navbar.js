'use strict';

module.exports = function (ngModule) {

	require('./pw-brand/pw-brand')(ngModule);						 // displays the svg logo
	require('./pw-menu-auth/pw-user-login')(ngModule);   // when not logged in, shows sign in / sign up buttons
	require('./pw-menu-auth/pw-user-info')(ngModule);    // when logged in, shows the user picture + menu (edit profile, etc.)
	require('./pw-menu-item/pw-menu-item')(ngModule);    // shows the menu item / dropdown
	
	ngModule.directive('pwNavbar', function(Authentication, Menus) {
		
		return {
			
			restrict: 'E',
			template: require('./pw-navbar.html'),
			scope: {},
			
			link: function(scope, element, attrs) {
				
				scope.auth = Authentication;
				scope.isCollapsed = true;
				scope.menu = Menus.getMenu('topbar');
				
				// action on click-outside
				scope.closeThis = function () {
					scope.isCollapsed = true;
				};
				
				/*Collapsing the menu after navigation*/
				scope.$on('$stateChangeSuccess', function() {
					scope.isCollapsed = true;
				});
				
			}
		
		};
		
	});
	
};