'use strict';

angular.module('layout')
.directive('pwUserInfo', function() {
  return {
		replace: true,
    restrict: 'E',
    templateUrl: 'modules/_layout/directives/pw-header/pw-menu-auth/pw-user-info.html',
		scope: {
			user: '='
		}
  };
});