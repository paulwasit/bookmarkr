'use strict';

angular.module('users')
.directive('pwAuthStrategies', ['$state', '$window', function($state, $window) {
  return {
		replace: true,
    restrict: 'E',
    templateUrl: 'modules/users/directives/pw-auth/pw-auth-strategies/pw-auth-strategies.html',
		scope: {
			signInOrUp: '='
		},
		link: function (scope, elem, attrs) {
			
			// OAuth provider request
			scope.callOauthProvider = function (url) {
				if ($state.previous && $state.previous.href) {
					url += '?redirect_to=' + encodeURIComponent($state.previous.href);
				}

				// Effectively call OAuth authentication route:
				$window.location.href = url;
			};
			
		}
  };
}]);