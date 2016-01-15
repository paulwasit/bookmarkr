'use strict';

angular.module('layout')
.directive('pwUserLogin', function() {
  return {
		replace: true,
    restrict: 'E',
    templateUrl: 'modules/_layout/directives/pw-header/pw-menu-auth/pw-user-login.html',
		scope: {}
	};
});