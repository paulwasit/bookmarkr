'use strict';

module.exports = function (ngModule) {
	
	require('./pw-user-account/pw-user-account')(ngModule);
	
	ngModule.directive('pwUserAccounts', function($location, Authentication) {
		return {
			restrict: 'E',
			template: require('./pw-user-accounts.html'),
			scope: {},
			controller: 'pwUserAccountsCtrl',
			link: function(scope, element, attrs) {
				scope.user = Authentication.user;
			}
		};
	})

	.controller('pwUserAccountsCtrl', ['$http', '$scope', function($http, $scope) {

		// Check if provider is already in use with current user
		this.isConnectedSocialAccount = function(provider) {
			return ($scope.user.provider === provider) || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Check if there are additional accounts 
		this.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}
			return false;
		};
		
		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;
			$http.delete('/api/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				//$scope.user = Authentication.user = response;
				$scope.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
		
	}]);
	
};
