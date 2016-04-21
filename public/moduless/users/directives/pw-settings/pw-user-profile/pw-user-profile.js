'use strict';

angular.module('users')
.directive('pwUserProfile', ['Authentication', 'Users', 
function(Authentication, Users) {
  return {
		replace: true,
    restrict: 'E',
    templateUrl: 'modules/users/directives/pw-settings/pw-user-profile/pw-user-profile.html',
		scope: {},
		link: function(scope, element, attrs) {
			
			scope.user = Authentication.user;
			
			scope.updateUserProfile = function(isValid) {
				
				scope.success = scope.error = null;
				if (!isValid) {
					scope.$broadcast('show-errors-check-validity', 'userForm');
					return false;
				}
				
				var user = new Users(scope.user);

				user.$update(function(response) {
					scope.$broadcast('show-errors-reset', 'userForm');
					scope.success = true;
					Authentication.user = response;
				}, 
				function(response) {
					scope.error = response.data.message;
				});

			};
			
    }
  };
}]);