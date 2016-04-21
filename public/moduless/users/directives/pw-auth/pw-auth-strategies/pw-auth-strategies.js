'use strict';

module.exports = function (ngModule) {
	
	ngModule.directive('pwAuthStrategies', function($state, $window) {
		return {
			restrict: 'E',
			template: require('./pw-auth-strategies.html'),
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
	});
	
};