'use strict';

angular.module('users.admin')
.directive('pwUserView', ['$state', 'Authentication',
function($state, Authentication) {
  return {
    restrict: 'E',
    templateUrl: 'modules/users/directives/pw-users-admin/pw-user-view/pw-user-view.html',
		scope: {
			user: '='
		},
		link: function(scope, element, attrs) {
			
			scope.authentication = Authentication;
			
			scope.remove = function (user) {
				if (confirm('Are you sure you want to delete this user?')) {
					if (user) {
						user.$remove();
						scope.users.splice(scope.users.indexOf(user), 1);
					} 
					else {
						scope.user.$remove(function () {
							$state.go('app.admin.users');
						});
					}
				}
			};
			
    }
		
  };
}]);