'use strict';

angular.module('users')
.directive('pwPassReset', ['$http', '$location', '$stateParams', 'Authentication', 'PasswordValidator',
function($http, $location, $stateParams, Authentication, PasswordValidator) {
  return {
		replace: true,
    restrict: 'E',
    templateUrl: 'modules/users/directives/pw-pass/pw-pass-reset/pw-pass-reset.html',
		scope: {},
		link: function(scope, element, attrs) {
			
			scope.authentication = Authentication;
			if (scope.authentication.user) $location.path('/');
			
			scope.popoverMsg = PasswordValidator.getPopoverMsg();
			
			scope.resetUserPassword = function(isValid) {
				scope.success = scope.error = null;
				if (!isValid) {
					scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');
					return false;
				}
				scope.pending = true;
				$http.post('/api/auth/reset/' + $stateParams.token, scope.passwordDetails)
				.success(function(response) {
					scope.passwordDetails = null; 	// If successful show success message and clear form
					Authentication.user = response; // Attach user profile
					$location.path('/password/reset/success'); // And redirect to the index page
				})
				.error(function(response) {
					scope.error = response.message;
				});
			};
			
    }
		
  };
}]);