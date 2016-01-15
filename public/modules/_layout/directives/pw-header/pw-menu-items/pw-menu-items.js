'use strict';

angular.module('layout')
.directive('pwMenuItems', ['$state', function($state) {
  return {
		replace: true,
    restrict: 'E',
    templateUrl: 'modules/_layout/directives/pw-header/pw-menu-items/pw-menu-items.html',
		scope: {
			user: '=',
			menu: '='
		},
		link: function(scope, elem, attrs) {
			scope.$state = $state;
		}
  };
}]);