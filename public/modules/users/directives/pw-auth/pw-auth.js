'use strict';

angular.module('users')
.directive('pwAuth', ['$location', 'Authentication',
function($location, Authentication) {
  return {
    restrict: 'E',
    templateUrl: 'modules/users/directives/pw-auth/pw-auth.html',
		scope: {
			signInOrUp: '@'
		},
		controller: 'pwAuthCtrl',
		link: function(scope, element, attrs) {
			scope.authentication = Authentication;
			if (scope.authentication.user) $location.path('/');	// If user is signed in then redirect back home
    }		
  };

}])

.controller('pwAuthCtrl', ['$http', '$scope', '$state', function($http, $scope, $state) {
	
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

}]);