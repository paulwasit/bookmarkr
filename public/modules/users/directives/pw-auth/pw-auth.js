'use strict';

module.exports = function (ngModule) {
	
	require('./pw-auth-local/pw-auth-local')(ngModule);
	require('./pw-auth-strategies/pw-auth-strategies')(ngModule);
	
	ngModule.directive('pwAuth', function($location, Authentication) {
		return {
			restrict: 'E',
			template: require('./pw-auth.html'),
			scope: {
				signInOrUp: '@'
			},
			controller: 'pwAuthCtrl',
			link: function(scope, element, attrs) {
				scope.authentication = Authentication;
				if (scope.authentication.user || scope.signInOrUp === "up") $location.path('/');	// If user is signed in or tentative to sign up then redirect back home
			}		
		};
	})

	.controller('pwAuthCtrl', function($http, $scope, $state) {
		this.postCred = function(authPath, callback) {
			$http.post(authPath, $scope.credentials)
			.success(function(response) {
				$scope.authentication.user = response; // If successful we assign the response to the global user model
				$state.go($state.previous.state.name || 'app.home', $state.previous.params); // And redirect to the previous or home page
			})
			.error(function(response) {
				callback(response.message);
			});
		};	

	});
	
};