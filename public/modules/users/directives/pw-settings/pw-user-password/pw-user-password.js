'use strict';

module.exports = function (ngModule) {
	
	//require('../../../helpers/show-errors')(ngModule); 
	require('../../../helpers/password-verify')(ngModule);
	require('../../../helpers/password-validator')(ngModule);
	require('../../../helpers/password-validator.service')(ngModule);
	
	ngModule.directive('pwUserPassword', function(PasswordValidator) {
		return {
			restrict: 'A',
			template: require('./pw-user-password.html'),		
			scope: {
				userForm: "=",
				passwordDetails: "="
			},
			link: function(scope, element, attrs) {
				
				// require password fields only when at least one is dirty (ie. only when the user has interacted with it)
				scope.check = function (userform) {
					return userform.currentPassword.$dirty || userform.newPassword.$dirty || userform.verifyPassword.$dirty;
				};
				
				scope.checkStrength = function (passwordErrors, keyword) {
					if (typeof passwordErrors === "undefined") return;
					return (passwordErrors.join(" ").includes(keyword)) ? 'text-danger' : 'text-success';
				};
				
				scope.popoverMsg = PasswordValidator.getPopoverMsg();
				
			}
		};
	});
	
};