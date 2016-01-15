'use strict';

angular.module('users')
.directive('pwAuthLocal', ['$location', 'PasswordValidator', function($location, PasswordValidator) {
  return {
		replace: true,
    restrict: 'E',
    templateUrl: 'modules/users/directives/pw-auth/pw-auth-local/pw-auth-local.html',
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
					console.log('here');
					scope.$broadcast('show-errors-check-validity', 'userForm');
					return false;
				}
				pwAuthCtrl.postCred ('/api/auth/sign' + scope.signInOrUp, function(error) {
					scope.error = error;
				});
			};
			
    }
		
  };
}]);