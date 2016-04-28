'use strict';

angular.module('shows')
.directive('pwTagList', [function() {
  return {
		replace: true,
    restrict: 'E',
    templateUrl: 'modules/shows/directives/pw-show-list/pw-category/pw-category-list.html',
		scope: {
			tags: '='
		},
		link: function(scope, element, attrs) {

    }		
  };
}]);