'use strict';

angular.module('users')
.directive('pwUserPassword', ['$http', 'PasswordValidator',
function($http, PasswordValidator) {
  return {
    restrict: 'E',
    templateUrl: 'modules/users/directives/pw-settings/pw-user-password/pw-user-password.html',		
		scope: {},
		link: function(scope, element, attrs) {
			
			scope.popoverMsg = PasswordValidator.getPopoverMsg();
			
			scope.changeUserPassword = function(isValid) {
				scope.success = scope.error = null;
				if (!isValid) {
					scope.$broadcast('show-errors-check-validity', 'passwordForm');
					return false;
				}
				$http.post('/api/users/password', scope.passwordDetails)
				.success(function(response) {
					scope.success = true;
					scope.passwordDetails = null;
				})
				.error(function(response) {
					scope.error = response.message;
				});
			};
			
    }
  };
}]);