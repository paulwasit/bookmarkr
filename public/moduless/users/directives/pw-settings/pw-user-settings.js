'use strict';

angular.module('users')
.directive('pwUserSettings', ['Authentication',
function(Authentication) {
  return {
    restrict: 'E',
    templateUrl: 'modules/users/directives/pw-settings/pw-user-settings.html',
		scope: {},
		link: function(scope, element, attrs) {
			scope.user = Authentication.user;
    }
  };
}]);