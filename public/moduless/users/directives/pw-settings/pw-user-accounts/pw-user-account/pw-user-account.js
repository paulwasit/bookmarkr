'use strict';

angular.module('users')
.directive('pwUserAccount', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/users/directives/pw-settings/pw-user-accounts/pw-user-account/pw-user-account.html',
		scope: { 
			provider: '@'
		},
		require: '^pwUserAccounts',
		
		link: function(scope, element, attrs, pwUserAccountsCtrl) { 
					
			scope.isConnected = function() {
				return pwUserAccountsCtrl.isConnectedSocialAccount (scope.provider);
			};
    }
  };
});