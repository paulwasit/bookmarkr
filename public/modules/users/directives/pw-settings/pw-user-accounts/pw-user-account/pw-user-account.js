'use strict';

module.exports = function (ngModule) {
	
	ngModule.directive('pwUserAccount', function() {
		return {
			restrict: 'E',
			template: require('./pw-user-account.html'),
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
	
};