'use strict';

module.exports = function (ngModule) {
	
	// in the directive
	require('../../../helpers/password-validator.service')(ngModule); 
	
	// in the dom
	require('../../../helpers/lowercase')(ngModule); // used for email & username
	require('../../../helpers/password-validator')(ngModule); // used for signup - check if strong password
	require('../../../helpers/show-errors')(ngModule); 
	
	ngModule.directive('pwAuthLocal', function($location, PasswordValidator) {
		return {
			restrict: 'E',
			template: require('./pw-auth-local.html'),
			scope: {
				credentials: '=',
				signInOrUp: '='
			},
			require: '^pwAuth',
			
			link: function(scope, element, attrs, pwAuthCtrl) { 
				
				scope.popoverMsg = PasswordValidator.getPopoverMsg();			
				scope.error = $location.search().err;
				
				scope.submitAction = function(isValid) {
					scope.error = null;
					if (!isValid) {
						scope.$broadcast('show-errors-check-validity', 'userForm');
						return false;
					}
					pwAuthCtrl.postCred ('/api/auth/sign' + scope.signInOrUp, function(error) {
						scope.error = error;
					});
				};
				
			}
			
		};
	});
	
};