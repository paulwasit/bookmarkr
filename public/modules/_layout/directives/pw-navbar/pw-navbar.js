'use strict';

module.exports = function (ngModule) {

	require('./pw-brand/pw-brand')(ngModule);						 // displays the svg logo
	require('./pw-menu-auth/pw-user-login')(ngModule);   // when not logged in, shows sign in / sign up buttons
	require('./pw-menu-auth/pw-user-info')(ngModule);    // when logged in, shows the user picture + menu (edit profile, etc.)
	require('./pw-menu-item/pw-menu-item')(ngModule);    // shows the menu item / dropdown
	require('../../../_misc/pw-click-outside')(ngModule);    // shows the menu item / dropdown
	
	ngModule.directive('pwNavbar', function(Authentication, Menus, $state, $rootScope) {
		
		return {
			
			restrict: 'E',
			template: require('./pw-navbar.html'),
			scope: {},
			
			link: function(scope, element, attrs) {
				
				scope.$state = $state;
				scope.brandStates= ['app.home','app.articles.list'];
				scope.authStates = ['app.home'];
				
				scope.isBrandDisplayed = function () {
					return scope.brandStates.map(function(item) { return scope.$state.includes(item); }).indexOf(true)===-1 ? false : true;						
				};
				
				scope.isAuthDisplayed = function () {
					return scope.authStates.map(function(item) { return scope.$state.includes(item); }).indexOf(true)===-1 ? false : true;						
				};
				
				scope.auth = Authentication;
				scope.isCollapsed = true;
				scope.menu = Menus.getMenu('topbar');
				
				// toggle collapse & broadcast event
				scope.toggleCollapse = function () {
					scope.isCollapsed = !scope.isCollapsed;
					$rootScope.$broadcast("toggle-navbar-collapse", scope.isCollapsed);
				}
				
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