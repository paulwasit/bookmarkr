'use strict';

module.exports = function (ngModule) {
	
	//require('./pw-user-accounts/pw-user-accounts')(ngModule);
	require('./pw-user-password/pw-user-password')(ngModule);
	require('./pw-user-picture/pw-user-picture')(ngModule);
	require('./pw-user-profile/pw-user-profile')(ngModule);
	
	require("../../rest.js")(ngModule);
	
	ngModule.directive('pwUserSettings', function(Authentication, Notification, Users, $http) {
		return {
			restrict: 'E',
			template: require('./pw-user-settings.html'),
			scope: {},
			controller: ["$scope", function ($scope) {
				$scope.user = Authentication.user;
			}],
			link: function(scope, element, attrs) {
				
				scope.oldUser = angular.copy(scope.user);
				
				scope.toUpdate = false;
				
				// check if user has changed
				scope.$watch('user', function(newValue){
					scope.userHasChanged = !angular.equals(newValue,scope.oldUser)
					scope.toUpdate = scope.userHasChanged || scope.passwordHasChanged;
				},true);
				
				// check if password has changed
				scope.$watch('passwordDetails', function(newValue){
					scope.passwordHasChanged = typeof newValue !== "undefined";
					scope.toUpdate = scope.userHasChanged || scope.passwordHasChanged;
				},true);
				
				scope.updateUserProfile = function(isValid) {
					
					scope.success = scope.error = null;
					if (!isValid) {
						scope.$broadcast('show-errors-check-validity', 'userForm');
						return false;
					}
					
					var user = new Users(scope.user);
					
					if (scope.userHasChanged) {
						user.$update(function(response) {
							scope.$broadcast('show-errors-reset', 'userForm');
							scope.success = true;
							scope.oldUser = response;
							Authentication.user = response;
							Notification.success('Profile successfully updated');
						}, 
						function(response) {
							scope.error = response.data.message;
							Notification.error('Profile update has failed :(');
						});
					}
					
					if (scope.passwordHasChanged) {
						$http.post('/api/users/password', scope.passwordDetails)
						.success(function(response) {
							scope.$broadcast('show-errors-reset', 'userForm');
							scope.success = true;
							Notification.success('Password successfully updated');
						})
						.error(function(response) {
							scope.error = response.message;
							Notification.error('Password update has failed :(');
						});
					}
					
					scope.userHasChanged = false;
					scope.passwordDetails = undefined;
					scope.passwordHasChanged = false;
					scope.toUpdate = false;
					scope.userForm.$setPristine();
					
				};
				
			}
		};
	});
	
};