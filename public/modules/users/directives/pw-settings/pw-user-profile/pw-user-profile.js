'use strict';

module.exports = function (ngModule) {

	ngModule.directive('pwUserProfile', function() {
		return {
			restrict: 'A',
			template: require('./pw-user-profile.html'),
			scope: {
				userForm: "=",
				user: "="
			},
			link: function(scope, element, attrs) {
				
				// require profile fields only when at least one is dirty (ie. only when the user has interacted with it)
				scope.check = function (userform) {
					return userform.firstName.$dirty || userform.lastName.$dirty || userform.email.$dirty || userform.username.$dirty;
				};
				
			}
		};
	});
	
};