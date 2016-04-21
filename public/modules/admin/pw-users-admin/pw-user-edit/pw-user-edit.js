'use strict';

angular.module('users.admin')
.directive('pwUserEdit', ['$state', 'Authentication',
function($state, Authentication) {
  return {
    restrict: 'E',
    templateUrl: 'modules/users/directives/pw-users-admin/pw-user-edit/pw-user-edit.html',
		scope: {
			user: '='
		},
		link: function(scope, element, attrs) {
			
			scope.authentication = Authentication;
			
			scope.update = function (isValid) {
				if (!isValid) {
					scope.$broadcast('show-errors-check-validity', 'userForm');
					return false;
				}

				var user = scope.user;

				user.$update(function () {
					$state.go('app.admin.user', {
						userId: user._id
					});
				}, function (errorResponse) {
					scope.error = errorResponse.data.message;
				});
			};
			
    }
		
  };
}]);