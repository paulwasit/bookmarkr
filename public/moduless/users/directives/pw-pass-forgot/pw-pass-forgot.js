'use strict';

angular.module('users')
.directive('pwPassForgot', ['$http', '$location', 'Authentication',
function($http, $location, Authentication) {
  return {
		replace: true,
    restrict: 'E',
    templateUrl: 'modules/users/directives/pw-pass/pw-pass-forgot/pw-pass-forgot.html',
		scope: {},
		link: function(scope, element, attrs) {
			
			scope.authentication = Authentication;
			if (scope.authentication.user) $location.path('/');
			
			scope.askForPasswordReset = function(isValid) {
				scope.success = scope.error = null;
				if (!isValid) {
					scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');
					return false;
				}
				scope.pending = true;
				console.log(scope.credentials);
				$http.post('/api/auth/forgot', scope.credentials)
				.success(function(response) {
					console.log('success: ', response);
					scope.pending = false;
					scope.credentials = null;					 // Clear form
					scope.success = response.message;  // Show user success message
				})
				.error(function(response) {
					console.log('error: ', response);
					scope.pending = false;
					scope.credentials = null;					 // Clear form and clear form
					scope.error = response.message;    // Show user error message
				});
			};
			
    }
		
  };
}]);