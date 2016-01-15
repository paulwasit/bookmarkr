'use strict';

angular.module('shows')
.directive('pwShowList', function() {
  return {	
		restrict: 'E',
		replace: true,
    templateUrl: 'modules/shows/directives/pw-show-list/pw-show-list.html',
		scope: {
			query: '='
		},
		controller: ['$scope', function($scope) {
			this.activeGenres = [];
		}],
		controllerAs: 'ctrl'
  };
});